import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, StatusBar, Modal } from "react-native";
import { Post } from "../../../types";
import { APP_COLOR } from "../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RecipeFullScreenProps {
  post: Post;
  visible: boolean;
  onClose: () => void;
}

const RecipeFullScreen: React.FC<RecipeFullScreenProps> = ({ post, visible, onClose }) => {
  const { recipe } = post;
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('ingredients');

  if (!recipe) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.container}>
          <Text>No recipe data available</Text>
        </View>
      </Modal>
    );
  }

  // Double tap detection
  let timer: NodeJS.Timeout | undefined = undefined;
  const TIMEOUT = 500;
  const debounce = ({ onSingle, onDouble }: { onSingle: () => void, onDouble: () => void }) => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
      onDouble();
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
        onSingle();
      }, TIMEOUT);
    }
  };

  const handleBackgroundPress = () => {
    debounce({
      onSingle: () => {
        // Do nothing on single tap
      },
      onDouble: () => {
        onClose();
      }
    });
  };

  const renderIngredients = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={true}
      bounces={true}
      scrollEventThrottle={16}
    >
      {recipe.ingredients.map((item, index) => (
        <View key={`ingredient-${index}`} style={styles.ingredientItem}>
          <View style={styles.bullet} />
          <Text style={styles.ingredientText}>{item}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderSteps = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={true}
      bounces={true}
      scrollEventThrottle={16}
    >
      {recipe.steps.map((item, index) => (
        <View key={`step-${index}`} style={[styles.stepItem, index > 0 && { marginTop: 20 }]}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.stepText}>{item}</Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={[styles.statusBarArea, { height: insets.top }]} />
        <TouchableOpacity 
          style={styles.header} 
          activeOpacity={1} 
          onPress={handleBackgroundPress}
        >
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.subtitle}>Double tap here to close</Text>
        </TouchableOpacity>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ingredients' && styles.activeTab]}
            onPress={() => setActiveTab('ingredients')}
          >
            <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>
              Ingredients
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'steps' && styles.activeTab]}
            onPress={() => setActiveTab('steps')}
          >
            <Text style={[styles.tabText, activeTab === 'steps' && styles.activeTabText]}>
              Steps
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area - removed TouchableOpacity wrapper */}
        <View style={styles.contentArea}>
          {activeTab === 'ingredients' ? renderIngredients() : renderSteps()}
        </View>

        {/* Invisible overlay for double tap detection on empty areas */}
        <TouchableOpacity 
          style={styles.backgroundOverlay} 
          activeOpacity={1} 
          onPress={handleBackgroundPress}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  statusBarArea: {
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: APP_COLOR,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: APP_COLOR,
    fontWeight: '600',
  },
  contentArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: APP_COLOR,
    marginRight: 16,
  },
  ingredientText: {
    fontSize: 16,
    color: '#34495e',
    flex: 1,
    lineHeight: 22,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: APP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  stepText: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
    lineHeight: 24,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
});

export default RecipeFullScreen;
