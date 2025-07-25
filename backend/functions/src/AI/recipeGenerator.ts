/* eslint-disable indent */
import * as functions from "firebase-functions";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as ffmpeg from "fluent-ffmpeg";
import * as ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import {Storage} from "@google-cloud/storage";
import {SpeechClient} from "@google-cloud/speech";
import {GenerateRecipeProps} from "../types";
import {generateTranscript} from "./transcript";
import {extractAndAnalyzeFrames} from "./videoFrames";
import {generativeModel} from "../constants";
import {generateRecipePrompt} from "./prompts";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const storage = new Storage();
const speechClient = new SpeechClient();

/**
 * Asynchronously clean up temporary files without blocking
 * @param {string} filePath Path to the video file
 * @param {string} outputDir Directory containing extracted frames
 * @param {string} audioPath Path to the audio file
 */
async function cleanupFilesAsync(
  filePath: string,
  outputDir: string,
  audioPath: string
): Promise<void> {
  try {
    const cleanupTasks = [];

    if (fs.existsSync(filePath)) {
      cleanupTasks.push(fsPromises.unlink(filePath));
    }

    if (fs.existsSync(outputDir)) {
      cleanupTasks.push(fsPromises.rm(outputDir,
        {recursive: true, force: true}));
    }

    if (fs.existsSync(audioPath)) {
      cleanupTasks.push(fsPromises.unlink(audioPath));
    }

    await Promise.all(cleanupTasks);
    console.log("Temporary files cleaned up successfully");
  } catch (cleanupError) {
    console.error("Error cleaning up temp files:", cleanupError);
    // Non-blocking error - just log it
  }
}

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

      console.log("Starting parallel processing of frames and transcript...");
      const parallelStartTime = Date.now();

      // Process in parallel
      const [visualAnalysisTexts, audioTranscript] = await Promise.all([
        (async () => {
          const frameStartTime = Date.now();
          console.log("Starting extractAndAnalyzeFrames...");
          const result = await extractAndAnalyzeFrames(
            tempFilePath,
            tempOutputDir,
          );
          console.log(
            `extractAndAnalyzeFrames completed in 
            ${Date.now() - frameStartTime}ms`);
          return result;
        })(),
        (async () => {
          const transcriptStartTime = Date.now();
          console.log("Starting generateTranscript...");
          const result = await generateTranscript(
            tempFilePath,
            tempAudioPath,
            speechClient,
            bucket,
            videoId,
          );
          console.log(
            `generateTranscript completed in 
            ${Date.now() - transcriptStartTime}ms`);
          return result;
        })(),
      ]);

      console.log(
        `Parallel processing completed in ${Date.now() - parallelStartTime}ms`);

      // Combine analyses to generate recipe
      console.log("Starting generateRecipe...");
      const recipeStartTime = Date.now();
      const recipe = await generateRecipe({
        audioTranscript,
        visualAnalysis: visualAnalysisTexts,
      });
      console.log(
        `generateRecipe completed in ${Date.now() - recipeStartTime}ms`);

      cleanupFilesAsync(tempFilePath, tempOutputDir, tempAudioPath)
        .catch((err) => console.error("Background cleanup failed:", err));

      return recipe;
    } catch (error) {
      console.error("Error generating recipe:", error);

      cleanupFilesAsync(tempFilePath, tempOutputDir, tempAudioPath)
        .catch((err) => console.error("Background cleanup failed:", err));
      return undefined;
    }
  });

export const generateRecipeFromVideoV2 = onCall({
  memory: "512MiB",
  timeoutSeconds: 120,
}, async ({data}) => {
  if (!data.filePath) {
    throw new HttpsError("invalid-argument", "Missing filepath to generate");
  }
  const {filePath} = data;

  const bucket = storage.bucket("recipetok-40c2a.firebasestorage.app");
  const videoId = path.basename(filePath).split(".")[0];
  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
  const tempOutputDir = path.join(os.tmpdir(), `frames-${videoId}`);
  const tempAudioPath = path.join(os.tmpdir(), `audio-${videoId}.wav`);

  try {
    fs.mkdirSync(tempOutputDir, {recursive: true});

    await bucket.file(filePath).download({destination: tempFilePath});

    const parallelStartTime = Date.now();

    const [visualAnalysisTexts, audioTranscript] = await Promise.all([
      (async () => {
        const frameStartTime = Date.now();
        const result = await extractAndAnalyzeFrames(
          tempFilePath,
          tempOutputDir,
        );
        console.log(
          `extractAndAnalyzeFrames completed in 
          ${Date.now() - frameStartTime}ms`);
        return result;
      })(),
      (async () => {
        const transcriptStartTime = Date.now();
        const result = await generateTranscript(
          tempFilePath,
          tempAudioPath,
          speechClient,
          bucket,
          videoId,
        );
        console.log(
          `generateTranscript completed in 
          ${Date.now() - transcriptStartTime}ms`);
        return result;
      })(),
    ]);

    console.log(
      `Parallel processing completed in ${Date.now() - parallelStartTime}ms`);

    const recipeStartTime = Date.now();

    const recipe = await generateRecipe({
      audioTranscript,
      visualAnalysis: visualAnalysisTexts,
    });
    console.log(
      `generateRecipe completed in ${Date.now() - recipeStartTime}ms`);

    cleanupFilesAsync(tempFilePath, tempOutputDir, tempAudioPath)
      .catch((err) => console.error("Background cleanup failed:", err));

    console.log(`$Entire time: ${Date.now() - parallelStartTime}`);
    return recipe;
  } catch (error) {
    console.error("Error generating recipe:", error);
    cleanupFilesAsync(tempFilePath, tempOutputDir, tempAudioPath)
      .catch((err) => console.error("Background cleanup failed:", err));
    throw new Error("Error generating recipe");
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
    throw new Error("Error generating recipe with Google AI");
  }
}
