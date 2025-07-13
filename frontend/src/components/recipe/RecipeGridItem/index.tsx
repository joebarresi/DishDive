import React from "react";
import { TouchableOpacity, Image, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Post, ExternalPost } from "../../../../types";
import styles from "./styles";

interface RecipeGridItemProps {
  item: Post | ExternalPost;
  onViewVideo: (item: Post | ExternalPost) => void;
  onViewRecipe: (item: Post | ExternalPost) => void;
}

const isExternalPost = (post: Post | ExternalPost): post is ExternalPost => {
  return (post as ExternalPost).link !== undefined;
};

const RecipeGridItem: React.FC<RecipeGridItemProps> = ({ item, onViewVideo, onViewRecipe }) => {
  const openExternalRecipe = async (url: string) => {
    try {
      console.log("Opening link", url);
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log(`Don't know how to open this URL: ${url}`);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };
  
  return (
    <View style={styles.gridItem}>
      <View style={styles.contentContainer}>
        {isExternalPost(item) ? (
          <View style={styles.externalPostContainer}>
            <Ionicons name="link" size={24} color="#ccc" />
            <Text style={styles.externalPostText}>External Recipe</Text>
          </View>
        ) : (
          <>
            <Image
              source={{ uri: item.media?.[1] || "https://via.placeholder.com/300?text=Recipe" }}
              style={styles.gridItemImage}
              resizeMode="cover"
            />
            <View style={styles.gridItemTitle}>
              <Text style={styles.gridItemTitleText} numberOfLines={1}>
                {item.recipe?.title || "Untitled Recipe"}
              </Text>
            </View>
          </>
        )}
      </View>
      {isExternalPost(item) ? (
        <TouchableOpacity 
          style={styles.singlePane}
          onPress={() => openExternalRecipe(item.link)}
        >
          <Text style={styles.paneText}>Open Recipe</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.dividedContainer}>
          <TouchableOpacity 
            style={styles.leftPane}
            onPress={() => onViewVideo(item)}
          >
            <Text style={styles.paneText}>View Video</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.rightPane}
            onPress={() => onViewRecipe(item)}
          >
            <Text style={styles.paneText}>View Recipe</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default RecipeGridItem;