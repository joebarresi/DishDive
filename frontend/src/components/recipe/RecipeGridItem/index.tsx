import React, { useEffect } from "react";
import { TouchableOpacity, Image, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Post, ExternalPost } from "../../../../types";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../../../navigation/main";

interface RecipeGridItemProps {
  item: Post | ExternalPost;
  index: number;
  filteredPosts: Post[];
}

const isExternalPost = (post: Post | ExternalPost): post is ExternalPost => {
  return (post as ExternalPost).link !== undefined;
};

const RecipeGridItem: React.FC<RecipeGridItemProps> = ({ item, index, filteredPosts }) => {
  // deprecated for time being
  // const openExternalRecipe = async (url: string) => {
  //   try {
  //     console.log("Opening link", url);
  //     const supported = await Linking.canOpenURL(url);

  //     if (supported) {
  //       await Linking.openURL(url);
  //     } else {
  //       console.log(`Don't know how to open this URL: ${url}`);
  //     }
  //   } catch (error) {
  //     console.error('Error opening URL:', error);
  //   }
  // };

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  return (
    <View style={styles.gridItem}>
      <View style={styles.contentContainer}>
        {isExternalPost(item) ? (
          <>
            <View style={styles.externalPostContainer}>
              <Ionicons name="link" size={24} color="#ccc" />
              <Text style={styles.externalPostText}>External Recipe</Text>
            </View>
            <View style={styles.gridItemTitle}>
              <Text style={styles.gridItemTitleText} numberOfLines={2}>
                {item.recipe?.title || "Untitled Recipe"}
              </Text>
            </View>
          </>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("feedMisc", { saved: { filteredPosts }, postIndex: index})}>
            <Image
              source={{ uri: item.media?.[1] || "https://via.placeholder.com/300?text=Recipe" }}
              style={styles.gridItemImage}
              resizeMode="cover"
            />
            <View style={styles.gridItemTitle}>
              <Text style={styles.gridItemTitleText} numberOfLines={2}>
                {item.recipe?.title || "Untitled Recipe"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default RecipeGridItem;