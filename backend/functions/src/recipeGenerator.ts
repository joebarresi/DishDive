import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import * as ffmpeg from "fluent-ffmpeg";
import * as ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { Bucket, Storage } from "@google-cloud/storage";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { SpeechClient } from "@google-cloud/speech";

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Initialize clients
const storage = new Storage();
const visionClient = new ImageAnnotatorClient();
const speechClient = new SpeechClient();

// Get Firestore from the admin app that's initialized in index.ts
// Don't initialize a new app here
const getDb = () => admin.firestore();

/**
 * Function that triggers when a new video is uploaded to Firebase Storage.
 * It generates a recipe from the video by analyzing frames and
 * transcribing audio.
 */
export const generateRecipeFromVideo = functions.runWith({
  timeoutSeconds: 540, // 9 minutes
  memory: "2GB",
}).storage
  .object()
  .onFinalize(async (object) => {
    // Check if this is a video file
    const filePath = object.name;
    if (!filePath) return;

    console.log(`File Path of upload: ${filePath}`);

    // Only process videos in the 'posts' directory
    if (!filePath.startsWith("posts/") ||
        !filePath.match(/\.(mp4|mov|avi|wmv)$/i)) {
      console.log("Not a video in posts directory, skipping:", filePath);
      return;
    }

    console.log(`Processing video: ${filePath}`);

    const bucket = storage.bucket(object.bucket);
    const videoId = path.basename(filePath).split(".")[0];
    const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const tempOutputDir = path.join(os.tmpdir(), `frames-${videoId}`);
    const tempAudioPath = path.join(os.tmpdir(), `audio-${videoId}.wav`);

    try {
      // Create temp directories
      fs.mkdirSync(tempOutputDir, { recursive: true });

      // Download video file
      await bucket.file(filePath).download({ destination: tempFilePath });
      console.log(`Video downloaded to ${tempFilePath}`);

      // Process in parallel
      const [visualAnalysis, audioTranscript] = await Promise.all([
        extractAndAnalyzeFrames(
          tempFilePath,
          tempOutputDir,
          visionClient,
        ),
        extractAndTranscribeAudio(
          tempFilePath,
          tempAudioPath,
          speechClient,
          bucket,
          videoId,
        ),
      ]);

      // Combine analyses to generate recipe
      const recipe = generateRecipe(visualAnalysis, audioTranscript);

      // Get Firestore instance
      const db = getDb();

      // Store recipe in Firestore
      await db.collection("recipes").doc(videoId).set({
        title: recipe.title,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        videoRef: filePath,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Recipe generated and stored for video: ${filePath}`);

      // Update the post document to include the recipe reference
      // eslint-disable-next-line max-len
      const postQuery = await db.collection("post").where("id", "==", videoId).get();
      if (!postQuery.empty) {
        const postDoc = postQuery.docs[0];
        await postDoc.ref.update({
          hasRecipe: true,
          recipeId: videoId,
        });
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
    } finally {
      // Cleanup temp files
      try {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        if (fs.existsSync(tempOutputDir)) {
          fs.rmdirSync(tempOutputDir, { recursive: true });
        }
        if (fs.existsSync(tempAudioPath)) fs.unlinkSync(tempAudioPath);
      } catch (cleanupError) {
        console.error("Error cleaning up temp files:", cleanupError);
      }
    }
  });

/**
 * Extract frames from video and analyze them
 * @param {string} videoPath Path to the video file
 * @param {string} outputDir Directory to save extracted frames
 * @param {ImageAnnotatorClient} visionClient Vision API client
 * @return {Promise<object>} Analysis results
 */
async function extractAndAnalyzeFrames(
  videoPath: string,
  outputDir: string,
  visionClient: ImageAnnotatorClient,
): Promise<Record<string, unknown>> {
  // Extract key frames (1 frame every 3 seconds)
  await new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions(["-vf fps=1/3"])
      .output(`${outputDir}/frame-%03d.jpg`)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .run();
  });

  // Get all extracted frames
  const frameFiles = fs.readdirSync(outputDir)
    .filter((file) => file.match(/frame-\d+\.jpg/));

  // Analyze each frame with Vision API
  const frameAnalyses = await Promise.all(
    frameFiles.map(async (file) => {
      const framePath = path.join(outputDir, file);
      const [result] = await visionClient.annotateImage({
        image: { content: fs.readFileSync(framePath).toString("base64") },
        features: [
          { type: "OBJECT_LOCALIZATION" },
          { type: "LABEL_DETECTION", maxResults: 10 },
          { type: "TEXT_DETECTION" },
        ],
      });

      return {
        frameNumber: parseInt(file.match(/frame-(\d+)\.jpg/)?.[1] || "0"),
        objects: result.localizedObjectAnnotations,
        labels: result.labelAnnotations,
        text: result.textAnnotations,
      };
    }),
  );

  return processFrameAnalyses(frameAnalyses);
}

/**
 * Extract audio from video and transcribe it
 * @param {string} videoPath Path to the video file
 * @param {string} audioPath Path to save extracted audio
 * @param {SpeechClient} speechClient Speech API client
 * @param {Storage} bucket Storage bucket
 * @param {string} videoId Video ID
 * @return {Promise<object>} Transcription results
 */
async function extractAndTranscribeAudio(
  videoPath: string,
  audioPath: string,
  speechClient: SpeechClient,
  bucket: Bucket,
  videoId: string,
): Promise<Record<string, unknown>> {
  // Extract audio from video
  await new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioPath)
      .audioCodec("pcm_s16le")
      .audioChannels(1)
      .audioFrequency(16000)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .run();
  });

  // Upload audio to Cloud Storage for long audio files
  const audioGcsUri = `gs://${bucket.name}/temp-audio/${videoId}.wav`;
  await bucket.upload(audioPath, {
    destination: `temp-audio/${videoId}.wav`,
  });

  // Transcribe audio
  const [operation] = await speechClient.longRunningRecognize({
    audio: { uri: audioGcsUri },
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-US",
      enableAutomaticPunctuation: true,
      model: "default",
      useEnhanced: true,
    },
  });

  // Wait for transcription to complete
  const [response] = await operation.promise();


  // Process transcript
  let fullTranscript = "";

  if (!response.results) {
    throw new Error("No results found in transcription response");
  }

  response.results.forEach((result) => {
    if (result.alternatives) {
      fullTranscript += result.alternatives[0].transcript + " ";
    }
  });

  // Delete temporary audio file from storage
  try {
    await bucket.file(`temp-audio/${videoId}.wav`).delete();
  } catch (error) {
    console.error("Error deleting temporary audio file:", error);
  }

  return processTranscript(fullTranscript);
}

/**
 * Process frame analyses to extract cooking information
 * @param {Array} frameAnalyses Array of frame analysis results
 * @return {object} Processed cooking information
 */
function processFrameAnalyses(
  frameAnalyses: Array<Record<string, unknown>>,
): Record<string, unknown> {
  // Identify common food items, cooking utensils, and actions
  const foodItems = new Set<string>();
  const cookingUtensils = new Set<string>();
  const cookingActions = new Set<string>();
  const measuredIngredients: Array<Record<string, string>> = [];

  // Define common cooking utensils and actions for detection
  const utensilKeywords = [
    "bowl", "pan", "pot", "knife", "spoon", "spatula", "whisk", "cutting board",
  ];
  const actionKeywords = [
    "mix", "stir", "cut", "chop", "bake", "fry", "boil", "simmer",
  ];

  frameAnalyses.forEach((frame) => {
    // Process objects
    if (frame.objects) {
      (frame.objects as Array<Record<string, string>>).forEach((obj) => {
        if (obj.name.toLowerCase().includes("food")) {
          foodItems.add(obj.name);
        }

        utensilKeywords.forEach((utensil) => {
          if (obj.name.toLowerCase().includes(utensil)) {
            cookingUtensils.add(obj.name);
          }
        });
      });
    }

    // Process labels
    if (frame.labels) {
      (frame.labels as Array<Record<string, string>>).forEach((label) => {
        // eslint-disable-next-line max-len
        if (label.description.toLowerCase().includes("food") || label.description.toLowerCase().includes("ingredient")) {
          foodItems.add(label.description);
        }

        actionKeywords.forEach((action) => {
          if (label.description.toLowerCase().includes(action)) {
            cookingActions.add(label.description);
          }
        });
      });
    }

    // Process text for measurements and ingredients
    if (frame.text && (frame.text as Array<unknown>).length > 0) {
      const text = (frame.text as Array<Record<string, string>>)[0].description;
      // Look for measurements like "1 cup" followed by ingredient
      // eslint-disable-next-line max-len
      const measurementRegex = /(\d+(?:\.\d+)?)\s*(cup|tbsp|tsp|tablespoon|teaspoon|oz|ounce|lb|pound|g|gram|ml|liter|pinch|dash)/gi;
      let match;

      while ((match = measurementRegex.exec(text)) !== null) {
        const [fullMatch, amount, unit] = match;
        // eslint-disable-next-line max-len
        const ingredientText = text.substring(match.index + fullMatch.length).split(",")[0].trim();
        if (ingredientText) {
          measuredIngredients.push({
            amount,
            unit,
            ingredient: ingredientText,
          });
        }
      }
    }
  });

  return {
    foodItems: Array.from(foodItems),
    cookingUtensils: Array.from(cookingUtensils),
    cookingActions: Array.from(cookingActions),
    measuredIngredients,
  };
}

/**
 * Process transcript to extract cooking information
 * @param {string} transcript Audio transcript text
 * @return {object} Processed cooking information
 */
function processTranscript(transcript: string): Record<string, unknown> {
  // Extract cooking instructions from transcript
  const steps: string[] = [];
  const ingredients: Array<Record<string, string>> = [];

  // Look for ingredient mentions
  // eslint-disable-next-line max-len
  const ingredientRegex = /(\d+(?:\.\d+)?)\s*(cup|tbsp|tsp|tablespoon|teaspoon|oz|ounce|lb|pound|g|gram|ml|liter|pinch|dash)s?\s+of\s+([a-zA-Z\s]+)/gi;
  let match;

  while ((match = ingredientRegex.exec(transcript)) !== null) {
    ingredients.push({
      amount: match[1],
      unit: match[2],
      name: match[3].trim(),
    });
  }

  // Look for cooking steps
  // Split by sentences and look for action verbs
  const sentences = transcript
    .split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const actionVerbs = [
    "add", "mix", "stir", "pour", "place", "heat", "cook", "bake",
    "fry", "boil", "simmer", "chop", "cut", "slice", "dice",
  ];

  sentences.forEach((sentence) => {
    const words = sentence.trim().split(" ");
    const firstWord = words[0].toLowerCase();

    if (actionVerbs.includes(firstWord)) {
      steps.push(sentence.trim());
    }
  });

  // Look for recipe title
  let title = "";
  const titlePatterns = [
    /today (?:we're|we are|I'm|I am) making ([\w\s]+)/i,
    /recipe for ([\w\s]+)/i,
    /how to make ([\w\s]+)/i,
    /let's make ([\w\s]+)/i,
  ];

  for (const pattern of titlePatterns) {
    const titleMatch = transcript.match(pattern);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
      break;
    }
  }

  return {
    title,
    ingredients,
    steps,
    fullTranscript: transcript,
  };
}

/**
 * Combine visual and audio analyses to generate a complete recipe
 * @param {object} visualAnalysis Results from visual analysis
 * @param {object} audioTranscript Results from audio transcription
 * @return {object} Complete recipe
 */
function generateRecipe(
  visualAnalysis: Record<string, unknown>,
  audioTranscript: Record<string, unknown>,
): Record<string, unknown> {
  // Merge ingredients from both analyses
  const allIngredients = new Map<string, Record<string, string>>();

  // Add ingredients from visual analysis
  if (visualAnalysis.measuredIngredients) {
    (visualAnalysis.measuredIngredients as Array<Record<string, string>>)
      .forEach((item) => {
        const key = item.ingredient.toLowerCase();
        allIngredients.set(key, {
          name: item.ingredient,
          amount: item.amount,
          unit: item.unit,
        });
      });
  }

  // Add or update ingredients from audio transcript
  if (audioTranscript.ingredients) {
    (audioTranscript.ingredients as Array<Record<string, string>>)
      .forEach((item) => {
        const key = item.name.toLowerCase();
        if (!allIngredients.has(key)) {
          allIngredients.set(key, {
            name: item.name,
            amount: item.amount,
            unit: item.unit,
          });
        }
      });
  }

  // Determine recipe title
  let title = audioTranscript.title as string;
  if (!title) {
    // Try to generate a title from the ingredients
    const mainIngredients = Array.from(allIngredients.values())
      .slice(0, 3)
      .map((i) => i.name);

    if (mainIngredients.length > 0) {
      title = mainIngredients.join(", ") + " Recipe";
    } else {
      title = "Recipe";
    }
  }

  // Combine cooking steps
  let steps = (audioTranscript.steps as string[]) || [];

  // If we don't have enough steps from audio, try to infer some from visual
  // eslint-disable-next-line max-len
  if (steps.length < 3 && visualAnalysis.cookingActions && (visualAnalysis.cookingActions as string[]).length > 0) {
    (visualAnalysis.cookingActions as string[]).forEach((action) => {
      steps.push(`${action} the ingredients.`);
    });
  }

  // Ensure steps are unique
  steps = [...new Set(steps)];

  return {
    title,
    ingredients: Array.from(allIngredients.values()),
    steps,
    visualData: {
      detectedFoodItems: visualAnalysis.foodItems,
      detectedUtensils: visualAnalysis.cookingUtensils,
    },
    audioData: {
      transcript: audioTranscript.fullTranscript,
    },
  };
}
