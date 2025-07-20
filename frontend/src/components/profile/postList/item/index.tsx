import { Image, ListRenderItemInfo, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Post } from "../../../../../types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/main";
import { RootState } from "../../../../redux/store";

export default function ProfilePostListItem({ renderItem, user }: { renderItem: ListRenderItemInfo<Post>; user: RootState["auth"]["currentUser"]; }) {
  const { item, index } = renderItem
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
      </TouchableOpacity>
    )
  );
}
