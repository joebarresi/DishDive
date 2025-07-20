import React from "react";
import { View, Text } from "react-native";
import { CuisineTags, DietTags } from "../../../../types";
import styles from "./styles";

// Emoji and color mapping for dietary restrictions
const DIET_TAG_CONFIG: Record<DietTags, { emoji: string; color: string }> = {
  [DietTags.DASH]: { emoji: "🥗", color: "#4CAF50" }, // Green
  [DietTags.Vegetarian]: { emoji: "🥬", color: "#8BC34A" }, // Light Green
  [DietTags.Vegan]: { emoji: "🌱", color: "#4CAF50" }, // Green
  [DietTags.Pescatarian]: { emoji: "🐟", color: "#03A9F4" }, // Light Blue
  [DietTags.Ketogenic]: { emoji: "🥑", color: "#FF9800" }, // Orange
  [DietTags.LowCarb]: { emoji: "🍖", color: "#FF5722" }, // Deep Orange
  [DietTags.Atkins]: { emoji: "🥩", color: "#F44336" }, // Red
  [DietTags.GlutenFree]: { emoji: "🌾", color: "#FFEB3B" }, // Yellow
  [DietTags.DairyFree]: { emoji: "🥛", color: "#E91E63" }, // Pink
  [DietTags.NutFree]: { emoji: "🥜", color: "#795548" }, // Brown
  [DietTags.LowFODMAP]: { emoji: "🍽️", color: "#9C27B0" }, // Purple
  [DietTags.Paleo]: { emoji: "🦴", color: "#FF5722" }, // Deep Orange
  [DietTags.Carnivore]: { emoji: "🥩", color: "#F44336" }, // Red
  [DietTags.LowSugar]: { emoji: "🍬", color: "#2196F3" }, // Blue
  [DietTags.Kosher]: { emoji: "✡️", color: "#3F51B5" }, // Indigo
  [DietTags.Halal]: { emoji: "☪️", color: "#009688" }, // Teal
};

// Emoji mapping for cuisine tags
const CUISINE_TAG_CONFIG: Record<CuisineTags, { emoji: string; color: string }> = {
  [CuisineTags.Mexican]: { emoji: "🌮", color: "#E53935" }, // Red
  [CuisineTags.Italian]: { emoji: "🍝", color: "#4CAF50" }, // Green
  [CuisineTags.Chinese]: { emoji: "🥢", color: "#F44336" }, // Red
  [CuisineTags.Indian]: { emoji: "🍛", color: "#FF9800" }, // Orange
  [CuisineTags.Japanese]: { emoji: "🍱", color: "#E91E63" }, // Pink
  [CuisineTags.French]: { emoji: "🥐", color: "#3F51B5" }, // Indigo
  [CuisineTags.Thai]: { emoji: "🍲", color: "#9C27B0" }, // Purple
  [CuisineTags.Mediterranean]: { emoji: "🫒", color: "#009688" }, // Teal
  [CuisineTags.Korean]: { emoji: "🍚", color: "#F44336" }, // Red
  [CuisineTags.Vietnamese]: { emoji: "🍜", color: "#FF5722" }, // Deep Orange
  [CuisineTags.Greek]: { emoji: "🥙", color: "#2196F3" }, // Blue
  [CuisineTags.Spanish]: { emoji: "🥘", color: "#FFC107" }, // Amber
  [CuisineTags.German]: { emoji: "🥨", color: "#795548" }, // Brown
  [CuisineTags.Brazilian]: { emoji: "🍖", color: "#4CAF50" }, // Green
  [CuisineTags.Ethiopian]: { emoji: "🍲", color: "#FF9800" }, // Orange
  [CuisineTags.Caribbean]: { emoji: "🍹", color: "#03A9F4" }, // Light Blue
  [CuisineTags.TexMex]: { emoji: "🌶️", color: "#E53935" }, // Red
  [CuisineTags.SoulFood]: { emoji: "🍗", color: "#795548" }, // Brown
  [CuisineTags.Cajun]: { emoji: "🦐", color: "#FF5722" }, // Deep Orange
  [CuisineTags.Creole]: { emoji: "🍲", color: "#FF9800" }, // Orange
  [CuisineTags.Sushi]: { emoji: "🍣", color: "#E91E63" }, // Pink
  [CuisineTags.Ramen]: { emoji: "🍜", color: "#FF9800" }, // Orange
  [CuisineTags.Tapas]: { emoji: "🧆", color: "#FFC107" }, // Amber
  [CuisineTags.BBQ]: { emoji: "🍖", color: "#795548" }, // Brown
  [CuisineTags.Seafood]: { emoji: "🦞", color: "#03A9F4" }, // Light Blue
  [CuisineTags.Fusion]: { emoji: "🍽️", color: "#9C27B0" }, // Purple
};

interface TagsDisplayProps {
  cuisineTags?: CuisineTags[];
  dietTags?: DietTags[];
}

const TagsDisplay: React.FC<TagsDisplayProps> = ({ cuisineTags, dietTags }) => {
  if ((!cuisineTags || cuisineTags.length === 0) && (!dietTags || dietTags.length === 0)) {
    return null;
  }

  // Combine all tags into a single array, limiting to 6 total tags (2 rows of 3)
  const allTags: Array<{ tag: string; emoji: string; color: string }> = [];
  
  // Add cuisine tags first
  if (cuisineTags && cuisineTags.length > 0) {
    cuisineTags.forEach(tag => {
      if (allTags.length < 6) {
        allTags.push({
          tag,
          emoji: CUISINE_TAG_CONFIG[tag]?.emoji || "🍽️",
          color: CUISINE_TAG_CONFIG[tag]?.color || "#333"
        });
      }
    });
  }
  
  // Then add diet tags
  if (dietTags && dietTags.length > 0) {
    dietTags.forEach(tag => {
      if (allTags.length < 6) {
        allTags.push({
          tag,
          emoji: DIET_TAG_CONFIG[tag]?.emoji || "🍽️",
          color: DIET_TAG_CONFIG[tag]?.color || "#333"
        });
      }
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.tagsRow}>
        {allTags.map((item, index) => (
          <View 
            key={`tag-${index}`} 
            style={[
              styles.tagContainer, 
              { backgroundColor: item.color }
            ]}
          >
            <Text style={styles.tagText}>
              {item.emoji} {item.tag}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TagsDisplay;
