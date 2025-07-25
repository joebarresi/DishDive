import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/main";
import { APP_COLOR } from "../../styles";
import styles from "./styles";
import ScreenContainer from "../../components/common/ScreenContainer";

type DiscoverNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const navigation = useNavigation<DiscoverNavigationProp>();

  const navigateToScreen = (screenName: string) => {
    switch(screenName) {
      case 'Search by Recipe':
        navigation.navigate('searchRecipe'); // You'll need to add this route to your navigation
        break;
      case 'Find a Chef':
        navigation.navigate('findChef');
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
    <ScreenContainer
      title="Discover"
    >
      <View style={styles.gridContainer}>
        {/* Top Half - Search by Recipe */}
        <View style={[styles.row, { flex: 2 }]}>
          <TouchableOpacity 
            style={[styles.gridItem, styles.searchRecipe]} 
            onPress={() => navigateToScreen('Search by Recipe')}
          >
            <Feather name="search" size={40} color="white" />
            <Text style={[styles.gridItemText, styles.searchRecipeText]}>Search by Recipe</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bottom Row */}
        <View style={styles.row}>
          {/* Find a Chef */}
          <TouchableOpacity 
            style={[styles.gridItem, styles.findChef]} 
            onPress={() => navigateToScreen('Find a Chef')}
          >
            <Feather name="user" size={32} color={APP_COLOR} />
            <Text style={styles.gridItemText}>Find a Chef</Text>
          </TouchableOpacity>
          
          {/* What I Have at Home */}
          <TouchableOpacity 
            style={[styles.gridItem, styles.whatIHave]} 
            onPress={() => navigateToScreen('What I Have at Home')}
          >
            <Feather name="shopping-bag" size={32} color={APP_COLOR} />
            <Text style={styles.gridItemText}>What I Have at Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
