import { View, Text, Image, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";
import { buttonStyles } from "../../../styles";
import styles from "./styles";
import { RootState } from "../../../redux/store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/main";
import { FIREBASE_AUTH } from "../../../../firebaseConfig";
import { useFollowing } from "../../../hooks/useFollowing";
import { Feather } from "@expo/vector-icons";
import { useFollowingMutation } from "../../../hooks/useFollowingMutation";
import { useEffect, useState } from "react";

/**
 * Renders the header of the user profile and
 * handles all of the actions within it like follow, unfollow and
 * routing to the user settings.
 *
 * @param {Object} props
 * @param {Object} props.user information of the user to display
 * @returns
 */
export default function ProfileHeader({
  user,
}: {
  user: RootState["auth"]["currentUser"];
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [followersCount, setFollowersCount] = useState(
    user?.followersCount || 0,
  );

  useEffect(() => {
    setFollowersCount(user?.followersCount || 0);
  }, [user]);

  const followingData = useFollowing(
    FIREBASE_AUTH.currentUser?.uid ?? null,
    user?.uid ?? null,
  );
  const isFollowing =
    FIREBASE_AUTH.currentUser?.uid && user?.uid && followingData.data
      ? followingData.data
      : false;

  const isFollowingMutation = useFollowingMutation();

  const renderFollowButton = () => {
    if (isFollowing) {
      return (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={buttonStyles.grayOutlinedButton}
            onPress={() => {
              if (user?.uid) {
                navigation.navigate("chatSingle", { contactId: user.uid });
              }
            }}
          >
            <Text style={buttonStyles.grayOutlinedButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={buttonStyles.grayOutlinedIconButton}
            onPress={() => {
              if (user?.uid) {
                isFollowingMutation.mutate({
                  otherUserId: user.uid,
                  isFollowing,
                });
                setFollowersCount(followersCount - 1);
              }
            }}
          >
            <Feather name="user-check" size={20} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          style={buttonStyles.filledButton}
          onPress={() => {
            if (user?.uid) {
              isFollowingMutation.mutate({
                otherUserId: user.uid,
                isFollowing,
              });
              setFollowersCount(followersCount + 1);
            }
          }}
        >
          <Text style={buttonStyles.filledButtonText}>Follow</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    user && (
      <View style={styles.container}>
        {user.photoURL ? (
          <Image style={styles.avatar} source={{ uri: user.photoURL }} />
        ) : (
          <Avatar.Icon size={90} icon={"account"} style={{borderWidth: 2, borderColor: "#FF4D67", borderRadius: 45}} />
        )}
        <Text style={styles.emailText} numberOfLines={1} ellipsizeMode="tail">
          {user.displayName || user.email}
        </Text>
        <View style={styles.counterContainer}>
          <View style={styles.counterItemContainer}>
            <Text style={styles.counterNumberText}>{user.followingCount}</Text>
            <Text style={styles.counterLabelText}>Following</Text>
          </View>
          <View style={styles.counterItemContainer}>
            <Text style={styles.counterNumberText}>{followersCount}</Text>
            <Text style={styles.counterLabelText}>Followers</Text>
          </View>
          <View style={styles.counterItemContainer}>
            <Text style={styles.counterNumberText}>{user.likesCount}</Text>
            <Text style={styles.counterLabelText}>Likes</Text>
          </View>
        </View>
        {FIREBASE_AUTH.currentUser?.uid === user.uid ? (
          <TouchableOpacity
            style={buttonStyles.uploadButton}
            onPress={() => navigation.navigate("uploadScreen")}
          >
            <Feather name="upload" size={18} color="white" />
            <Text style={buttonStyles.uploadButtonText}>
              Upload Post
            </Text>
          </TouchableOpacity>
        ) : (
          renderFollowButton()
        )}
      </View>
    )
  );
}
