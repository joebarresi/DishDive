import { Dispatch, SetStateAction, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import { useDispatch } from "react-redux";
import { register } from "../../../redux/slices/authSlice";
import { AppDispatch } from "../../../redux/store";

export interface SignUpProps {
  setAuthPage: Dispatch<SetStateAction<0 | 1>>;
  setMenuMessage: Dispatch<SetStateAction<string>>;
  setDetailsPage: Dispatch<SetStateAction<boolean>>;
}

/**
 * Function that renders a component for the sign up form.
 *
 * @param props passed to component
 * @param props.setAuthPage setter for the authPage var (0 or 1)
 * @param props.setMenuMessage setter for the menu message
 * @param props.setDetailsPage setter for the variable that chooses
 * the type of page, if true show AuthMenu else show SignUp
 * @returns Component
 */
export default function SignUp({
  setAuthPage,
  setMenuMessage,
  setDetailsPage,
}: SignUpProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch: AppDispatch = useDispatch();

  const handleRegister = () => {
    setErrorMessage("");
    if (!email || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    // We're now passing an empty string for username since it will be set in the onboarding screen
    dispatch(register({ email, password, username: "" }))
      .unwrap()
      .then(() => {
        console.log("register successful");
        // We don't need to do anything here as the navigation will handle redirecting to onboarding
      })
      .catch((error) => {
        console.log("register unsuccessful", error);
        if (error.message.includes("email-already-in-use")) {
          setErrorMessage("Email is already in use. Try signing in instead.");
        } else if (error.message.includes("invalid-email")) {
          setErrorMessage("Please enter a valid email address.");
        } else if (error.message.includes("network-request-failed")) {
          setErrorMessage("Network error. Please check your connection.");
        } else {
          setErrorMessage("Failed to create account. Please try again.");
        }
      });
  };

  const togglePasswordVisibility = () => {
    setShowPasswords(!showPasswords);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setDetailsPage(false)}>
        <Feather name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.headerText}>Create Account</Text>
      
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      
      <TextInput
        onChangeText={(text) => setEmail(text)}
        style={styles.textInput}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          style={styles.passwordInput}
          secureTextEntry={!showPasswords}
          placeholder="Password"
          value={password}
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={togglePasswordVisibility}
        >
          <Feather 
            name={showPasswords ? "eye-off" : "eye"} 
            size={20} 
            color="gray" 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.passwordContainer}>
        <TextInput
          onChangeText={(text) => setConfirmPassword(text)}
          style={styles.passwordInput}
          secureTextEntry={!showPasswords}
          placeholder="Confirm Password"
          value={confirmPassword}
        />
        {/* No eye icon needed here since we're using a single toggle for both fields */}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
