import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/main";
import styles from "./styles";

type DiscoverNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const navigation = useNavigation<DiscoverNavigationProp>();

  const navigateToScreen = (screenName: string) => {
    switch(screenName) {
      case 'Ask AI':
        navigation.navigate('askAI');
        break;
      case 'Find a Chef':
        navigation.navigate('findChef');
        break;
      case 'Search by Diet':
        navigation.navigate('searchDiet');
        break;
      case 'What I Have at Home':
        navigation.navigate('whatIHave');
        break;
      default:
        // Fallback
        navigation.navigate('home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Discover</Text>
      
      <View style={styles.gridContainer}>
        {/* Top Row */}
        <View style={styles.row}>
          {/* Ask AI */}
          <TouchableOpacity 
            style={[styles.gridItem, styles.askAI]} 
            onPress={() => navigateToScreen('Ask AI')}
          >
            <Feather name="message-circle" size={32} color="white" />
            <Text style={styles.gridItemText}>Ask AI</Text>
          </TouchableOpacity>
          
          {/* Find a Chef */}
          <TouchableOpacity 
            style={[styles.gridItem, styles.findChef]} 
            onPress={() => navigateToScreen('Find a Chef')}
          >
            <Feather name="user" size={32} color="white" />
            <Text style={styles.gridItemText}>Find a Chef</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bottom Row */}
        <View style={styles.row}>
          {/* Search by Diet */}
          <TouchableOpacity 
            style={[styles.gridItem, styles.searchDiet]} 
            onPress={() => navigateToScreen('Search by Diet')}
          >
            <Feather name="heart" size={32} color="white" />
            <Text style={styles.gridItemText}>Search by Diet</Text>
          </TouchableOpacity>
          
          {/* What I Have at Home */}
          <TouchableOpacity 
            style={[styles.gridItem, styles.whatIHave]} 
            onPress={() => navigateToScreen('What I Have at Home')}
          >
            <Feather name="shopping-bag" size={32} color="white" />
            <Text style={styles.gridItemText}>What I Have at Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
