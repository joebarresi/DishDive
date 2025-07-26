import {
  doc,
  getDoc,
  writeBatch,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";

/**
 * Records a view for a post by a user using batch writes
 * Implements the hybrid approach from the design document
 * 
 * @param postId - The ID of the post being viewed
 * @param userId - The ID of the user viewing the post
 */
export const recordPostView = async (postId: string, userId: string): Promise<void> => {
  try {
    const batch = writeBatch(FIREBASE_DB);

    const postRef = doc(FIREBASE_DB, `post/${postId}`);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      console.error(`Post ${postId} not found`);
      return;
    }

    const viewRef = doc(FIREBASE_DB, `post/${postId}/views/${userId}`);
    const viewSnap = await getDoc(viewRef);

    if (viewSnap.exists()) {
      batch.update(viewRef, {
        viewCount: increment(1),
        lastViewedAt: serverTimestamp()
      });
    } else {
      batch.set(viewRef, {
        userId,
        viewCount: 1,
        firstViewedAt: serverTimestamp(),
        lastViewedAt: serverTimestamp()
      });

      batch.update(postRef, {
        viewCount: increment(1)
      });
    }
    batch.update(postRef, {
      totalViews: increment(1),
      lastViewedAt: serverTimestamp()
    });

    const userViewRef = doc(FIREBASE_DB, `user/${userId}/viewedPosts/${postId}`);
    const userViewSnap = await getDoc(userViewRef);

    if (userViewSnap.exists()) {
      batch.update(userViewRef, {
        viewCount: increment(1),
        lastViewedAt: serverTimestamp()
      });
    } else {
      batch.set(userViewRef, {
        postId,
        viewCount: 1,
        lastViewedAt: serverTimestamp()
      });
    }

    // Commit all operations atomically
    await batch.commit();
  } catch (error) {
    console.error('Failed to record post view:', error);
    throw error;
  }
};
