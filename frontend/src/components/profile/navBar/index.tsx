import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import { RootState } from "../../../redux/store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/main";
import { FIREBASE_AUTH } from "../../../../firebaseConfig";
import NavBarGeneral from "../../common/navbar";

export default function ProfileNavBar({
  user,
}: {
  user: RootState["auth"]["currentUser"];
}) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const myProfile = user?.uid == FIREBASE_AUTH.currentUser?.uid;

  return (
    user && (
      <NavBarGeneral
        title={user.displayName ?? "Profile"}
        leftButton={{
          display: !myProfile
        }}
        rightButton={{
          display: myProfile,
          name: "menu",
          action: () => navigation.navigate("settings"),
          color: "black"
        }}
      >
      </NavBarGeneral>
    )
  );
}
