import { Modal, View, TouchableOpacity, Text, StyleSheet, TextInput, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Post, User } from "../../../../types";
import styles from "./styles";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { deletePost, getPostRef } from "../../../services/posts";
import { submitReport } from "../../../services/reports";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../../navigation/home";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { RootStackParamList } from "../../../navigation/main";

interface OtherModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
  post: Post;
}

export default function OtherModal({ visible, onClose, user, post }: OtherModalProps) {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const myPost = currentUser && user.uid === currentUser.uid;
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Report state
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  function deletePostAndNavigate(): void {
    deletePost(post);
    const params = { 
      initialUserId: user.uid,
    }
    navigation.navigate("Me", params)
  }
  
  function navigateToEditPost(): void {
    onClose();
    rootNav.navigate("savePost", { 
      docRef: getPostRef(post),
      source: post.media[1],
      isEdit: true,
    });
  }
  
  function initiateReport(): void {
    setShowReportForm(true);
  }
  
  function cancelReport(): void {
    setShowReportForm(false);
    setReportMessage("");
  }
  
  async function handleSubmitReport(): Promise<void> {
    if (!reportMessage.trim()) {
      Alert.alert("Error", "Please enter a reason for reporting this post.");
      return;
    }
    
    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to report a post.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitReport({
        postId: post.id,
        reportedUserId: post.creator,
        reporterUserId: currentUser.uid,
        message: reportMessage
      });
      
      setIsSubmitting(false);
      setShowReportForm(false);
      setReportMessage("");
      
      Alert.alert(
        "Report Submitted",
        "Thank you for your report. We'll review it shortly.",
        [{ text: "OK", onPress: onClose }]
      );
    } catch (error) {
      console.error("Error submitting report:", error);
      setIsSubmitting(false);
      Alert.alert("Error", "Failed to submit report. Please try again later.");
    }
  }

  // Calculate modal height based on actual number of buttons and their styling
  let modalHeight;
  
  if (showReportForm) {
    modalHeight = 280; // Fixed height for report form
  } else {
    // Count actual buttons that will render
    let buttonCount = 1; // Always have Report button
    if (myPost) {
      buttonCount += 2; // Add Edit Post + Delete Post buttons
    }
    
    
    const modalPadding = 30; // 15px top + 15px bottom
    const closeButtonArea = 40; // Space for close button at top
    const buttonContainerMargin = 20; // marginTop on buttonContainer
    const buttonHeight = 30; // 15px top + 15px bottom padding per button
    
    modalHeight = modalPadding + closeButtonArea + buttonContainerMargin + (buttonHeight * buttonCount);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        if (showReportForm) {
          cancelReport();
        } else {
          onClose();
        }
      }}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { height: modalHeight }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              if (showReportForm) {
                cancelReport();
              } else {
                onClose();
              }
            }}
          >
            <Ionicons name="close" size={24} color="#8B54FB" />
          </TouchableOpacity>
          
          {!showReportForm ? (
            // Main options view
            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity 
                style={modalStyles.button}
                onPress={initiateReport}
              >
                <Ionicons name="flag-outline" size={20} color="#FF5252" style={modalStyles.buttonIcon} />
                <Text style={modalStyles.reportButtonText}>Report</Text>
              </TouchableOpacity>
              
              {myPost && (
                <>
                  <TouchableOpacity 
                    style={modalStyles.button}
                    onPress={navigateToEditPost}
                  >
                    <Ionicons name="create-outline" size={20} color="#8B54FB" style={modalStyles.buttonIcon} />
                    <Text style={modalStyles.editButtonText}>Edit Post</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={modalStyles.deleteButton} 
                    onPress={() => deletePostAndNavigate()}
                  >
                    <Ionicons name="trash-outline" size={20} color="#8B54FB" style={modalStyles.buttonIcon} />
                    <Text style={modalStyles.deleteButtonText}>Delete Post</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            // Report form view
            <View style={modalStyles.reportFormContainer}>
              <Text style={modalStyles.reportFormTitle}>Report Post</Text>
              <Text style={modalStyles.reportFormSubtitle}>Please tell us why you're reporting this post:</Text>
              
              <TextInput
                style={modalStyles.reportInput}
                placeholder="Enter reason for report..."
                multiline
                numberOfLines={3}
                value={reportMessage}
                onChangeText={setReportMessage}
                editable={!isSubmitting}
              />
              
              <View style={modalStyles.reportFormButtons}>
                <TouchableOpacity 
                  style={modalStyles.cancelButton}
                  onPress={cancelReport}
                  disabled={isSubmitting}
                >
                  <Text style={modalStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    modalStyles.submitButton,
                    isSubmitting && modalStyles.disabledButton
                  ]}
                  onPress={handleSubmitReport}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={modalStyles.submitButtonText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  buttonContainer: {
    marginTop: 0, // Increased from 20 to account for close button space
    width: "100%",
  },
  button: {
    width: "100%",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  buttonIcon: {
    marginRight: 10,
  },
  reportButtonText: {
    fontSize: 16,
    color: "#FF5252",
  },
  editButtonText: {
    fontSize: 16,
    color: "#8B54FB",
  },
  deleteButton: {
    width: "100%",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#8B54FB",
    fontWeight: "bold",
  },
  // Report form styles
  reportFormContainer: {
    flex: 1,
    width: "100%",
    paddingTop: 15,
    paddingBottom: 10,
  },
  reportFormTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  reportFormSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  reportInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    height: 80,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  reportFormButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "45%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#FF5252",
    width: "45%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ffb0b0",
  },
});
