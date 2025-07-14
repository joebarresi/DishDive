import * as fs from "fs";
import * as ffmpeg from "fluent-ffmpeg";
import {analyzeFrame} from "./imageAnalysis";

/**
 * Extract frames from video and analyze them
 * @param {string} videoPath Path to the video file
 * @param {string} outputDir Diretory to save extracted frames
 * @param {ImageAnnotatorClient} visionClient Vision API client
 * @return {Promise<object>} Analysis results
 */
export async function extractAndAnalyzeFrames(
    videoPath: string,
    outputDir: string,
): Promise<string[]> {
  await new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
        .outputOptions(["-vf fps=3/2"])
        .output(`${outputDir}/frame-%03d.jpg`)
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .run();
  });

  // Get all extracted frames
  const frameFiles = fs.readdirSync(outputDir)
      .filter((file) => file.match(/frame-\d+\.jpg/));

  const frameMap: string[] = [];

  await Promise.all(
      frameFiles.map(async (file) => {
        const frameDescription = await analyzeFrame(`${outputDir}/${file}`);
        frameMap.push(frameDescription);
      }),
  );

  return frameMap;
}

