import { Dispatch, SetStateAction, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import { useDispatch } from "react-redux";
import { login, register } from "../../../redux/slices/authSlice";
import { AppDispatch } from "../../../redux/store";

export interface AuthDetailsProps {
  authPage: 0 | 1;
  setAuthPage: Dispatch<SetStateAction<0 | 1>>;
  setMenuMessage: Dispatch<SetStateAction<string>>;
  setDetailsPage: Dispatch<SetStateAction<boolean>>;
}

/**
 * Function that renders a component that renders a signin/signup
 * form.
 *
 * @param props passed to component
 * @param props.authPage if 0 it is in the signin state
 * if 1 is in the signup state
 * @param props.setDetailsPage setter for the variable that chooses
 * the type of page, if true show AuthMenu else show AuthDetails
 * @returns Component
 */
export default function AuthDetails({
  authPage,
  setAuthPage,
  setMenuMessage,
  setDetailsPage,
}: AuthDetailsProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch: AppDispatch = useDispatch();

  const handleLogin = () => {
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    dispatch(login({ email, password }))
      .unwrap()
      .then(() => console.log("login successful"))
      .catch((error) => {
        console.log("login unsuccessful", error);
        if (error.message.includes("user-not-found") || error.message.includes("wrong-password")) {
          setErrorMessage("Invalid email or password. Please try again.");
        } else if (error.message.includes("too-many-requests")) {
          setErrorMessage("Too many failed attempts. Please try again later.");
        } else if (error.message.includes("network-request-failed")) {
          setErrorMessage("Network error. Please check your connection.");
        } else {
          setErrorMessage("Failed to sign in. Please try again.");
        }
      });
  };

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

    dispatch(register({ email, password }))
      .unwrap()
      .then(() => {
        console.log("register successful");
        setDetailsPage(false);
        setAuthPage(1);
        setMenuMessage("Account created successfully! Please sign in.");
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
      
      <Text style={styles.headerText}>
        {authPage === 0 ? "Sign In" : "Create Account"}
      </Text>
      
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
      
      {authPage === 1 && (
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
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => (authPage === 0 ? handleLogin() : handleRegister())}
      >
        <Text style={styles.buttonText}>
          {authPage === 0 ? "Sign In" : "Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
