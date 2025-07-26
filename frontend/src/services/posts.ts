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

export const getViewedPostIds = (currentUser: User | null): Promise<string[]> => {
  return new Promise(async (resolve, reject) => {
    if (!currentUser) {
      reject(new Error("User not logged in"));
      return;
    }

    try {
      const viewedQuery = query(
        collection(FIREBASE_DB, `user/${currentUser.uid}/viewedPosts`),
        orderBy('lastViewedAt', 'desc')
      );

      const viewedSnap = await getDocs(viewedQuery);
      const viewedPostIds = viewedSnap.docs.map(doc => doc.id);

      resolve(viewedPostIds);
    } catch (error) {
      console.error("Failed to get viewed posts: ", error);
      reject(error);
    }
  });

}

export const getMyFeed = (currentUser: User | null): Promise<Post[]> => {
  console.log('Getting my feed');
  return new Promise(async (resolve, reject) => {
    if (!currentUser) {
      reject(new Error("User not logged in"));
      return;
    }

    try {
      const viewedPostIds = await getViewedPostIds(currentUser)
      console.log('viewedPostIds', viewedPostIds.length);

      let q;
      if (viewedPostIds.length > 0) {
        q = query(
          collection(FIREBASE_DB, "post"),
          where("creator", "!=", currentUser?.uid),
          where("uploadStatus", "==", "published"),
          orderBy("likesCount", "desc"),
        );
      } else {
        q = query(
          collection(FIREBASE_DB, "post"),
          where("creator", "!=", currentUser?.uid),
          where("uploadStatus", "==", "published"),
          orderBy("likesCount", "desc"),
        );
      }

      const querySnapshot = await getDocs(q);
      const allPosts = querySnapshot.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as Post;
      });

      const unviewedPosts = allPosts.filter(post => !(viewedPostIds.includes(post.id)));
      
      resolve(unviewedPosts);
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
        collection(FIREBASE_DB, "user", currentUser.uid, "following")
      );
      const followingIds: string[] = followingSnapshot.docs.map(doc => doc.id);

      if (followingIds.length === 0) {
        resolve([]);
        return;
      }

      const viewedPostIds = await getViewedPostIds(currentUser);

      // Get all posts from following users
      const q = query(
        collection(FIREBASE_DB, "post"),
        where("creator", "in", followingIds),
        where("uploadStatus", "==", "published"),
        orderBy("creation", "desc"),
      );

      const querySnapshot = await getDocs(q);
      const allPosts = querySnapshot.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as Post;
      });

      const unviewedPosts = allPosts.filter(post => !(viewedPostIds.includes(post.id)));

      resolve(unviewedPosts);
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

export const clearCommentListener = () => {
  if (commentListenerInstance != null) {
    commentListenerInstance();
    commentListenerInstance = null;
  }
};

/**
 * Returns a specific post by its ID.
 *
 * @param {string} postId - The ID of the post to retrieve
 * @returns {Promise<Post | null>} post if found, null otherwise.
 */
export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    const postDoc = await getDoc(doc(FIREBASE_DB, "post", postId));
    if (postDoc.exists()) {
      const data = postDoc.data();
      return { id: postDoc.id, ...data } as Post;
    } else {
      console.log("No post found with ID:", postId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null;
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
      where("uploadStatus", "==", "published"),
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

// GIven a post object, get the reference to the document
export const getPostRef = (post: Post) => {
  return doc(FIREBASE_DB, "post", post.id);
};

export const deletePost = async (post: Post) => {
  console.log("Deleting post:", post.id)
  try {
    const likesSnapshot = await getDocs(
      collection(FIREBASE_DB, "post", post.id, "likes"),
    );
    const savesSnapshot = await getDocs(
      collection(FIREBASE_DB, "post", post.id, "saves"),
    );
    const currentLikes = (await getDoc(doc(FIREBASE_DB, "user", post.creator)))
      .data()?.likesCount;
    console.log("Current likes:", currentLikes);
    console.log("Likes snapshot:", likesSnapshot.size);
    await setDoc(
      doc(FIREBASE_DB, "user", post.creator),
      {
        likesCount: FIREBASE_AUTH.currentUser
          ? currentLikes - likesSnapshot.size
          : 0,
      },
      { merge: true },
    );

    savesSnapshot.forEach(async (save) => {
      const user = await getDoc(doc(FIREBASE_DB, "user", save.id));  
      await deleteDoc(doc(FIREBASE_DB, "saves", user.id, "posts", post.id));
    });

    await deleteDoc(doc(FIREBASE_DB, "post", post.id));
  } catch (error) {
    throw new Error("Could not delete post");
  }
};



// Comments we're not using rn
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

// export const getTrendingFeed = (currentUser: User | null): Promise<Post[]> => {
//   return new Promise(async (resolve, reject) => {
//     if (!currentUser) {
//       reject(new Error("User not logged in"));
//       return;
//     }

//     try {
//       const q = query(
//         collection(FIREBASE_DB, "post"),
//         where("creator", "!=", currentUser?.uid),
//         where("uploadStatus", "==", "published"),
//         orderBy("likesCount", "desc"),
//       );
//       const querySnapshot = await getDocs(q);
//       const posts = querySnapshot.docs.map((doc) => {
//         const id = doc.id;
//         const data = doc.data();
//         return { id, ...data } as Post;
//       });
//       resolve(posts);
//     } catch (error) {
//       console.error("Failed to get feed: ", error);
//       reject(error);
//     }
//   });
// };