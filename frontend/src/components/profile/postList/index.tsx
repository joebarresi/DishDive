import { View, FlatList, Dimensions, ActivityIndicator } from "react-native";
import ProfilePostListItem from "./item";
import styles from "./styles";
import { RootState } from "../../../redux/store";
import { APP_COLOR } from "../../../styles";

export default function ProfilePostList({
  posts,
  user,
  isLoading = false,
}: {
  posts: RootState["post"]["currentUserPosts"];
  user: RootState["auth"]["currentUser"];
  isLoading?: boolean;
}) {
  const windowWidth = Dimensions.get('window').width;
  
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={APP_COLOR} />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        numColumns={3}
        scrollEnabled={false}
        removeClippedSubviews
        nestedScrollEnabled
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProfilePostListItem user={user} item={item} />}
        contentContainerStyle={{ alignSelf: 'center', width: windowWidth }}
      />
    </View>
  );
}
