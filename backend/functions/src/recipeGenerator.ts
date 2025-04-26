/* eslint-disable indent */
import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import * as ffmpeg from "fluent-ffmpeg";
import * as ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import {Storage} from "@google-cloud/storage";
// import {ImageAnnotatorClient} from "@google-cloud/vision";
import {SpeechClient} from "@google-cloud/speech";
import {VertexAI} from "@google-cloud/vertexai";
import {GenerateRecipeProps} from "./types";
import {generateTranscript} from "./transcript";

// import {extractAndAnalyzeFrames} from "./videoFrames";

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const storage = new Storage();
// const visionClient = new ImageAnnotatorClient();
const speechClient = new SpeechClient();

const vertexAI = new VertexAI({
  project: "recipetok-40c2a",
  location: "us-central1",
});

const generativeModel = vertexAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
});

// const getDb = () => admin.firestore();

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
    const filePath = object.name;
    if (!filePath) return;

    if (!filePath.endsWith("video")) {
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
      fs.mkdirSync(tempOutputDir, {recursive: true});

      await bucket.file(filePath).download({destination: tempFilePath});
      console.log(`Video downloaded to ${tempFilePath}`);

      // // Process in parallel
      // const [visualAnalysis, audioTranscriptText] = await Promise.all([
      //   extractAndAnalyzeFrames(
      //     tempFilePath,
      //     tempOutputDir,
      //     visionClient,
      //   ),
      //   extractAndTranscribeAudio(
      //     tempFilePath,
      //     tempAudioPath,
      //     speechClient,
      //     bucket,
      //     videoId,
      //   ),
      // ]);

      const audioTranscript = await generateTranscript(
        tempFilePath,
        tempAudioPath,
        speechClient,
        bucket,
        videoId,
      );

      // Combine analyses to generate recipe
      const recipe = await generateRecipe({
        audioTranscript,
        visualAnalysis: undefined,
      });

      console.log(recipe);

      // // Get Firestore instance
      // const db = getDb();

      // // Store recipe in Firestore
      // await db.collection("recipes").doc(videoId).set({
      //   title: recipe.title,
      //   ingredients: recipe.ingredients,
      //   steps: recipe.steps,
      //   videoRef: filePath,
      //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
      // });

      // console.log(`Recipe generated and stored for video: ${filePath}`);

      // // Update the post document to include the recipe reference
      // // eslint-disable-next-line max-len
      // const postQuery = await db.collection("post")
      // .where("id", "==", videoId).get();
      // if (!postQuery.empty) {
      //   const postDoc = postQuery.docs[0];
      //   await postDoc.ref.update({
      //     hasRecipe: true,
      //     recipeId: videoId,
      //   });
      // }
    } catch (error) {
      console.error("Error generating recipe:", error);
    } finally {
      // Cleanup temp files
      try {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        if (fs.existsSync(tempOutputDir)) {
          fs.rmdirSync(tempOutputDir, {recursive: true});
        }
        if (fs.existsSync(tempAudioPath)) fs.unlinkSync(tempAudioPath);
      } catch (cleanupError) {
        console.error("Error cleaning up temp files:", cleanupError);
      }
    }
  });

/**
 * Generate a recipe using Google's LLM based on audio transcript and visual
 * analysis
 * @param {GenerateRecipeProps} props Object containing audioTranscript
 *  and visualAnalysis
 * @return {object} Generated recipe with title, ingredients, and steps
 */
async function generateRecipe({
  audioTranscript,
  visualAnalysis,
}: GenerateRecipeProps): Promise<{
  title: string;
  ingredients: string[];
  steps: string[];
} | string> {
  console.log("Generating recipe from transcript and visual analysis");
  const fallbackRecipe = {
    title: "Recipe from Video",
    ingredients: [],
    steps: [],
  };

  try {
    const resp = await generativeModel.generateContent(
      generateRecipePrompt({audioTranscript, visualAnalysis}),
    );

    const data = resp.response;
    return JSON.stringify(data);


  //   // Parse the response - assuming it returns JSON as requested
  //   let parsedRecipe;
  //   try {
  //     const generatedText = data.candidates[0].content.parts[0].text;
  //     const jsonMatch =
  //       generatedText.match(/```json\n([\s\S]*?)\n```/) ||
  //       generatedText.match(/```\n([\s\S]*?)\n```/) ||
  //       [null, generatedText];

  //     const jsonContent = jsonMatch[1];
  //     parsedRecipe = JSON.parse(jsonContent);
  //   } catch (parseError) {
  //     console.error("Error parsing LLM response:", parseError);
  //     // Fallback to a basic structure if parsing fails
  //     parsedRecipe = fallbackRecipe;
  //   }

  //   return {
  //     title: parsedRecipe.title || "Recipe from Video",
  //     ingredients: Array.isArray(parsedRecipe.ingredients) ?
  //       parsedRecipe.ingredients :
  //       [],
  //     steps: Array.isArray(parsedRecipe.steps) ?
  //       parsedRecipe.steps :
  //       [],
  //   };
  } catch (error) {
    console.error("Error generating recipe with Google AI:", error);
    return fallbackRecipe;
  }
}

// eslint-disable-next-line require-jsdoc
function generateRecipePrompt({
  audioTranscript,
  visualAnalysis,
}: GenerateRecipeProps) {
  const prompt =
  `Generate a detailed recipe from this transcription of a cooking video.
  Format the response as a JSON object with 'title',
  'ingredients' (as an array of strings),
  and 'steps' (as an array of strings).

  Transcription: ${audioTranscript || ""}`;

  if (visualAnalysis) {
      // TODO: Leverage the visualAnalysis
    console.log();
  }

  return prompt;
}
