import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/main';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BackButtonProps {
  color?: string;
  size?: number;
  style?: object;
  onPress?: () => void;
}

/**
 * A reusable back button component that can be used across the app
 * 
 * @param color - The color of the back icon (default: white)
 * @param size - The size of the back icon (default: 28)
 * @param style - Additional styles to apply to the button container
 * @param onPress - Custom onPress handler (defaults to navigation.goBack)
 */
const BackButton: React.FC<BackButtonProps> = ({
  color = 'white',
  size = 28,
  style,
  onPress,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.backButton,
        { top: insets.top + 10 },
        style
      ]}
      onPress={handlePress}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
    >
      <Ionicons name="chevron-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: 10,
    zIndex: 9999,
    padding: 8,
  },
});

export default BackButton;
