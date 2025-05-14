import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/slices/authSlice";
import { AppDispatch } from "../../redux/store";
import styles from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/main";

interface OnboardingScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "onboarding">;
}

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  function hasSpecialCharacters(str: string): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
  }

  const handleContinue = async () => {
    setErrorMessage("");
    
    if (!username.trim()) {
      setErrorMessage("Username is required");
      return;
    }

    if (hasSpecialCharacters(username)) {
      setErrorMessage("Username cannot contain special characters");
      return;
    }

    setIsLoading(true);
    
    try {
      // Use our new updateUserProfile action to update both Auth and Firestore
      await dispatch(updateUserProfile({ displayName: username })).unwrap();
      
      // Force navigation to home screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'home' }],
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to DishDive!</Text>
      <Text style={styles.subHeaderText}>
        Choose a username so others can find you on the platform.
      </Text>
      
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      
      <TextInput
        onChangeText={(text) => setUsername(text)}
        style={styles.textInput}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
