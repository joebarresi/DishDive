import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

export default function AskAIScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ask AI</Text>
      </View>
      
      <View style={styles.content}>
        <Feather name="message-circle" size={64} color="#FF6B6B" />
        <Text style={styles.detailTitle}>Ask AI for Recipe Ideas</Text>
        <Text style={styles.description}>
          Ask our AI assistant for recipe suggestions, cooking tips, or meal planning ideas.
        </Text>
        <Text style={styles.placeholder}>
          Coming soon! This feature is currently under development.
        </Text>
      </View>
    </SafeAreaView>
  );
}
