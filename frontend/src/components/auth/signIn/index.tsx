import { Dispatch, SetStateAction, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import { useDispatch } from "react-redux";
import { login } from "../../../redux/slices/authSlice";
import { AppDispatch } from "../../../redux/store";

export interface SignInProps {
  setDetailsPage: Dispatch<SetStateAction<boolean>>;
}

/**
 * Function that renders a component for the sign in form.
 *
 * @param props passed to component
 * @param props.setDetailsPage setter for the variable that chooses
 * the type of page, if true show AuthMenu else show SignIn
 * @returns Component
 */
export default function SignIn({
  setDetailsPage,
}: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setDetailsPage(false)}>
        <Feather name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.headerText}>Sign In</Text>
      
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
          secureTextEntry={!showPassword}
          placeholder="Password"
          value={password}
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={togglePasswordVisibility}
        >
          <Feather 
            name={showPassword ? "eye-off" : "eye"} 
            size={20} 
            color="gray" 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
