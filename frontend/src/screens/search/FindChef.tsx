import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  ActivityIndicator,
  Image
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebaseConfig";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit 
} from "firebase/firestore";
import styles from "./styles";
import { RootStackParamList } from "../../navigation/main";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ScreenContainer from "../../components/common/ScreenContainer";

interface ChefUser {
  id: string;
  displayName: string;
  photoURL?: string;
  followersCount?: number;
  bio?: string;
}

export default function FindChefScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");
  const [chefs, setChefs] = useState<ChefUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'name' | 'popular'>('name');

  // Search for chefs by display name
  const searchChefsByName = async (namePrefix: string) => {
    if (!namePrefix.trim()) {
      setChefs([]);
      return;
    }

    setLoading(true);
    try {
      const usersRef = collection(FIREBASE_DB, "user");
      const q = query(
        usersRef,
        where("displayName", ">=", namePrefix),
        where("displayName", "<=", namePrefix + "\uf8ff"),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const chefsList: ChefUser[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // Skip the current user
        if (doc.id !== FIREBASE_AUTH.currentUser?.uid) {
          chefsList.push({
            id: doc.id,
            displayName: userData.displayName || "Unknown Chef",
            photoURL: userData.photoURL,
            followersCount: userData.followersCount || 0,
            bio: userData.bio
          });
        }
      });
      
      setChefs(chefsList);
    } catch (error) {
      console.error("Error searching chefs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get most followed chefs
  const getMostFollowedChefs = async () => {
    setLoading(true);
    try {
      const usersRef = collection(FIREBASE_DB, "user");
      const q = query(
        usersRef,
        orderBy("followersCount", "desc"),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const chefsList: ChefUser[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // Skip the current user
        if (doc.id !== FIREBASE_AUTH.currentUser?.uid) {
          chefsList.push({
            id: doc.id,
            displayName: userData.displayName || "Unknown Chef",
            photoURL: userData.photoURL,
            followersCount: userData.followersCount || 0,
            bio: userData.bio
          });
        }
      });
      
      setChefs(chefsList);
    } catch (error) {
      console.error("Error getting most followed chefs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setSearchMode('name');
    searchChefsByName(text);
  };

  // Handle "See Most Followed" button press
  const handleSeePopular = () => {
    if (searchMode === 'popular') {
      setChefs([]);
      setSearchMode('name');
    } else {
      setSearchMode('popular');
      setSearchQuery("");
      getMostFollowedChefs();
    }
  };

  const navigateToProfile = (userId: string) => {
    navigation.navigate('profileOther', { initialUserId: userId });
  };

  // Render each chef item
  const renderChefItem = ({ item }: { item: ChefUser }) => (
    <TouchableOpacity 
      style={styles.chefItem} 
      onPress={() => navigateToProfile(item.id)}
    >
      <Image 
        source={{ uri: item.photoURL }} 
        style={styles.chefAvatar} 
      />
      <View style={styles.chefInfo}>
        <Text style={styles.chefName}>{item.displayName}</Text>
        {item.bio && <Text style={styles.chefBio} numberOfLines={1}>{item.bio}</Text>}
        <Text style={styles.chefFollowers}>
          {item.followersCount || 0} {item.followersCount === 1 ? 'follower' : 'followers'}
        </Text>
      </View>
      <Feather name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  );

  const loadingComponent = (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4ECDC4" />
    </View>
  );

  const emptyComponent = (
    <View style={styles.emptyContainer}>
      <Feather name="users" size={64} color="#4ECDC4" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? "No chefs found" : "Search for chefs"}
      </Text>
      <Text style={styles.emptyDescription}>
        {searchQuery 
          ? "Try a different search term or check out popular chefs" 
          : "Enter a name to find chefs or see the most followed chefs"
        }
      </Text>
    </View>
  );

  return (
    <ScreenContainer
      title="Find a Chef"
      loading={loading && chefs.length === 0}
      loadingComponent={loadingComponent}
      showBackButton
    >
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chefs by name"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Feather name="x" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.popularButton, 
            searchMode === 'popular' && styles.activeButton
          ]} 
          onPress={handleSeePopular}
        >
          <Text style={[
            styles.popularButtonText, 
            searchMode === 'popular' && styles.activeButtonText
          ]}>
            See Most Followed
          </Text>
        </TouchableOpacity>
      </View>
      
      {chefs.length > 0 ? (
        <FlatList
          data={chefs}
          renderItem={renderChefItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chefList}
        />
      ) : !loading && emptyComponent}
    </ScreenContainer>
  );
}
