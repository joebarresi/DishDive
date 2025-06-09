import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const db = admin.firestore();

/**
 * Process a newly created post by:
 * 1. Updating the post count for the creator
 * 2. Adding any necessary metadata to the post
 * 3. Creating notifications for followers
 *
 * @param {admin.firestore.DocumentSnapshot} snapshot
 * - The snapshot of the new post
 * @param {functions.EventContext} context - The event context
 * @return {Promise<void>} A promise that resolves when processing is complete
 */
export const processNewPost = async (
    snapshot: admin.firestore.DocumentSnapshot,
    context: functions.EventContext
): Promise<void> => {
  const postData = snapshot.data();

  if (!postData) {
    console.log("No data in new post document");
    return;
  }

  const postId = snapshot.id;
  const creatorId = postData.creator;

  if (!creatorId) {
    console.log("No creator ID found in post data");
    return;
  }

  try {
    // Run all operations in a transaction to ensure consistency
    await db.runTransaction(async (transaction) => {
      // 1. Update the post count for the creator
      const creatorRef = db.collection("user").doc(creatorId);
      const creatorDoc = await transaction.get(creatorRef);

      if (!creatorDoc.exists) {
        throw new Error(`Creator with ID ${creatorId} not found`);
      }

      transaction.update(creatorRef, {
        postsCount: admin.firestore.FieldValue.increment(1),
      });

      // 2. Add any additional metadata to the post if needed
      // For example, add a 'processed' flag or timestamp
      transaction.update(snapshot.ref, {
        processed: true,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 3. Create notifications for followers
      // Get all followers of the creator
      const followersRef = db.collection("user").doc(creatorId).collection("followers");
      const followersSnapshot = await transaction.get(followersRef);

      // Batch create notifications (outside of transaction since this could be many)
      const batch = db.batch();
      followersSnapshot.forEach((followerDoc) => {
        const followerId = followerDoc.id;
        const notificationRef = db.collection("notifications").doc();

        batch.set(notificationRef, {
          recipientId: followerId,
          senderId: creatorId,
          type: "new_post",
          postId: postId,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      // Commit the batch after the transaction completes
      await batch.commit();
    });

    console.log(`Successfully processed new post: ${postId}`);
  } catch (error) {
    console.error("Error processing new post:", error);
    throw error;
  }
};
