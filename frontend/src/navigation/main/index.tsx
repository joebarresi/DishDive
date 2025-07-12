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
import SearchRecipeScreen from "../../screens/search/SearchRecipe";
import FindChefScreen from "../../screens/search/FindChef";
import WhatIHaveScreen from "../../screens/search/WhatIHave";
import { DocumentReference } from "firebase/firestore";
import UploadScreen from "../../screens/upload";

export type RootStackParamList = {
  home: undefined;
  auth: undefined;
  onboarding: undefined;
  userPosts: { creator: string; profile: boolean };
  profileOther: { initialUserId: string };
  savePost: { docRef: DocumentReference, source: string };
  editProfile: undefined;
  editProfileField: { title: string; field: string; value: string };
  chatSingle: { chatId?: string; contactId?: string };
  settings: undefined;
  searchRecipe: undefined;
  findChef: undefined;
  whatIHave: undefined;
  uploadScreen: undefined;
  creator: undefined;
  notifications: undefined;
  post: { item: any };
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
        <ActivityIndicator size="large" color="#8B54FB" />
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
              name="uploadScreen"
              component={UploadScreen}
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
            <Stack.Screen
              name="searchRecipe"
              component={SearchRecipeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="findChef"
              component={FindChefScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="whatIHave"
              component={WhatIHaveScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
      <Modal />
    </NavigationContainer>
  );
}
