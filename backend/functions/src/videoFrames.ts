// /* eslint-disable max-len */
// /* eslint-disable indent */
// import * as fs from "fs";
// import * as path from "path";
// import * as ffmpeg from "fluent-ffmpeg";
// import {ImageAnnotatorClient} from "@google-cloud/vision";

// /**
//  * Extract frames from video and analyze them
//  * @param {string} videoPath Path to the video file
//  * @param {string} outputDir Directory to save extracted frames
//  * @param {ImageAnnotatorClient} visionClient Vision API client
//  * @return {Promise<object>} Analysis results
//  */
// export async function extractAndAnalyzeFrames(
//   videoPath: string,
//   outputDir: string,
//   visionClient: ImageAnnotatorClient,
// ): Promise<Record<string, unknown>> {
//   // Extract key frames (1 frame every 3 seconds)
//   await new Promise<void>((resolve, reject) => {
//     ffmpeg(videoPath)
//       .outputOptions(["-vf fps=1/3"])
//       .output(`${outputDir}/frame-%03d.jpg`)
//       .on("end", () => resolve())
//       .on("error", (err) => reject(err))
//       .run();
//   });

//   // Get all extracted frames
//   const frameFiles = fs.readdirSync(outputDir)
//     .filter((file) => file.match(/frame-\d+\.jpg/));

//   // Analyze each frame with Vision API
//   const frameAnalyses = await Promise.all(
//     frameFiles.map(async (file) => {
//       const framePath = path.join(outputDir, file);
//       const [result] = await visionClient.annotateImage({
//         image: {content: fs.readFileSync(framePath).toString("base64")},
//         features: [
//           {type: "OBJECT_LOCALIZATION"},
//           {type: "LABEL_DETECTION", maxResults: 10},
//           {type: "TEXT_DETECTION"},
//         ],
//       });

//       return {
//         frameNumber: parseInt(file.match(/frame-(\d+)\.jpg/)?.[1] || "0"),
//         objects: result.localizedObjectAnnotations,
//         labels: result.labelAnnotations,
//         text: result.textAnnotations,
//       };
//     }),
//   );

//   return processFrameAnalyses(frameAnalyses);
// }

// /**
//  * Process frame analyses to extract cooking information
//  * @param {Array} frameAnalyses Array of frame analysis results
//  * @return {object} Processed cooking information
//  */
// export function processFrameAnalyses(
//   frameAnalyses: Array<Record<string, unknown>>,
// ): Record<string, unknown> {
//   console.log("Processing frame anlyses from the video frames");
//   frameAnalyses.forEach((frame) => {
//     // Process objects
//     if (frame.objects) {
//       (frame.objects as Array<Record<string, string>>).forEach((obj) => {
//         console.log(obj);
//       });
//     }
//   });

//   // Identify common food items, cooking utensils, and actions
//   const foodItems = new Set<string>();
//   const cookingUtensils = new Set<string>();
//   const cookingActions = new Set<string>();
//   const measuredIngredients: Array<Record<string, string>> = [];

//   // Define common cooking utensils and actions for detection
//   const utensilKeywords = [
//     "bowl", "pan", "pot", "knife", "spoon", "spatula", "whisk", "cutting board",
//   ];
//   const actionKeywords = [
//     "mix", "stir", "cut", "chop", "bake", "fry", "boil", "simmer",
//   ];

//   frameAnalyses.forEach((frame) => {
//     // Process objects
//     if (frame.objects) {
//       (frame.objects as Array<Record<string, string>>).forEach((obj) => {
//         if (obj.name.toLowerCase().includes("food")) {
//           foodItems.add(obj.name);
//         }

//         utensilKeywords.forEach((utensil) => {
//           if (obj.name.toLowerCase().includes(utensil)) {
//             cookingUtensils.add(obj.name);
//           }
//         });
//       });
//     }

//     // Process labels
//     if (frame.labels) {
//       (frame.labels as Array<Record<string, string>>).forEach((label) => {
//         // eslint-disable-next-line max-len
//         if (label.description.toLowerCase().includes("food") || label.description.toLowerCase().includes("ingredient")) {
//           foodItems.add(label.description);
//         }

//         actionKeywords.forEach((action) => {
//           if (label.description.toLowerCase().includes(action)) {
//             cookingActions.add(label.description);
//           }
//         });
//       });
//     }

//     // Process text for measurements and ingredients
//     if (frame.text && (frame.text as Array<unknown>).length > 0) {
//       const text = (frame.text as Array<Record<string, string>>)[0].description;
//       // Look for measurements like "1 cup" followed by ingredient
//       // eslint-disable-next-line max-len
//       const measurementRegex = /(\d+(?:\.\d+)?)\s*(cup|tbsp|tsp|tablespoon|teaspoon|oz|ounce|lb|pound|g|gram|ml|liter|pinch|dash)/gi;
//       let match;

//       while ((match = measurementRegex.exec(text)) !== null) {
//         const [fullMatch, amount, unit] = match;
//         // eslint-disable-next-line max-len, max-len
//         const ingredientText = text.substring(match.index + fullMatch.length).split(",")[0].trim();
//         if (ingredientText) {
//           measuredIngredients.push({
//             amount,
//             unit,
//             ingredient: ingredientText,
//         }
//       }
//     }
//   });

//   return {
//     foodItems: Array.from(foodItems),
//     cookingUtensils: Array.from(cookingUtensils),
//     cookingActions: Array.from(cookingActions),
//     measuredIngredients,
//   };
// }
