import * as functions from "firebase-functions";
import {generativeModel, jsonThatBitch} from "../constants";
import {getSousChefPrompt} from "./prompts";

export const generateRecipeFromIngredients = functions.https
    .onCall(async (data) => {
      const {ingredients, prevRecipeTitle} = data;
      if (!ingredients) {
        throw new Error("No ingredients provided");
      }

      try {
        const resp = await generativeModel.generateContent(
            getSousChefPrompt({ingredients, prevRecipeTitle})
        );

        if (!resp.response || !resp.response.candidates) {
          throw new Error("No response or canditates from model");
        }
        const responseVerified = resp.response;
        const text = responseVerified.candidates![0].content.parts[0].text;
        return jsonThatBitch(text!);
      } catch (error) {
        console.error("Error generating diet tags", error);
        throw error;
      }
    });

