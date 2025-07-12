import React, { ReactNode } from "react";
import { ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBarGeneral from "../../common/navbar";
import styles from "./styles";

interface ScreenContainerProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  rightButton?: {
    display: boolean;
    name?: string;
    action?: () => void;
    color?: string;
  };
  style?: ViewStyle;
  loading?: boolean;
  loadingComponent?: ReactNode;
}

/**
 * A reusable screen container component that provides consistent layout and styling
 * for all screens in the app, including a navigation bar and safe area handling.
 */
const ScreenContainer = ({
  children,
  title = "",
  showBackButton = false,
  rightButton = { display: false },
  style,
  loading = false,
  loadingComponent,
}: ScreenContainerProps) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <NavBarGeneral 
        title={title} 
        leftButton={{ display: showBackButton }}
        rightButton={rightButton}
      />
      
      <SafeAreaView style={[styles.contentContainer, style]} edges={['bottom', 'left', 'right']}>
        {loading && loadingComponent ? loadingComponent : children}
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default ScreenContainer;
