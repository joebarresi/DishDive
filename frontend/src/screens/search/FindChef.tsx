import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

export default function FindChefScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find a Chef</Text>
      </View>
      
      <View style={styles.content}>
        <Feather name="user" size={64} color="#4ECDC4" />
        <Text style={styles.detailTitle}>Discover Amazing Chefs</Text>
        <Text style={styles.description}>
          Find talented chefs and creators who share delicious recipes and cooking techniques.
        </Text>
        <Text style={styles.placeholder}>
          Coming soon! This feature is currently under development.
        </Text>
      </View>
    </SafeAreaView>
  );
}
