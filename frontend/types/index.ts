export interface Post {
  id: string;
  creator: string;
  media: string[];
  description: string;
  likesCount: number;
  commentsCount: number;
  creation: string;
  recipe?: Recipe;
  cuisineTags?: CuisineTags[];
  dietTags?: DietTags[];
  uploadStatus: "published" | "draft";
  viewCount: number; // Total unique viewers
  totalViews: number; // Total views (including repeat views)
  lastViewedAt: string; 
}

// View tracking (posts/{postId}/views/{userId})
export interface PostView {
  userId: string;
  viewCount: number; 
  firstViewedAt: string;
  lastViewedAt: string;
}

// User's viewed posts index (users/{userId}/viewedPosts/{postId})
export interface UserViewedPost {
  postId: string;
  viewCount: number; 
  lastViewedAt: string;
}

export interface ExternalPost {
  id: string;
  creator: string;
  link: string;
  creation: string;
  recipe: {title: string};
}

export enum DietTags {
  DASH = "DASH",
  Vegetarian = "Vegetarian",
  Vegan = "Vegan",
  Pescatarian = "Pescatarian",

  Ketogenic = "Keto",
  LowCarb = "Low-Carb",
  Atkins = "Atkins",
  GlutenFree = "Gluten-Free",
  DairyFree = "Dairy-Free",
  NutFree = "Nut-Free",
  LowFODMAP = "Low-FODMAP",

  Paleo = "Paleo",
  Carnivore = "Carnivore",
  LowSugar = "Low Sugar",

  Kosher = "Kosher",
  Halal = "Halal",
}

export enum CuisineTags {
  // Broad Regional Cuisines
  Mexican = "Mexican",
  Italian = "Italian",
  Chinese = "Chinese",
  Indian = "Indian",
  Japanese = "Japanese",
  French = "French",
  Thai = "Thai",
  Mediterranean = "Mediterranean",
  Korean = "Korean",
  Vietnamese = "Vietnamese",
  Greek = "Greek",
  Spanish = "Spanish",
  German = "German",
  Brazilian = "Brazilian",
  Ethiopian = "Ethiopian",
  Caribbean = "Caribbean",

  TexMex = "Tex-Mex",
  SoulFood = "Soul Food",
  Cajun = "Cajun",
  Creole = "Creole",
  Sushi = "Sushi", // Specific Japanese
  Ramen = "Ramen", // Specific Japanese
  Tapas = "Tapas", // Specific Spanish
  BBQ = "BBQ", // American style
  Seafood = "Seafood", // Can be a focus across cuisines
  Fusion = "Fusion",
}

export interface Comment {
  id: string;
  creator: string;
  comment: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL?: string;
  followingCount: number;
  followersCount: number;
  likesCount: number;
}

export interface SearchUser extends User {
  id: string;
}

export interface Chat {
  id: string;
  members: string[];
  lastMessage: string;
  lastUpdate?: {
    seconds?: number;
    nanoseconds?: number;
  };
  messages: Message[];
}

export interface Message {
  id: string;
  creator: string;
  message: string;
}

export interface Recipe {
  title: string;
  ingredients: string[];
  steps: string[];
}
