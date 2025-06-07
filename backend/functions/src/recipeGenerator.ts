/* eslint-disable indent */
import * as functions from "firebase-functions";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import * as ffmpeg from "fluent-ffmpeg";
import * as ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import {Storage} from "@google-cloud/storage";
import {SpeechClient} from "@google-cloud/speech";
import {GenerateRecipeProps} from "./types";
import {generateTranscript} from "./transcript";
import {extractAndAnalyzeFrames} from "./videoFrames";
import {generativeModel} from "./vertexClient";
import { generateRecipePrompt } from "./prompts";

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const storage = new Storage();
// const visionClient = new ImageAnnotatorClient();
const speechClient = new SpeechClient();


/**
 * Function that triggers when a new video is uploaded to Firebase Storage.
 * It generates a recipe from the video by analyzing frames and
 * transcribing audio.
 */
export const generateRecipeFromVideo = functions.https
  .onCall(async (data) => {
    const {filePath} = data;

    if (!filePath) return;

    const bucket = storage.bucket("recipetok-40c2a.firebasestorage.app");
    const videoId = path.basename(filePath).split(".")[0];
    const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const tempOutputDir = path.join(os.tmpdir(), `frames-${videoId}`);
    const tempAudioPath = path.join(os.tmpdir(), `audio-${videoId}.wav`);

    try {
      fs.mkdirSync(tempOutputDir, {recursive: true});

      await bucket.file(filePath).download({destination: tempFilePath});
      // Process in parallel
      const [visualAnalysisTexts, audioTranscript] = await Promise.all([
        extractAndAnalyzeFrames(
          tempFilePath,
          tempOutputDir,
        ),
        generateTranscript(
          tempFilePath,
          tempAudioPath,
          speechClient,
          bucket,
          videoId,
        ),
      ]);

      // Combine analyses to generate recipe
      const recipe = await generateRecipe({
        audioTranscript,
        visualAnalysis: visualAnalysisTexts,
      });

      return recipe;
    } catch (error) {
      console.error("Error generating recipe:", error);
      return undefined;
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

    // Parse the response - assuming it returns JSON as requested
    let parsedRecipe;
    try {
      const generatedText = data.candidates?.[0].content.parts[0].text;
      const jsonMatch =
        generatedText?.match(/```json\n([\s\S]*?)\n```/) ||
        generatedText?.match(/```\n([\s\S]*?)\n```/) ||
        [null, generatedText];

      const jsonContent = jsonMatch[1];
      if (!jsonContent) {
        console.error("No JSON content found in the response");
        throw new Error("No JSON content found in the response");
      }
      parsedRecipe = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error("Error parsing LLM response:", parseError);
      // Fallback to a basic structure if parsing fails
      parsedRecipe = fallbackRecipe;
    }

    return {
      title: parsedRecipe.title || "Recipe from Video",
      ingredients: Array.isArray(parsedRecipe.ingredients) ?
        parsedRecipe.ingredients :
        [],
      steps: Array.isArray(parsedRecipe.steps) ?
        parsedRecipe.steps :
        [],
    };
  } catch (error) {
    console.error("Error generating recipe with Google AI:", error);
    return fallbackRecipe;
  }
}
