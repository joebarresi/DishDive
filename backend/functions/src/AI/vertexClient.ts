import {VertexAI} from "@google-cloud/vertexai";

const vertexAI = new VertexAI({
  project: "recipetok-40c2a",
  location: "us-central1",
});

const geminiModel = "gemini-2.0-flash-lite-001";

export const generativeModel =
vertexAI.getGenerativeModel({model: geminiModel});
