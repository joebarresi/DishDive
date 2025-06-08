import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/main";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { HomeStackParamList } from "../../navigation/home";

/**
 * CreatorScreen component that provides access to Upload and Profile screens
 * with a notification button in the corner
 */
export default function CreatorScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleUploadPress = () => {
    navigation.navigate("uploadScreen")
  };

  const handleProfilePress = () => {
    navigation.navigate("profileOther", { 
      initialUserId: FIREBASE_AUTH.currentUser?.uid ?? "" 
    });
  };

  const handleNotificationsPress = () => {
    navigation.navigate("notifications");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Notification button in top right corner */}
      <TouchableOpacity 
        style={styles.notificationButton}
        onPress={handleNotificationsPress}
      >
        <Feather name="bell" size={24} color="#FF6B6B" />
      </TouchableOpacity>

      {/* Upper half - Upload section */}
      <TouchableOpacity 
        style={[styles.section, styles.uploadSection]} 
        onPress={handleUploadPress}
      >
        <Feather name="video" size={48} color="#FFF" />
        <Text style={styles.sectionTitle}>Upload Video</Text>
        <Text style={styles.sectionSubtitle}>Share your cooking with the world</Text>
      </TouchableOpacity>

      {/* Lower half - Profile section */}
      <TouchableOpacity 
        style={[styles.section, styles.profileSection]} 
        onPress={handleProfilePress}
      >
        <Feather name="user" size={48} color="#FFF" />
        <Text style={styles.sectionTitle}>My Profile</Text>
        <Text style={styles.sectionSubtitle}>View and manage your content</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  notificationButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  section: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  uploadSection: {
    backgroundColor: "#FF6B6B",
  },
  profileSection: {
    backgroundColor: "#4ECDC4",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#FFF",
    opacity: 0.8,
    marginTop: 8,
  },
});
