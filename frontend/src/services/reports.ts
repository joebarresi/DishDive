import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";

interface ReportData {
  postId: string;
  reportedUserId: string;
  reporterUserId: string;
  message: string;
}

/**
 * Submit a report for a post
 * @param reportData Report data including postId, reportedUserId, reporterUserId, and message
 * @returns Promise that resolves with the report ID on success
 */
export const submitReport = async (reportData: ReportData): Promise<string> => {
  try {
    // Create a unique ID for the report
    const reportsCollection = collection(FIREBASE_DB, 'reports');
    const reportRef = doc(reportsCollection);
    const reportId = reportRef.id;
    
    // Create the report document
    await setDoc(reportRef, {
      id: reportId,
      postId: reportData.postId,
      reportedUserId: reportData.reportedUserId,
      reporterUserId: reportData.reporterUserId,
      message: reportData.message,
      createdAt: serverTimestamp(),
      status: 'pending' // pending, reviewed, dismissed
    });
    
    return reportId;
  } catch (error) {
    console.error("Error submitting report:", error);
    throw error;
  }
};
