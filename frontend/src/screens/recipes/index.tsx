import { Text } from "react-native";
import React from "react";
import NavBarGeneral from "../../components/general/navbar";
import { SafeAreaView } from "react-native-safe-area-context";

const RecipesScreen = () => {
  return (
    <SafeAreaView>
      <NavBarGeneral leftButton={{ display: false }} title="My Recipes" />
      <Text style={{ padding: 20, textAlign: 'center' }}>
        Recipes screen coming soon!
      </Text>
    </SafeAreaView>
  );
};

export default RecipesScreen;
