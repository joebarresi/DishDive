import { useState } from "react";
import { View } from "react-native";
import SignIn from "../../components/auth/signIn";
import SignUp from "../../components/auth/signUp";
import AuthMenu from "../../components/auth/menu";
import styles from "./styles";

/**
 * Function that renders a component responsible for being the
 * authentication screen. This is simply a placeholder for
 * the components that actually contains functionalities
 * @returns Component
 */
export default function AuthScreen() {
  const [authPage, setAuthPage] = useState<0 | 1>(0);
  const [detailsPage, setDetailsPage] = useState(false);
  const [menuMessage, setMenuMessage] = useState("");

  return (
    <View style={styles.container}>
      {detailsPage ? (
        authPage === 0 ? (
          <SignIn
            setDetailsPage={setDetailsPage}
          />
        ) : (
          <SignUp
            setAuthPage={setAuthPage}
            setMenuMessage={setMenuMessage}
            setDetailsPage={setDetailsPage}
          />
        )
      ) : (
        <AuthMenu
          authPage={authPage}
          menuMessage={menuMessage}
          setAuthPage={setAuthPage}
          setDetailsPage={setDetailsPage}
        />
      )}
    </View>
  );
}
