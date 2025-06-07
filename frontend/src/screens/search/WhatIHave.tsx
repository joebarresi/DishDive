import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

export default function WhatIHaveScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>What I Have at Home</Text>
      </View>
      
      <View style={styles.content}>
        <Feather name="shopping-bag" size={64} color="#6B5B95" />
        <Text style={styles.detailTitle}>Cook with What You Have</Text>
        <Text style={styles.description}>
          Enter ingredients you already have at home, and we'll suggest recipes you can make without a trip to the store.
        </Text>
        <Text style={styles.placeholder}>
          Coming soon! This feature is currently under development.
        </Text>
      </View>
    </SafeAreaView>
  );
}
