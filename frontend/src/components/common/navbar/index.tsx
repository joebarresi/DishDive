import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface NavBarGeneralProps {
  title?: string;
  leftButton?: {
    display: boolean;
    name?: keyof typeof Feather.glyphMap;
    color?: string;
    action?: () => void;
  };
  rightButton?: {
    display: boolean;
    name?: keyof typeof Feather.glyphMap;
    action?: () => void;
    color?: string;
  };
}

export default function NavBarGeneral({
  title = "NavBarGeneral",
  leftButton = { display: true },
  rightButton = { display: false },
}: NavBarGeneralProps) {
  const navigation = useNavigation();

  const handleLeftButtonPress = () => {
    if (!leftButton.display) return;
    
    if (leftButton.action) {
      leftButton.action();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLeftButtonPress}
      >
        {leftButton.display && (
          <Feather 
            name={leftButton.name || "arrow-left"} 
            size={26} 
            color={leftButton.color || "black"} 
          />
        )}
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          rightButton.display && rightButton.action
            ? rightButton.action()
            : null
        }
      >
        {rightButton.display && (
          <Feather name={rightButton.name} size={26} color={rightButton.color || "black"} />
        )}
      </TouchableOpacity>
    </View>
  );
}
