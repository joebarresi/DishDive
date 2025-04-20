# RecipeTok Setup Guide

This guide will walk you through setting up and running the RecipeTok app on your macOS system. Follow these steps carefully to get everything working properly.

## Prerequisites

Before you begin, make sure you have the following installed on your Mac:

1. **Terminal**: Already available on macOS
2. **Git**: To check if Git is installed, open Terminal and type `git --version`. If not installed, you'll be prompted to install it.
3. **Node.js and npm**: Required to run the JavaScript code and install dependencies

## Step 1: Install Node.js and npm

1. Open Terminal
2. Install Homebrew (package manager for macOS) if you don't have it:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. Install Node.js and npm:
   ```bash
   brew install node
   ```
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

## Step 2: Clone the Repository

1. Open Terminal
2. Navigate to where you want to store the project:
   ```bash
   cd ~/Documents
   ```
3. Clone the repository:
   ```bash
   git clone https://github.com/username/RecipeTok.git
   ```
   (Replace the URL with the actual repository URL provided by your friend)
4. Navigate into the project directory:
   ```bash
   cd RecipeTok
   ```

## Step 3: Set Up Firebase

You'll need to create your own Firebase project to store data and handle authentication:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps to create a new project
3. Once your project is created, click on the web icon (</>) to add a web app
4. Register your app with a nickname (e.g., "RecipeTok")
5. Copy the Firebase configuration object (it looks like `const firebaseConfig = {...}`)
6. Open the file `frontend/firebaseConfig.ts` in a text editor and replace the existing configuration with yours
7. In the Firebase console, go to "Project settings" and copy the Project ID
8. Open the file `backend/.firebaserc` and replace the project ID with yours

## Step 4: Set Up Firebase Authentication

1. In the Firebase console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Enable "Email/Password" authentication by clicking on it and toggling the switch
4. Save the changes

## Step 5: Set Up Firebase Firestore Database

1. In the Firebase console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Start in production mode
4. Choose a location closest to you
5. Click "Enable"

## Step 6: Set Up Firebase Storage

1. In the Firebase console, go to "Storage" in the left sidebar
2. Click "Get started"
3. Start in production mode
4. Click "Next" and "Done"

## Step 7: Install Firebase CLI and Deploy Backend Functions

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in to Firebase:
   ```bash
   firebase login
   ```
   (This will open a browser window for authentication)
3. Navigate to the backend functions directory:
   ```bash
   cd backend/functions
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Deploy Firebase functions:
   ```bash
   firebase deploy
   ```

## Step 8: Set Up and Run the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm run start
   ```

## Step 9: Run the App

After starting the Expo server, you have several options to run the app:

### Option 1: Use Expo Go on Your Physical Device

1. Install the "Expo Go" app on your iOS or Android device from the App Store/Google Play Store
2. Scan the QR code displayed in your terminal with your phone's camera (iOS) or the Expo Go app (Android)
3. The app will load on your device

### Option 2: Use iOS Simulator (macOS only)

1. Install Xcode from the Mac App Store
2. Open Xcode and accept the terms
3. In the Expo terminal interface, press `i` to open the app in iOS simulator

### Option 3: Use Android Emulator

1. Install Android Studio
2. Set up an Android Virtual Device (AVD) through Android Studio
3. In the Expo terminal interface, press `a` to open the app in Android emulator

## Troubleshooting

### Firestore Index Error

When you first run the project, you might see an error like:
```
@firebase/firestore: Firestore (10.3.0): Uncaught Error in snapshot listener: FirebaseError: [code=failed-precondition]: The query requires an index. You can create it here: [URL]
```

To fix this:
1. Click on the URL provided in the error message
2. In the Firebase console page that opens, click "Create index"
3. Wait for the index to be created (may take a few minutes)
4. Restart the app

### Expo Connection Issues

If you have trouble connecting to the Expo server:
1. Make sure your computer and phone are on the same WiFi network
2. Try using the "tunnel" connection option by running:
   ```bash
   npm run start -- --tunnel
   ```

### Firebase Deployment Issues

If you encounter errors during Firebase deployment:
1. Make sure you're logged in to the correct Firebase account
2. Verify that your project ID in `.firebaserc` matches your Firebase project
3. Try running `firebase init` in the project root and reconfigure the project

## Next Steps

Once the app is running, you can:
1. Create an account using email and password
2. Upload videos from your camera or gallery
3. Browse videos from other users
4. Like and comment on videos
5. Follow other users
6. Send direct messages

Enjoy using RecipeTok!
