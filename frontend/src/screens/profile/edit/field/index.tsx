import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBarGeneral from "../../../../components/common/navbar";
import { saveUserField } from "../../../../services/user";
import { generalStyles } from "../../../../styles";
import styles from "./styles";
import { RootStackParamList } from "../../../../navigation/main";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface EditProfileFieldScreenProps {
  route: RouteProp<RootStackParamList, "editProfileField">;
  navigation: NativeStackNavigationProp<RootStackParamList, "editProfileField">;
}

export default function EditProfileFieldScreen({
  route,
}: EditProfileFieldScreenProps) {
  const { title, field, value } = route.params;
  const [textInputValue, setTextInputValue] = useState(value);
  const navigation = useNavigation();

  const onSave = () => {
    saveUserField(field, textInputValue).then(() => navigation.goBack());
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavBarGeneral
        title={title}
        rightButton={{ display: true, name: "save", action: onSave }}
      />
      <Divider />
      <View style={styles.mainContainer}>
        <Text style={styles.title}>{title}</Text>
        <TextInput
          style={generalStyles.textInput}
          value={textInputValue}
          onChangeText={setTextInputValue}
        />
      </View>
    </SafeAreaView>
  );
}
