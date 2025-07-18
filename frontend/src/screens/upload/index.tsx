import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "./styles";
import { RootStackParamList } from "../../navigation/main";
import { useDispatch } from "react-redux";
import { createRawPost } from "../../redux/slices/postSlice";
import { AppDispatch } from "../../redux/store";
import { DocumentReference, DocumentData } from "firebase/firestore";
import { APP_COLOR } from "../../styles";
import NavBarGeneral from "../../components/common/navbar";

/**
 * Function that renders a component responsible for
 * letting the user pick a video from the gallery
 * @returns Functional Component
 */
export default function UploadScreen() {
  const [requestRunning, setRequestRunning] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [failedUpload, setFailedUpload] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const dispatch: AppDispatch = useDispatch();
  
  const handleRawPost = (video: string, thumbnail: string) => {
    setRequestRunning(true);
    setFailedUpload(false);
    setErrorMessage("");
    
    dispatch(
      createRawPost({
        video,
        thumbnail,
      }),
    )
    .then((data) => {
      setRequestRunning(false);
      if (data.meta?.requestStatus === "fulfilled") {
        navigation.navigate("savePost", {docRef: data.payload as DocumentReference<DocumentData>, source: video});
      } else if (data.meta?.requestStatus === "rejected") {
        // Handle rejection with error message from the payload
        const errorPayload = data.payload as any;
        const errorMsg = errorPayload?.message || "Failed to process video. Please try again.";
        
        console.error("Create raw post failed:", errorMsg);
        setFailedUpload(true);
        setErrorMessage(errorMsg);
        
        // Show alert for better visibility
        Alert.alert(
          "Upload Failed",
          errorMsg,
          [{ text: "OK" }]
        );
      }
    })
    .catch((error) => {
      console.error("Create raw post error:", error);
      setFailedUpload(true);
      setRequestRunning(false);
      
      // Extract error message
      const errorMsg = error?.message || "Something went wrong while processing your video. Please try again.";
      setErrorMessage(errorMsg);
      
      // Show alert for better visibility
      Alert.alert(
        "Upload Failed",
        errorMsg,
        [{ text: "OK" }]
      );
    });
  };

  const generateThumbnail = async (source: string) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(source, {
        time: 5000,
      });
      return uri;
    } catch (e) {
      console.warn("Error generating thumbnail:", e);
      setErrorMessage("Failed to generate video thumbnail. Please try again.");
      setFailedUpload(true);
      return null;
    }
  };

  const pickVideo = async () => {
    try {
      // Reset error states
      setFailedUpload(false);
      setErrorMessage("");
      
      // Using the correct API for expo-image-picker v16
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "videos",
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setVideoPreview(result.assets[0].uri);
        const sourceThumb = await generateThumbnail(result.assets[0].uri);
        if (sourceThumb) {
          handleRawPost(result.assets[0].uri, sourceThumb);
        } else {
          // Thumbnail generation failed
          setFailedUpload(true);
          if (!errorMessage) {
            setErrorMessage("Failed to generate video thumbnail. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Error picking video:", error);
      setFailedUpload(true);
      setErrorMessage("Failed to select video. Please try again.");
    }
  };

  const pickFromCamera = async () => {
    try {
      // Reset error states
      setFailedUpload(false);
      setErrorMessage("");
      
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.granted) {
        // Using the correct API for expo-image-picker v16
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: "videos",
          allowsEditing: true,
          aspect: [16, 9],
          quality: 1,
          videoMaxDuration: 60,
        });

        console.log(result);

        if (!result.canceled && result.assets && result.assets.length > 0) {
          setVideoPreview(result.assets[0].uri);
          const sourceThumb = await generateThumbnail(result.assets[0].uri);
          if (sourceThumb) {
            handleRawPost(result.assets[0].uri, sourceThumb);
          } else {
            // Thumbnail generation failed
            setFailedUpload(true);
            if (!errorMessage) {
              setErrorMessage("Failed to generate video thumbnail. Please try again.");
            }
          }
        }
      } else {
        setFailedUpload(true);
        setErrorMessage("Camera permission denied. Please enable camera access in your device settings.");
      }
    } catch (error) {
      console.error("Error recording video:", error);
      setFailedUpload(true);
      setErrorMessage("Failed to record video. Please try again.");
    }
  };

  const retryUpload = () => {
    setFailedUpload(false);
    setErrorMessage("");
    if (videoPreview) {
      generateThumbnail(videoPreview).then(sourceThumb => {
        if (sourceThumb) {
          handleRawPost(videoPreview, sourceThumb);
        }
      });
    }
  };

  if (requestRunning) {
    return (
      <View style={styles.uploadingContainer}>
        <ActivityIndicator color={APP_COLOR} size="large" />
        <Text style={localStyles.uploadingText}>Generating your recipe. This can take more than 30 seconds</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Use NavBarGeneral for consistent navigation header */}
      <NavBarGeneral 
        title="Create" 
        leftButton={{ 
          display: true,
          color: "white"
        }}
      />
      
      <View style={localStyles.contentContainer}>
        {failedUpload && (
          <View style={localStyles.errorContainer}>
            <Text style={localStyles.errorText}>
              {errorMessage || "Video upload failed. Please try again."}
            </Text>
            {videoPreview && (
              <TouchableOpacity 
                style={localStyles.retryButton} 
                onPress={retryUpload}
              >
                <Text style={localStyles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        <Text style={localStyles.comingSoonText}>Soon to come: video filming</Text>
        
        <TouchableOpacity 
          style={localStyles.galleryButton} 
          onPress={pickVideo}
        >
          <Feather name="image" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  comingSoonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  galleryButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: APP_COLOR,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadingText: {
    color: 'white',
    marginTop: 20,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: APP_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  }
});
