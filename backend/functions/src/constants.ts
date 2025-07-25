import {VertexAI} from "@google-cloud/vertexai";
import * as admin from "firebase-admin";

const vertexAI = new VertexAI({
  project: "recipetok-40c2a",
});

const geminiModel = "gemini-2.5-flash-lite";

export const generativeModel =
vertexAI.getGenerativeModel({model: geminiModel,
  generationConfig: {
    temperature: 0.3,
    candidateCount: 1,
  },
});

export const db = admin.firestore();

// eslint-disable-next-line require-jsdoc
export function jsonThatBitch(generatedText: string) {
  const jsonMatch =
        generatedText?.match(/```json\n([\s\S]*?)\n```/) ||
        generatedText?.match(/```\n([\s\S]*?)\n```/) ||
        [null, generatedText];

  const jsonContent = jsonMatch[1];
  if (!jsonContent) {
    console.error("No JSON content found in the response");
    throw new Error("No JSON content found in the response");
  }

  return JSON.parse(jsonContent);
}
