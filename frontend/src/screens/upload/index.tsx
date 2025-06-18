import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import styles from "./styles";
import { RootStackParamList } from "../../navigation/main";
import { useDispatch } from "react-redux";
import { createRawPost } from "../../redux/slices/postSlice";
import { AppDispatch } from "../../redux/store";
import { DocumentReference, DocumentData } from "firebase/firestore";

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
      // No permissions request is necessary for launching the image library in newer Expo versions
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
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
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
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
        <ActivityIndicator color="#ff4040" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={localStyles.pickerContainer}>
        <Text style={localStyles.title}>Create a New Post</Text>
        
        <View style={localStyles.previewContainer}>
          {videoPreview ? (
            <Image 
              source={{ uri: videoPreview }} 
              style={localStyles.previewImage} 
            />
          ) : (
            <View style={localStyles.placeholderContainer}>
              <Feather name="video" size={50} color="#666" />
              <Text style={localStyles.placeholderText}>No video selected</Text>
            </View>
          )}
        </View>

        <View style={localStyles.buttonContainer}>
          <TouchableOpacity 
            style={localStyles.button} 
            onPress={pickVideo}
          >
            <Feather name="image" size={24} color="white" style={localStyles.buttonIcon} />
            <Text style={localStyles.buttonText}>Pick from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={localStyles.button} 
            onPress={pickFromCamera}
          >
            <Feather name="video" size={24} color="white" style={localStyles.buttonIcon} />
            <Text style={localStyles.buttonText}>Record Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  previewContainer: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 30,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#666',
    marginTop: 10,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: 15,
  },
  button: {
    backgroundColor: '#ff4040',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 10,
  },
});
