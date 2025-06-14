import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import { RootState } from "../../../redux/store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/main";
import { FIREBASE_AUTH } from "../../../../firebaseConfig";

export default function ProfileNavBar({
  user,
}: {
  user: RootState["auth"]["currentUser"];
}) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const myProfile = user?.uid == FIREBASE_AUTH.currentUser?.uid;

  return (
    user && (
      <View style={styles.container}>
        {!myProfile ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} />
          </TouchableOpacity>
        ) : (
          <View style={{width: 24}} />
        )}
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          {user.displayName || user.email}
        </Text>
        {myProfile ? (
          <TouchableOpacity onPress={() => navigation.navigate("settings")}>
            <Feather name="menu" size={24} />
          </TouchableOpacity>
        ) : (
          <View style={{width: 24}} />
        )}
      </View>
    )
  );
}
