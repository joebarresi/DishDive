/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK first, before any other imports
admin.initializeApp();

import {
  generateRecipeFromVideo,
  generateRecipeFromVideoV2,
} from "./AI/recipeGenerator";
import {createTags} from "./AI/tagging";
import {generateRecipeFromIngredients} from "./AI/sousChef";
import {
  likeCreate,
  likeDelete,
  followCreate,
  followDelete,
  newUser,
} from "./userAction";


export {
  generateRecipeFromVideo,
  generateRecipeFromVideoV2,
  generateRecipeFromIngredients,
  createTags,
  likeCreate,
  likeDelete,
  followCreate,
  followDelete,
  newUser,
};
