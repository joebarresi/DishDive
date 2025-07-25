import * as fs from "fs";
import {generativeModel} from "../constants";
import {frameAnalysesPrompt} from "./prompts";
import {GenerateContentRequest} from "@google-cloud/vertexai";
/**
 * Analyze a single image frame using a large language model.
 * @param {string} imagePath Path to the image file.
 * @return {Promise<string>} Description of cooking options in the image.
 */
export async function analyzeFrame(imagePath: string): Promise<string> {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");

  const request: GenerateContentRequest = {
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: frameAnalysesPrompt,
          },
        ],
      },
    ],
  };

  try {
    const resp = await generativeModel.generateContent(request);

    if (!resp.response || !resp.response.candidates) {
      throw new Error("No response or canditates from model");
    }
    const responseVerified = resp.response;

    const text = responseVerified.candidates![0].content.parts[0].text;

    return text!;
  } catch (error) {
    console.error(`Error analyzing frame ${imagePath}:`, error);
    throw error;
  }
}

