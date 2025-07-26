import { Image, ListRenderItemInfo, TouchableOpacity, View, Text } from "react-native";
import styles from "./styles";
import { Post } from "../../../../../types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/main";
import { RootState } from "../../../../redux/store";
import { Feather } from "@expo/vector-icons";

export default function ProfilePostListItem({ renderItem, user }: { renderItem: ListRenderItemInfo<Post>; user: RootState["auth"]["currentUser"]; }) {
  const { item, index } = renderItem
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const viewCount = item.totalViews || 0;

  return (
    item && (
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          navigation.navigate("feedMisc", {
            profile: {
              creator: user?.uid ?? "",
            },
            postIndex: index
          })
        }
      >
        <Image style={styles.image} source={{ uri: item.media[1] }} />
        
        {/* View count overlay */}
        <View style={styles.overlay}>
          <Feather name="play" size={12} color="white" />
          <Text style={styles.viewCountText}>{viewCount}</Text>
        </View>
      </TouchableOpacity>
    )
  );
}
