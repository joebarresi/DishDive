import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
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

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const dispatch: AppDispatch = useDispatch();
  
  const handleRawPost = (video: string, thumbnail: string) => {
    setRequestRunning(true);
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
      }
    })
    .catch(() => setRequestRunning(false));
  };

  const generateThumbnail = async (source: string) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(source, {
        time: 5000,
      });
      return uri;
    } catch (e) {
      console.warn("Error generating thumbnail:", e);
      return null;
    }
  };

  const pickVideo = async () => {
    try {
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
        }
      }
    } catch (error) {
      console.warn("Error picking video:", error);
    }
  };

  const pickFromCamera = async () => {
    try {
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
          }
        }
      }
    } catch (error) {
      console.warn("Error recording video:", error);
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
  }
});
