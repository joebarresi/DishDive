import { ScrollView, RefreshControl, ActivityIndicator, View } from "react-native";
import styles from "./styles";
import ProfileNavBar from "../../components/profile/navBar";
import ProfileHeader from "../../components/profile/header";
import ProfilePostList from "../../components/profile/postList";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import {
  CurrentUserProfileItemInViewContext,
  FeedStackParamList,
} from "../../navigation/feed";
import { useUser } from "../../hooks/useUser";
import { getPostsByUserId } from "../../services/posts";
import { Post } from "../../../types";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/main";
import { HomeStackParamList } from "../../navigation/home";
import { APP_COLOR } from "../../styles";

type ProfileScreenRouteProp =
  | RouteProp<RootStackParamList, "profileOther">
  | RouteProp<HomeStackParamList, "Me">
  | RouteProp<FeedStackParamList, "feedProfile">;

export default function ProfileScreen({
  route,
}: {
  route: ProfileScreenRouteProp;
}) {
  const { initialUserId } = route.params;
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);

  const providerUserId = useContext(CurrentUserProfileItemInViewContext);

  const userQuery = useUser(
    initialUserId ? initialUserId : providerUserId.currentUserProfileItemInView,
  );

  const user = userQuery.data;

  const fetchUserPosts = async (showRefreshing = false) => {
    if (!user) {
      return;
    }

    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setPostsLoading(true);
    }

    try {
      // Fetch user posts
      const posts = await getPostsByUserId(user.uid);
      setUserPosts(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setRefreshing(false);
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const onRefresh = () => {
    // Refresh user data
    userQuery.refetch();
    
    // Refresh posts
    fetchUserPosts(true);
  };

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={APP_COLOR} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProfileNavBar user={user} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={APP_COLOR}
            colors={[APP_COLOR]}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        <ProfileHeader user={user} />
        <ProfilePostList user={user} posts={userPosts} isLoading={postsLoading} />
      </ScrollView>
    </SafeAreaView>
  );
}
