export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL?: string;
  bio?: string;
  phoneNumber?: string;
  following?: string[];
  followers?: string[];
  followersCount: number;
  followingCount: number;
  likesCount: number;
}
