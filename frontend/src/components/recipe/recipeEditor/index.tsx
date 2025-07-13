import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Recipe } from "../../../../types";

interface RecipeEditorProps {
  initialRecipe: Recipe | null;
  onRecipeChange: (recipe: Recipe) => void;
}

const RecipeEditor: React.FC<RecipeEditorProps> = ({ initialRecipe, onRecipeChange }) => {
  // Initialize with empty recipe if none provided
  const [title, setTitle] = useState(initialRecipe?.title || "Recipe Title");
  const [ingredients, setIngredients] = useState(initialRecipe?.ingredients || [""]);
  const [steps, setSteps] = useState(initialRecipe?.steps || [""]);

  // Update parent component when recipe changes
  useEffect(() => {
    onRecipeChange({
      title,
      ingredients: ingredients.filter(ingredient => ingredient.trim() !== ""),
      steps: steps.filter(step => step.trim() !== "")
    });
  }, [title, ingredients, steps]);

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length <= 1) {
      // Keep at least one ingredient field
      setIngredients([""]);
      return;
    }
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) {
      // Keep at least one step field
      setSteps([""]);
      return;
    }
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Recipe Details</Text>
      
      {/* Title input */}
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Recipe Title"
        placeholderTextColor="#999"
      />
      
      {/* Ingredients section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={addIngredient}
        >
          <Ionicons name="add-circle" size={24} color="#8B54FB" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.scrollableContainer}>
        <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
          {ingredients.map((ingredient, index) => (
            <View key={`ingredient-${index}`} style={styles.inputRow}>
              <Text style={styles.bulletPoint}>•</Text>
              <TextInput
                style={styles.ingredientInput}
                value={ingredient}
                onChangeText={(value) => updateIngredient(index, value)}
                placeholder="Enter ingredient"
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => removeIngredient(index)}>
                <Ionicons name="remove-circle" size={24} color="#8B54FB" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      
      {/* Steps section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={addStep}
        >
          <Ionicons name="add-circle" size={24} color="#8B54FB" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.scrollableContainer}>
        <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
          {steps.map((step, index) => (
            <View key={`step-${index}`} style={styles.stepContainer}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <TextInput
                style={styles.stepInput}
                value={step}
                onChangeText={(value) => updateStep(index, value)}
                placeholder="Enter instruction step"
                placeholderTextColor="#999"
                multiline
              />
              <TouchableOpacity onPress={() => removeStep(index)}>
                <Ionicons name="remove-circle" size={24} color="#8B54FB" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 10,
    padding: 0,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B54FB",
  },
  addButton: {
    padding: 4,
  },
  scrollableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    height: 150,
    marginBottom: 20,
  },
  scrollView: {
    padding: 10,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  bulletPoint: {
    fontSize: 18,
    color: "#8B54FB",
    marginRight: 8,
    lineHeight: 24,
  },
  ingredientInput: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#8B54FB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumber: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepInput: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingHorizontal: 8,
    minHeight: 40,
  },
});

export default RecipeEditor;
