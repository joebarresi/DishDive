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
    const startTime = Date.now();
    
    if (FIREBASE_AUTH.currentUser) {
      try {
        const storagePostId = uuid();
        
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
        
        const getRecipe = await httpsCallable(
          FIREBASE_FUNCTIONS, 
          "generateRecipeFromVideoV2"
        );

        let recipe;
        
        const recipeResult = await getRecipe({
          filePath: `post/${FIREBASE_AUTH.currentUser.uid}/${storagePostId}/video`,
        }).then((result) => {
          recipe = result.data;
        });

        console.log(recipeResult);
        
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
        

        // Calculate total execution time
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        console.log(`[ANALYTICS] create_raw_post time: ${totalTime}ms`);

        return docReference;
      } catch (error) {
        return rejectWithValue(error);
      }
    } else {
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
        where("uploadStatus", "==", "published"),
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

export const addExternalPost = createAsyncThunk(
  "post/addExternal", 
  async ({
    link,
    title,
  }: {
    link: string;
    title: string;
  }, { rejectWithValue }) => {
    
    if (FIREBASE_AUTH.currentUser) {
      try {
        const docReference = await addDoc(collection(FIREBASE_DB, "externalPost"), {
          creator: FIREBASE_AUTH.currentUser.uid,
          creation: serverTimestamp(),
          recipe: {
            title,
            ingredients: [],
            steps: [],
          },
          link,
        });

        // Add save relationship for current user with this post
        await addDoc(collection(FIREBASE_DB, "saves", FIREBASE_AUTH.currentUser.uid, "externalPost"), {
          post: docReference.id,
        });

        return docReference;
      } catch (error) {
        console.error("Error adding external post:", error);
        return rejectWithValue(error);
      }
    } else {
      return rejectWithValue(new Error("User not authenticated"));
    }
  }
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
      })
      .addCase(addExternalPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExternalPost.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addExternalPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default postSlice.reducer;
