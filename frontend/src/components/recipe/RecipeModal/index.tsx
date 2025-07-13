import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Keyboard
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_COLOR } from '../../../styles';
import NavBarGeneral from '../../common/navbar';
import { useDispatch, useSelector } from 'react-redux';
import { addExternalPost } from '../../../redux/slices/postSlice';
import { AppDispatch, RootState } from '../../../redux/store';

interface RecipeModalProps {
  visible: boolean;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get loading state from Redux store
  const loading = useSelector((state: RootState) => state.post.loading);
  
  // Form state
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [formErrors, setFormErrors] = useState({
    title: '',
    link: ''
  });
  
  // Calculate bottom padding to account for the tab bar height
  const tabBarHeight = 49 + insets.bottom;
  
  // Reset form when modal is closed
  const handleClose = () => {
    if (!loading) {
      setTitle('');
      setLink('');
      setFormErrors({
        title: '',
        link: ''
      });
      onClose();
    }
  };
  
  // Validate form fields
  const validateForm = (): boolean => {
    let isValid = true;
    const errors = {
      title: '',
      link: ''
    };
    
    // Validate title
    if (!title.trim()) {
      errors.title = 'Recipe title is required';
      isValid = false;
    }
    
    // Validate link
    if (!link.trim()) {
      errors.link = 'Recipe link is required';
      isValid = false;
    } else if (!isValidUrl(link)) {
      errors.link = 'Please enter a valid URL';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  // Check if string is a valid URL
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await dispatch(addExternalPost({
        title: title.trim(),
        link: link.trim()
      })).unwrap();
      
      // Success
      Alert.alert(
        "Success",
        "External recipe added successfully!",
        [{ text: "OK", onPress: handleClose }]
      );
    } catch (error) {
      // Error
      Alert.alert(
        "Error",
        "Failed to add external recipe. Please try again.",
        [{ text: "OK" }]
      );
    }
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.dismissArea} 
          activeOpacity={1} 
          onPress={handleClose}
          disabled={loading}
        />
        
        <View style={[styles.modalContent, { paddingBottom: tabBarHeight }]}>
          <View style={styles.handleBar} />
          
          <NavBarGeneral
            title="Add External Recipe"
            leftButton={{
              display: true,
              name: "x",
              color: "#333",
              action: handleClose
            }}
          />
          
          <View style={styles.modalBody}>
            <Text style={styles.modalText}>
              Add a link to an external recipe you'd like to save.
            </Text>
            
            {/* Recipe Title Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Recipe Title</Text>
              <TextInput
                style={[
                  styles.textInput,
                  formErrors.title ? styles.inputError : null
                ]}
                placeholder="Enter recipe title"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                editable={!loading}
                testID="recipe-title-input"
              />
              {formErrors.title ? (
                <Text style={styles.errorText}>{formErrors.title}</Text>
              ) : null}
            </View>
            
            {/* Recipe Link Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Recipe Link</Text>
              <TextInput
                style={[
                  styles.textInput,
                  formErrors.link ? styles.inputError : null
                ]}
                placeholder="https://example.com/recipe"
                placeholderTextColor="#999"
                value={link}
                onChangeText={setLink}
                autoCapitalize="none"
                keyboardType="url"
                editable={!loading}
                testID="recipe-link-input"
              />
              {formErrors.link ? (
                <Text style={styles.errorText}>{formErrors.link}</Text>
              ) : null}
            </View>
            
            {/* Submit Button */}
            <TouchableOpacity 
              style={[
                styles.submitButton,
                loading ? styles.submitButtonDisabled : null
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Add Recipe</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Removed maxHeight and minHeight to let content determine size
    paddingBottom: 20, // Added padding at the bottom
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  modalBody: {
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%', // Ensure full width
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    width: '100%', // Ensure full width
  },
  inputError: {
    borderColor: '#ff4040',
  },
  errorText: {
    color: '#ff4040',
    fontSize: 14,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: APP_COLOR,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20, // Increased from 10 to 20
    width: '100%', // Ensure full width
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecipeModal;
