import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userAuthStateListener } from "../../redux/slices/authSlice"; // Make sure the path is correct
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../../screens/auth";
import { AppDispatch, RootState } from "../../redux/store";
import HomeScreen from "../home";
import { View, ActivityIndicator } from "react-native";
import SavePostScreen from "../../screens/savePost";
import EditProfileScreen from "../../screens/profile/edit";
import EditProfileFieldScreen from "../../screens/profile/edit/field";
import Modal from "../../components/modal";
import FeedScreen from "../../screens/feed";
import ProfileScreen from "../../screens/profile";
import ChatSingleScreen from "../../screens/chat/single";
import SettingsScreen from "../../screens/settings";
import OnboardingScreen from "../../screens/onboarding";

export type RootStackParamList = {
  home: undefined;
  auth: undefined;
  onboarding: undefined;
  userPosts: { creator: string; profile: boolean };
  profileOther: { initialUserId: string };
  savePost: { source: string; sourceThumb: string };
  editProfile: undefined;
  editProfileField: { title: string; field: string; value: string };
  chatSingle: { chatId?: string; contactId?: string };
  settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Route() {
  const currentUserObj = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(userAuthStateListener());
  }, [dispatch]);

  if (!currentUserObj.loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {currentUserObj.currentUser == null ? (
          <Stack.Screen
            name="auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            {/* Check if the user has a displayName (username) */}
            {!currentUserObj.currentUser.displayName ? (
              <Stack.Screen
                name="onboarding"
                component={OnboardingScreen}
                options={{ headerShown: false }}
              />
            ) : (
              <Stack.Screen
                name="home"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
            )}
            <Stack.Screen
              name="savePost"
              component={SavePostScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="userPosts"
              component={FeedScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="profileOther"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="editProfile"
              component={EditProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="editProfileField"
              component={EditProfileFieldScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="chatSingle"
              component={ChatSingleScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="settings"
              component={SettingsScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
      <Modal />
    </NavigationContainer>
  );
}
