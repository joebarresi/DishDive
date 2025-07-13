import {VertexAI} from "@google-cloud/vertexai";
import * as admin from "firebase-admin";

const vertexAI = new VertexAI({
  project: "recipetok-40c2a",
  location: "us-central1",
});

const geminiModel = "gemini-2.5-flash";

export const generativeModel =
vertexAI.getGenerativeModel({model: geminiModel});

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
