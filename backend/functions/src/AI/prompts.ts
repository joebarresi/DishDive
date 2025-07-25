/* eslint-disable require-jsdoc */
import {GenerateRecipeProps} from "../types";
import {CuisineTags, DietTags} from "./tagging";

/* eslint-disable max-len */
export const frameAnalysesPrompt = `Write a summary of the image. Describe any cooking options, ingredients, or cooking processes visible in the image. 
Be as specific as possible, but make sure it comes out as plain text`;

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

  Ingredients should begin with an amount. For an example, 2 apples. Or 1 tbsp of Cumin.

  Here is a Transcription of the audio: ${audioTranscript || ""}
  
  Here is a frame by frame visual analysis of the video 
  ${visualAnalysis.map((description) => {
    return `${description}\n`;
  })}`;

  return prompt;
}

export function getCuisinePrompt(props: {name: string, ingredients: string[]}) {
  return `You are a culinary expert tasked with identifying the primary 1-3 cuisine categories for a given recipe.

          Here is the exhaustive list of valid cuisine tags. You **must only** use tags from this list. If a recipe doesn't fit any category, return an empty array.

          Valid Cuisine Tags:
          [${Object.values(CuisineTags).map((tag) => `"${tag}"`).join(", ")}]

          Your output **must** be a JSON array of strings, where each string is a valid cuisine tag from the list above. Return an empty array if no tags apply.

          Example Input:
          Recipe Name: Spicy Chicken Stir-fry
          Ingredients: Chicken breast, soy sauce, ginger, garlic, bell peppers, broccoli, rice noodles, sesame oil, chili flakes.

          Example Output:
          ["Chinese", "Asian"]

          ---

          Now, identify the cuisine tags for the following recipe:

          Recipe Name: ${props.name}
          Ingredients: ${props.ingredients.map((ingredient: string) => `- ${ingredient}`).join("\n")}`;
}

export function getDietPrompt(props: {ingredients: string[]}) {
  return `You are a culinary expert tasked with identifying the primary (1-2) diet categories for a given recipe.

          Here is the exhaustive list of valid diet tags. You **must only** use tags from this list. If a recipe doesn't fit any category, return an empty array.

          Valid Cuisine Tags:
          [${Object.values(DietTags).map((tag) => `"${tag}"`).join(", ")}]

          Your output **must** be a JSON array of strings, where each string is a valid diet tag from the list above. Return an empty array if no tags apply.
          If the recipe is not suitable for any diet, return an empty array. Keep in mind, low-carb means there are very little carbohydrates present in the meal.

          Example Input:
          Recipe Name: Spicy Chicken Stir-fry
          Ingredients: 
            - 1 tbsp olive oil
            - 1 onion, chopped
            - 2 carrots, chopped
            - 2 celery stalks, chopped
            - 2 cloves garlic, minced
            - 1 cup brown lentils, rinsed
            - 6 cups vegetable broth
            - 1 (14.5 oz) can diced tomatoes
            - 1 tsp dried thyme
            - Salt and black pepper to taste
            - Fresh parsley, chopped (for garnish)

          Example Output:
          ["Vegan", "Vegetarian"]

          ---

          Now, identify the cuisine tags for the following recipe:

          Ingredients: ${props.ingredients.map((ingredient: string) => `- ${ingredient}`).join("\n")}`;
}

export function getSousChefPrompt(arg0: { ingredients: any; prevRecipeTitle: any; }): string {
  return `Generate a recipe from the following ingredients. 
  The output should be in JSON format with 'title' (string), 
  'ingredients' (array of strings), and 'steps' (array of strings).

  Ingredients: ${arg0.ingredients.map(({name, amount}: {name:string, amount: string}) => `- ${amount} of ${name}`).join("\n")};

  ${arg0.prevRecipeTitle ? `Previous Recipe Title: ${arg0.prevRecipeTitle}` : ""}`;
}
