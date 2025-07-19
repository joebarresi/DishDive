import { Dispatch, SetStateAction, createContext, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import HomeFeed from "../../screens/homeFeed";
import ProfileScreen from "../../screens/profile";
import FeedMisc from "../../screens/feedMisc";

export type FeedType = "Following" | "My Feed" | "Trending";

export type FeedStackParamList = {
  homeFeed: {
    creator: string;
    feedType: FeedType;
  };
  feedProfile: { initialUserId: string };
  feedMisc: {},
};

// Contexts
interface CurrentUserProfileItemInViewContextType {
  currentUserProfileItemInView: string | null;
  setCurrentUserProfileItemInView: Dispatch<SetStateAction<string | null>>;
}

interface ActiveFeedContextType {
  activeFeedType: FeedType;
  setActiveFeedType: Dispatch<SetStateAction<FeedType>>;
}

const { Screen, Navigator } =
  createMaterialTopTabNavigator<FeedStackParamList>();

export const CurrentUserProfileItemInViewContext =
  createContext<CurrentUserProfileItemInViewContextType>({
    currentUserProfileItemInView: null,
    setCurrentUserProfileItemInView: () => {},
  });

export const ActiveFeedContext = createContext<ActiveFeedContextType>({
  activeFeedType: "My Feed",
  setActiveFeedType: () => {},
});


const FeedNavigation = () => {
  const [currentUserProfileItemInView, setCurrentUserProfileItemInView] =
    useState<string | null>(null);
  const [activeFeedType, setActiveFeedType] = useState<FeedType>("My Feed");

  const TopNav = ({ state, navigation }: any) => {
    return (
      <View style={styles.tabBarContainer}>
        {state.routes.map((route: any, index: number) => {
          if (route.name !== "homeFeed") return null;
          const tabOptions: FeedType[] = ["Following", "My Feed", "Trending"];
          
          return (
            <View key={index} style={styles.tabsRow}>
              {tabOptions.map((tabType) => {
                const isFocused = tabType === activeFeedType;
                
                const onPress = () => {
                  if (tabType !== activeFeedType) {
                    setActiveFeedType(tabType);
                    navigation.navigate({
                      name: route.name,
                      params: { ...route.params, feedType: tabType },
                      merge: true,
                    });
                  }
                };
                
                return (
                  <Text
                    key={tabType}
                    style={[
                      styles.tabText,
                      isFocused ? styles.activeTab : styles.inactiveTab,
                    ]}
                    onPress={onPress}
                  >
                    {tabType}
                  </Text>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ActiveFeedContext.Provider value={{ activeFeedType, setActiveFeedType }}>
      <CurrentUserProfileItemInViewContext.Provider
        value={{
          currentUserProfileItemInView,
          setCurrentUserProfileItemInView,
        }}
      >
        <Navigator 
          initialRouteName="homeFeed" 
          tabBar={(props) => <TopNav {...props} />}
          screenOptions={{
            tabBarStyle: { position: 'absolute', top: 0 },
            tabBarIndicatorStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Screen
            name="homeFeed"
            component={HomeFeed}
            initialParams={{ feedType: activeFeedType }}
          />
          <Screen
            name="feedProfile"
            component={ProfileScreen}
            initialParams={{ initialUserId: "" }}
          />
          <Screen
            name="feedMisc"
            component={FeedMisc}
            initialParams={{}}
          />
        </Navigator>
      </CurrentUserProfileItemInViewContext.Provider>
    </ActiveFeedContext.Provider>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  activeTab: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    borderBottomWidth: 2,
    borderBottomColor: '#FFFFFF',
  },
  inactiveTab: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default FeedNavigation;
