# DishDive Codebase Analysis

## Project Overview
DishDive is a React Native mobile application built with Expo that functions as a cooking-focused social media platform, similar to TikTok but specialized for recipe sharing. The app allows users to browse through a vertical feed of cooking videos, interact with content through likes and comments, view detailed recipes, and manage their profiles.

## Key Components and Architecture

### Frontend Structure
- **React Native with Expo**: The app is built using React Native and Expo for cross-platform mobile development
- **TypeScript**: The codebase uses TypeScript for type safety
- **Navigation**: Uses React Navigation for screen management with multiple stack navigators
- **State Management**: Redux is used for global state management

### Backend Integration
- **Firebase**: The app uses Firebase for backend services:
  - Authentication (Firebase Auth)
  - Database (Firestore)
  - Storage (Firebase Storage)
  - Cloud Functions

### Main Features

#### Feed System
- Vertical scrolling video feed similar to TikTok
- Videos auto-play when in view and pause when scrolled away
- Each post includes user information, description, and interaction buttons

#### Video Player
- Custom video player implementation using Expo AV
- Handles play/pause states and video lifecycle management
- Touch interaction to toggle play/pause

#### User Interactions
- Like system with optimistic UI updates
- Comment system with real-time updates
- Profile viewing and navigation

#### Recipe Feature
- Videos can include detailed recipes
- Recipe modal with ingredients and steps
- Recently added save functionality (no-op for now)

### Code Organization

#### Directory Structure
- `/src/components`: Reusable UI components
- `/src/screens`: Main application screens
- `/src/navigation`: Navigation configuration
- `/src/services`: API and Firebase service functions
- `/src/redux`: Redux store, slices, and actions
- `/src/hooks`: Custom React hooks
- `/src/styles`: Shared styling

#### Key Files
- `PostSingle.tsx`: Core component for displaying individual videos
- `PostSingleOverlay.tsx`: UI overlay for video interactions
- `FeedScreen.tsx`: Main feed screen with video list management
- `posts.ts`: Service functions for post-related operations

## Implementation Details

### Video Feed Implementation
The feed uses a FlatList with optimized rendering settings:
- `windowSize`, `initialNumToRender`, and `maxToRenderPerBatch` are configured for performance
- `onViewableItemsChanged` callback manages which videos play/pause
- Videos use `removeClippedSubviews` to optimize memory usage

### Media Playback
- Videos are managed through refs passed to the PostSingle component
- The parent component controls play/pause states
- Videos automatically unload when not needed to conserve memory

### User Interaction Patterns
- Like actions use optimistic updates for better UX
- Comments are loaded and updated in real-time using Firebase listeners
- Profile navigation is handled through the navigation stack

### Recently Added Save Feature
- Added a save button to the post overlay
- Currently implemented as a no-op with visual feedback only
- Uses a bookmark icon that toggles between outline and filled states
- Simple visual feedback with no alerts or toasts

## Next Steps for Development
As mentioned in the README, potential next features include:
- Implementing actual save functionality with backend integration
- Ability to reload profile/feed/chat screens
- Ability to share posts through messaging
- Separating "For You" feed from "Following" feed
- Enhancing the recipe feature with more details and search capabilities
