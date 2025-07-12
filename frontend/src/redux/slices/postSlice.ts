import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_FUNCTIONS } from "../../../firebaseConfig";
import { httpsCallable } from "firebase/functions";
import {
  addDoc,
  updateDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  DocumentReference,
} from "firebase/firestore";
import { saveMediaToStorage } from "../../services/utils";
import uuid from "uuid-random";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Post } from "../../../types";

interface PostState {
  loading: boolean;
  error: string | null;
  currentUserPosts: Post[] | null;
}

const initialState: PostState = {
  loading: false,
  error: null,
  currentUserPosts: null,
};

export const createRawPost = createAsyncThunk(
  "post/rawCreate", async ({
    video,
    thumbnail,
  }: {
    video: string;
    thumbnail: string;
  }, { rejectWithValue }) => {
    // Start timing the function execution
    const startTime = Date.now();
    console.log(`[TIMING] createRawPost started at ${new Date().toISOString()}`);
    
    if (FIREBASE_AUTH.currentUser) {
      try {
        const storagePostId = uuid();
        console.log("Storing media to storage")
        const mediaStartTime = Date.now();
        
        const [videoDownloadUrl, thumbnailDownloadUrl] = await Promise.all([
          saveMediaToStorage(
            video,
            `post/${FIREBASE_AUTH.currentUser.uid}/${storagePostId}/video`,
          ),
          saveMediaToStorage(
            thumbnail,
            `post/${FIREBASE_AUTH.currentUser.uid}/${storagePostId}/thumbnail`,
          ),
        ]);
        
        const mediaEndTime = Date.now();
        console.log(`[TIMING] Media storage took ${(mediaEndTime - mediaStartTime)}ms`);

        console.log("Getting recipe")
        const recipeStartTime = Date.now();
        
        const getRecipe = await httpsCallable(
          FIREBASE_FUNCTIONS, 
          "generateRecipeFromVideo"
        );

        let recipe;
        
        await getRecipe({
          filePath: `post/${FIREBASE_AUTH.currentUser.uid}/${storagePostId}/video`,
        }).then((result) => {
          recipe = result.data;
        });
        
        const recipeEndTime = Date.now();
        console.log(`[TIMING] Recipe generation took ${(recipeEndTime - recipeStartTime)}ms`);

        console.log("creating document");
        const docStartTime = Date.now();
        
        const docReference = await addDoc(collection(FIREBASE_DB, "post"), {
          creator: FIREBASE_AUTH.currentUser.uid,
          media: [videoDownloadUrl, thumbnailDownloadUrl],
          description: null,
          likesCount: 0,
          commentsCount: 0,
          creation: serverTimestamp(),
          recipe: recipe,
          uploadStatus: "draft"
        });
        
        const docEndTime = Date.now();
        console.log(`[TIMING] Document creation took ${(docEndTime - docStartTime)}ms`);

        // Calculate total execution time
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        console.log(`[TIMING] createRawPost completed in ${totalTime}ms (${(totalTime / 1000).toFixed(2)} seconds)`);
        console.log(`[TIMING] createRawPost ended at ${new Date().toISOString()}`);
        
        // Instead of using logEvent, just log to console
        console.log(`[ANALYTICS] create_raw_post time: ${totalTime}ms`);

        return docReference;
      } catch (error) {
        // Also time errors
        const errorTime = Date.now();
        const totalTime = errorTime - startTime;
        console.error(`[TIMING] createRawPost failed after ${totalTime}ms (${(totalTime / 1000).toFixed(2)} seconds)`, error);
        
        return rejectWithValue(error);
      }
    } else {
      const errorTime = Date.now();
      const totalTime = errorTime - startTime;
      console.error(`[TIMING] createRawPost failed (user not authenticated) after ${totalTime}ms`);
      
      return rejectWithValue(new Error("User not authenticated"));
    }
  }
)

export const finishSavePost = createAsyncThunk(
  "post/create",
  async (
    {
      description,
      docReference,
      recipe,
    }: {
      description: string;
      docReference: DocumentReference;
      recipe?: {
        title: string;
        ingredients: string[];
        steps: string[];
      };
    },
    { rejectWithValue },
  ) => {
    if (FIREBASE_AUTH.currentUser) {
      try {
        const updateData: any = {
          description,
          uploadStatus: "published"
        };
        
        // Only include recipe in update if it was provided
        if (recipe) {
          updateData.recipe = recipe;
        }
        
        await updateDoc(docReference, updateData);

      } catch (error) {
        console.error("Error updating post: ", error);
        return rejectWithValue(error);
      }
    } else {
      return rejectWithValue(new Error("User not authenticated"));
    }
  },
);

export const getPostsByUser = createAsyncThunk(
  "post/getPostsByUser",
  async (uid: string, { dispatch, rejectWithValue }) => {
    try {
      // Create a query against the collection.
      const q = query(
        collection(FIREBASE_DB, "post"),
        where("creator", "==", uid),
        orderBy("creation", "desc"),
      );

      const querySnapshot = await getDocs(q);

      // Map over the snapshot to get the array of posts
      const posts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data } as Post;
      });
      // Dispatch action to update the state. Replace `CURRENT_USER_POSTS_UPDATE` with the actual action creator
      dispatch({ type: "CURRENT_USER_POSTS_UPDATE", payload: posts });

      return posts; // Return posts as fulfilled payload
    } catch (error) {
      console.error("Failed to get posts: ", error);
      return rejectWithValue(error);
    }
  },
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRawPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRawPost.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createRawPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(finishSavePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finishSavePost.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(finishSavePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getPostsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPostsByUser.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.loading = false;
          state.currentUserPosts = action.payload;
        },
      )
      .addCase(getPostsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default postSlice.reducer;
