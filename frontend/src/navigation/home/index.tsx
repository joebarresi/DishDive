import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Feather, Ionicons } from "@expo/vector-icons";
import ProfileScreen from "../../screens/profile";
import SearchScreen from "../../screens/search";
import FeedNavigation from "../feed";
import { useChats } from "../../hooks/useChats";
import { createContext, useState } from "react";
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { APP_COLOR } from "../../styles";
import SavedScreen from "../../screens/saved";

export type HomeStackParamList = {
  Feed: undefined;
  Discover: undefined;
  Recipes: undefined;
  Me: { initialUserId: string };
};

const ICON_SIZE = 20;

export const ActiveTabContext = createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>({
  activeTab: "Recipes",
  setActiveTab: () => {},
});

const Tab = createMaterialBottomTabNavigator<HomeStackParamList>();

const THEME = {
  primary: APP_COLOR, 
  inactive: "#777777", 
};

const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    secondaryContainer: "white",
  },
}

export default function HomeScreen() {
  useChats();
  const [activeTab, setActiveTab] = useState<string>("Recipes");

  return (
    <PaperProvider theme={paperTheme}>
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      <Tab.Navigator
        barStyle={{ 
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#EEEEEE",
          height: 90 // if you change this, change postEhight in feed as well
        }}
        initialRouteName="Recipes"
        activeColor={THEME.primary}
        inactiveColor={THEME.inactive}
        shifting={true}
        labeled={true}
        backBehavior="initialRoute"
        screenListeners={{
          state: (e) => {
            const route = e.data.state.routes[e.data.state.index];
            setActiveTab(route.name);
          },
        }}
      >
        <Tab.Screen
          name="Recipes"
          component={SavedScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Feather name="book-open" size={ICON_SIZE} color={color} />
            ),
            tabBarLabel: "Recipes",
          }}
        />
        <Tab.Screen
          name="Feed"
          component={FeedNavigation}
          options={{
            tabBarIcon: ({ color }) => (
              <Feather name="video" size={ICON_SIZE} color={color} />
            ),
            tabBarLabel: "Feed",
          }}
        />
        <Tab.Screen
          name="Discover"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Feather name="search" size={ICON_SIZE} color={color} />
            ),
            tabBarLabel: "Discover",
          }}
        />
        <Tab.Screen
          name="Me"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Feather name="user" size={ICON_SIZE} color={color} />
            ),
            tabBarLabel: "Profile",
          }}
          initialParams={{ initialUserId: FIREBASE_AUTH.currentUser?.uid ?? "" }}
        />
      </Tab.Navigator>
    </ActiveTabContext.Provider>
    </PaperProvider>
  );
}
