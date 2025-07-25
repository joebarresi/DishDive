import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/main";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { signOut } from "../../redux/slices/authSlice";
import styles from "./styles";
import ScreenContainer from "../../components/common/ScreenContainer";

export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  const handleSignOut = async () => {
    try {
      await dispatch(signOut());
      // Navigation will be handled by the auth state listener in main/index.tsx
    } catch (error) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
      console.error("Sign out error:", error);
    }
  };

  return (
    <ScreenContainer
      title="Settings"
      showBackButton={true}
    >
      <View style={styles.settingsContainer}>
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => navigation.navigate("editProfile")}
        >
          <Feather name="user" size={20} style={styles.itemIcon} />
          <Text style={styles.itemText}>Edit Profile</Text>
          <Feather name="chevron-right" size={20} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.settingsItem, styles.signOutButton]}
          onPress={() => {
            Alert.alert(
              "Sign Out",
              "Are you sure you want to sign out?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Sign Out", onPress: handleSignOut, style: "destructive" }
              ]
            );
          }}
        >
          <Feather name="log-out" size={20} style={styles.itemIcon} color="#8B54FB" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        {/* Until we get preferences ignore
         * <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => {
          }}
        >
          <Feather name="settings" size={20} style={styles.itemIcon} />
          <Text style={styles.itemText}>Preferences</Text>
          <Feather name="chevron-right" size={20} />
        </TouchableOpacity> */}
      </View>
    </ScreenContainer>
  );
}
