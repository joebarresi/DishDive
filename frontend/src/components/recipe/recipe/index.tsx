import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Post } from "../../../../types";

interface RecipeViewProps {
  post: Post;
}

const RecipeView: React.FC<RecipeViewProps> = ({ post }) => {
  if (!post.recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{"No recipe available"}</Text>
      </View>
    );
  }

  const recipe = post.recipe;

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{recipe.title}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.sectionContent}>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.ingredient}>{ingredient}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Instructions</Text>
        <View style={styles.sectionContent}>
          {recipe.steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.step}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#8B54FB",
  },
  sectionContent: {
    marginLeft: 5,
  },
  ingredientRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  bulletPoint: {
    fontSize: 18,
    color: "#8B54FB",
    marginRight: 8,
    lineHeight: 24,
  },
  ingredient: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    lineHeight: 24,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#8B54FB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  step: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#red",
    textAlign: "center",
  },
});

export default RecipeView;
