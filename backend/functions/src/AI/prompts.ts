import {GenerateRecipeProps} from "../types";

/* eslint-disable max-len */
export const frameAnalysesPrompt = `Write a summary of the image. Describe any cooking options, ingredients, or cooking processes visible in the image. 
Be as specific as possible, but make sure it comes out as plain text`;

// eslint-disable-next-line require-jsdoc
export function generateRecipePrompt({
  audioTranscript,
  visualAnalysis,
}: GenerateRecipeProps) {
  const prompt =
  `Generate a detailed recipe from this transcription of a cooking video. 
  We have also includeded a visual analysis of the video frames to help, if the transcript 
  isn't helpful.
  Format the response as a JSON object with 'title',
  'ingredients' (as an array of strings),
  and 'steps' (as an array of strings).

  Here is a Transcription of the audio: ${audioTranscript || ""}
  
  Here is a frame by frame visual analysis of the video 
  ${visualAnalysis.map((description) => {
    return `${description}\n`;
  })}`;

  console.log(prompt);

  return prompt;
}
