import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userAuthStateListener } from "../../redux/slices/authSlice"; // Make sure the path is correct
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from 'expo-linking';
import AuthScreen from "../../screens/auth";
import { AppDispatch, RootState } from "../../redux/store";
import HomeScreen from "../home";
import { View, ActivityIndicator } from "react-native";
import SavePostScreen from "../../screens/savePost";
import EditProfileScreen from "../../screens/profile/edit";
import EditProfileFieldScreen from "../../screens/profile/edit/field";
import Modal from "../../components/modal";
import ProfileScreen from "../../screens/profile";
import ChatSingleScreen from "../../screens/chat/single";
import SettingsScreen from "../../screens/settings";
import OnboardingScreen from "../../screens/onboarding";
import SearchRecipeScreen from "../../screens/search/SearchRecipe";
import FindChefScreen from "../../screens/search/FindChef";
import WhatIHaveScreen from "../../screens/search/WhatIHave";
import { DocumentReference } from "firebase/firestore";
import UploadScreen from "../../screens/upload";
import PostSingle from "../../components/post";
import { RouteProp } from "@react-navigation/native";
import FeedMisc from "../../screens/feedMisc";
import { Post } from "../../../types";

const PostScreen = ({ route }: { route: RouteProp<RootStackParamList, "post"> }) => {
  return <PostSingle item={route.params.item} />;
};

export interface FeedMiscProps {
  profile?: {
    creator: string,
  }
  saved?: {
    filteredPosts: Post[]
  },
  postIndex: number,
  postId?: string, // For deep link navigation
}

export type RootStackParamList = {
  home: undefined;
  auth: undefined;
  onboarding: undefined;
  feedMisc: FeedMiscProps;
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
  post: { item?: any; id?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Configure deep linking
const linking = {
  prefixes: [Linking.createURL('/'), 'dishdive://'],
  config: {
    screens: {
      home: '',
      feedMisc: {
        path: '/post',
        parse: {
          postId: (id: string) => id,
        },
      },
      profileOther: {
        path: '/profile/:initialUserId',
        parse: {
          initialUserId: (id: string) => id,
        },
      },
      // Add other screens as needed
    },
  },
};

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
    <NavigationContainer linking={linking}>
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
            <Stack.Screen
              name="post"
              component={PostScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="feedMisc"
              component={FeedMisc}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
      <Modal />
    </NavigationContainer>
  );
}
