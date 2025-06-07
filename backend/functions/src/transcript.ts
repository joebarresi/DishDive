/* eslint-disable indent */
import * as ffmpeg from "fluent-ffmpeg";
import {Bucket} from "@google-cloud/storage";
import {SpeechClient} from "@google-cloud/speech";

/**
 * Extract audio from video and transcribe it
 * @param {string} videoPath Path to the video file
 * @param {string} audioPath Path to save extracted audio
 * @param {SpeechClient} speechClient Speech API client
 * @param {Storage} bucket Storage bucket
 * @param {string} videoId Video ID
 * @return {Promise<object>} Transcription results
 */
export async function generateTranscript(
  videoPath: string,
  audioPath: string,
  speechClient: SpeechClient,
  bucket: Bucket,
  videoId: string,
): Promise<string> {
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
    audio: {uri: audioGcsUri},
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

  return fullTranscript;
}
