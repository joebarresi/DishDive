import {
  getDocs,
  collection,
  query,
  getDoc,
  doc,
  deleteDoc,
  setDoc,
  addDoc,
  serverTimestamp,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";
import { Post, Comment } from "../../types";
import { Dispatch, SetStateAction } from "react";
import { User } from "firebase/auth";

let commentListenerInstance: (() => void) | null = null;

/**
 * Returns all the posts in the database.
 *
 * @param {string} feedType - Optional feed type to filter posts
 * @returns {Promise<[<Post>]>} post list if successful.
 */

export const getMyFeed = (currentUser: User | null): Promise<Post[]> => {
  return new Promise(async (resolve, reject) => {
    if (!currentUser) {
      reject(new Error("User not logged in"));
      return;
    }

    try {
      const q = query(
        collection(FIREBASE_DB, "post"),
        where("creator", "!=", currentUser?.uid),
        orderBy("creator"),
        orderBy("creation", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as Post;
      });
      resolve(posts);
    } catch (error) {
      console.error("Failed to get feed: ", error);
      reject(error);
    }
  });
};

export const getTrendingFeed = (currentUser: User | null): Promise<Post[]> => {
  return new Promise(async (resolve, reject) => {
    if (!currentUser) {
      reject(new Error("User not logged in"));
      return;
    }

    try {
      const q = query(
        collection(FIREBASE_DB, "post"),
        where("creator", "!=", currentUser?.uid),
        orderBy("creator"),
        orderBy("likesCount", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as Post;
      });
      resolve(posts);
    } catch (error) {
      console.error("Failed to get feed: ", error);
      reject(error);
    }
  });
};

export const getFollowingFeed = (currentUser: User | null): Promise<Post[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!currentUser) {
        resolve([]);
        return;
      }

      const followingSnapshot = await getDocs(
        collection(FIREBASE_DB, "users", currentUser.uid, "following")
      );
      const followingIds: string[] = followingSnapshot.docs.map(doc => doc.id);

      if (followingIds.length === 0) {
        resolve([]);
        return;
      }

      const q = query(
        collection(FIREBASE_DB, "post"),
        where("userId", "in", followingIds),
        orderBy("creation", "desc"),
      );

      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as Post;
      });

      resolve(posts);
    } catch (error) {
      console.error("Failed to get following feed: ", error);
      reject(error);
    }
  });
};

/**
 * Gets the like state of a user in a specific post
 * @param {String} postId - id of the post
 * @param {String} uid - id of the user to get the like state of.
 *
 * @returns {Promise<Boolean>} true if user likes it and vice versa.
 */
export const getLikeById = async (postId: string, uid: string) => {
  try {
    const likeDoc = await getDoc(
      doc(FIREBASE_DB, "post", postId, "likes", uid),
    );
    return likeDoc.exists();
  } catch (error) {
    throw new Error("Could not get like");
  }
};

/**
 * Gets the save state of a user in a specific post
 * @param {String} postId - id of the post
 * @param {String} uid - id of the user to get the save state of.
 *
 * @returns {Promise<Boolean>} true if user saved it and vice versa.
 */
export const getSaveById = async (postId: string, uid: string) => {
  try {
    const savedoc = await getDoc(
      doc(FIREBASE_DB, "post", postId, "saves", uid),
    );
    return savedoc.exists();
  } catch (error) {
    throw new Error("Could not get like");
  }
};

/**
 * Updates the like of a post according to the current user's id
 * @param {String} postId - id of the post
 * @param {String} uid - id of the user to get the like state of.
 * @param {Boolean} currentLikeState - true if the user likes the post and vice versa.
 */
export const updateLike = async (
  postId: string,
  uid: string,
  currentLikeState: boolean,
) => {
  const likeDocRef = doc(FIREBASE_DB, "post", postId, "likes", uid);

  try {
    if (currentLikeState) {
      await deleteDoc(likeDocRef);
    } else {
      await setDoc(likeDocRef, {});
    }
  } catch (error) {
    throw new Error("Could not update like");
  }
};

/**
 * Updates the boomark of a post according to the current user's id
 * @param {String} postId - id of the post
 * @param {String} uid - id of the user to get the like state of.
 * @param {Boolean} currentSaveState - false if the user saves the post and vice versa.
 */
export const updateSavePost = async (
  postId: string,
  uid: string,
  currentSaveState: boolean,
) => {
  const postSaveDoc = doc(FIREBASE_DB, "post", postId, "saves", uid);
  const saveRelationship = doc(FIREBASE_DB, "saves", uid, "posts", postId);

  try {
    if (currentSaveState) {
      await deleteDoc(postSaveDoc);
      await deleteDoc(saveRelationship);
    } else {
      await setDoc(postSaveDoc, {});
      await setDoc(saveRelationship, {});
    }
  } catch (error) {
    throw new Error("Could not update save post");
  }
};

export const addComment = async (
  postId: string,
  creator: string,
  comment: string,
) => {
  try {
    await addDoc(collection(FIREBASE_DB, "post", postId, "comments"), {
      creator,
      comment,
      creation: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error adding comment: ", e);
  }
};

export const commentListener = (
  postId: string,
  setCommentList: Dispatch<SetStateAction<Comment[]>>,
) => {
  const commentsQuery = query(
    collection(FIREBASE_DB, "post", postId, "comments"),
    orderBy("creation", "desc"),
  );

  const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
    if (snapshot.docChanges().length === 0) {
      return;
    }
    const comments = snapshot.docs.map((docSnapshot) => {
      const id = docSnapshot.id;
      const data = docSnapshot.data();
      return { id, ...data } as Comment;
    });
    setCommentList(comments);
  });

  return unsubscribe;
};

export const clearCommentListener = () => {
  if (commentListenerInstance != null) {
    commentListenerInstance();
    commentListenerInstance = null;
  }
};

export const getPostsByUserId = (
  uid = FIREBASE_AUTH.currentUser?.uid,
): Promise<Post[]> => {
  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new Error("User ID is not set"));
      return;
    }

    const q = query(
      collection(FIREBASE_DB, "post"),
      where("creator", "==", uid),
      orderBy("creation", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let posts = snapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data } as Post;
      });
      resolve(posts);
    });

    return () => unsubscribe();
  });
};

export const deletePost = async (post: Post) => {
  console.log("Deleting post:", post.id)
  try {
    // get number of likes
    const likesSnapshot = await getDocs(
      collection(FIREBASE_DB, "post", post.id, "likes"),
    );
    // get saves from post
    const savesSnapshot = await getDocs(
      collection(FIREBASE_DB, "post", post.id, "saves"),
    );

    // get users current likes from the user doc object
    const currentLikes = (await getDoc(doc(FIREBASE_DB, "user", post.creator)))
      .data()?.likesCount;
    console.log("Current likes:", currentLikes);
    console.log("Likes snapshot:", likesSnapshot.size);
    // decrease like count on user object
    await setDoc(
      doc(FIREBASE_DB, "user", post.creator),
      {
        likesCount: FIREBASE_AUTH.currentUser
          ? currentLikes - likesSnapshot.size
          : 0,
      },
      { merge: true },
    );

    // loop over users who saved
    savesSnapshot.forEach(async (save) => {
      // get user
      const user = await getDoc(doc(FIREBASE_DB, "user", save.id));
      
      // from the save directory, delete the posts from it
      await deleteDoc(doc(FIREBASE_DB, "saves", user.id, "posts", post.id));
    });

    await deleteDoc(doc(FIREBASE_DB, "post", post.id));
  } catch (error) {
    throw new Error("Could not delete post");
  }
};
