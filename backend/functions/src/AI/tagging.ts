/* eslint-disable valid-jsdoc */
import * as functions from "firebase-functions";
import {generativeModel, jsonThatBitch} from "../constants";
import {getCuisinePrompt, getDietPrompt} from "./prompts";

export enum DietTags {
  DASH = "DASH (Dietary Approaches to Stop Hypertension)",
  Vegetarian = "Vegetarian",
  Vegan = "Vegan",
  Pescatarian = "Pescatarian",

  Ketogenic = "Keto",
  LowCarb = "Low-Carb",
  Atkins = "Atkins",
  GlutenFree = "Gluten-Free",
  DairyFree = "Dairy-Free",
  NutFree = "Nut-Free",
  LowFODMAP = "Low-FODMAP",

  Paleo = "Paleo",
  Carnivore = "Carnivore",
  LowSugar = "Low Sugar",

  Kosher = "Kosher",
  Halal = "Halal",
}

export enum CuisineTags {
  // Broad Regional Cuisines
  Mexican = "Mexican",
  Italian = "Italian",
  Chinese = "Chinese",
  Indian = "Indian",
  Japanese = "Japanese",
  French = "French",
  Thai = "Thai",
  Mediterranean = "Mediterranean",
  Korean = "Korean",
  Vietnamese = "Vietnamese",
  Greek = "Greek",
  Spanish = "Spanish",
  German = "German",
  Brazilian = "Brazilian",
  Ethiopian = "Ethiopian",
  Caribbean = "Caribbean",

  TexMex = "Tex-Mex",
  SoulFood = "Soul Food",
  Cajun = "Cajun",
  Creole = "Creole",
  Sushi = "Sushi", // Specific Japanese
  Ramen = "Ramen", // Specific Japanese
  Tapas = "Tapas", // Specific Spanish
  BBQ = "BBQ", // American style
  Seafood = "Seafood", // Can be a focus across cuisines
  Fusion = "Fusion",
}
/**
 * Function that triggers on post creation.
 * The post *should* have a generated recipe.
 * Gets the ingredients and leverages our old friend AI to create
 * Diet Tags and Cuisine Tags
 * This function updates the 'likesCount' or 'commentsCount' of the post
 * and the 'likesCount' of the post creator.
 */
export const createTags = functions.firestore
    .document("post/{id}")
    .onUpdate(async (change, context) => {
      const newPostData = change.after.data();
      const postId = context.params.id;

      if (!newPostData.uploadStatus ||
        newPostData.uploadStatus !== "published") {
        console.log("post data is fucked");
        return;
      }
      if (newPostData && newPostData.recipe &&
        newPostData.recipe.ingredients && newPostData.recipe.title) {
        const {title, ingredients} = newPostData.recipe;

        const cuisineTags = await generateCuisineTags(title, ingredients);
        const dietTags = await generateDietTags(ingredients);

        try {
          await change.after.ref.update({
            dietTags: dietTags,
            cuisineTags: cuisineTags,
          });
        } catch (error) {
          console.error(`[${postId}] Error updating tags with field3:`, error);
        }

        return null;
      } else {
        console.error(`Recipe: ${newPostData.recipe},
            ingredients: ${newPostData.recipe.ingredients} 
            name: ${newPostData.recipe.name}
            Recipe data is incomplete`);
        return;
      }
    });

/**
 * Function makes a call to generative AI and tries to decipher what
 * cuisine tags could be appropriately applied to a recipeName and
 * ingredients
 * @param recipeName
 * @param ingredients
 */
async function generateCuisineTags(
    recipeName: string,
    ingredients: string[]
): Promise<CuisineTags[]> {
  try {
    const resp = await generativeModel.generateContent(
        getCuisinePrompt({name: recipeName, ingredients: ingredients})
    );

    if (!resp.response || !resp.response.candidates) {
      throw new Error("No response or canditates from model");
    }
    const responseVerified = resp.response;
    const text = responseVerified.candidates![0].content.parts[0].text;
    return jsonThatBitch(text!);
  } catch (error) {
    console.error("Error generating cuisine tags", error);
    throw error;
  }
}
/**
 * Function makes a call to generative AI and tries to decipher what
 * diet tags could be appropriately applied to ingredients
 * @param ingredients
 */
async function generateDietTags(ingredients: string[]): Promise<DietTags[]> {
  try {
    const resp = await generativeModel.generateContent(
        getDietPrompt({ingredients: ingredients})
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
}
