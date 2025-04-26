import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebaseConfig";
import { Post, Recipe } from "../../../../types";


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
        
        <Text style={styles.sectionTitle}>Ingredients:</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>
            • {ingredient}
          </Text>
        ))}
        
        <Text style={styles.sectionTitle}>Instructions:</Text>
        {recipe.steps.map((step, index) => (
          <Text key={index} style={styles.step}>
            {index + 1}. {step}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    padding: 16,
    backgroundColor: "#000",
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#FF4D67",
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 4,
    color: "#fff",
  },
  step: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
    color: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "#FF4D67",
    textAlign: "center",
  },
});

export default RecipeView;
