import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

export default function SearchDietScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search by Diet</Text>
      </View>
      
      <View style={styles.content}>
        <Feather name="heart" size={64} color="#FFD166" />
        <Text style={styles.detailTitle}>Find Recipes for Your Diet</Text>
        <Text style={styles.description}>
          Discover recipes that match your dietary preferences and restrictions, including vegetarian, vegan, keto, gluten-free, and more.
        </Text>
        <Text style={styles.placeholder}>
          Coming soon! This feature is currently under development.
        </Text>
      </View>
    </SafeAreaView>
  );
}
