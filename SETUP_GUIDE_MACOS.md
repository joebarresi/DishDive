# RecipeTok Setup Guide for macOS

Hi there! This guide will walk you through setting up and running the RecipeTok app on your Mac. I've made this guide as straightforward as possible, assuming you're starting with just the Terminal app.

## Step 1: Install Required Tools

First, let's install the tools you'll need:

1. **Open Terminal**
   - Press `Cmd + Space` to open Spotlight Search
   - Type "Terminal" and press Enter

2. **Install Homebrew** (macOS package manager)
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   - Follow any additional instructions shown in the terminal
   - You might need to run a command to add Homebrew to your PATH

3. **Install Node.js and npm**
   ```bash
   brew install node
   ```

4. **Install Git** (if not already installed)
   ```bash
   brew install git
   ```

5. **Verify installations**
   ```bash
   node --version
   npm --version
   git --version
   ```
   All commands should return version numbers, not errors.

## Step 2: Clone the Repository

1. **Create a directory for your projects** (optional)
   ```bash
   mkdir -p ~/Projects
   cd ~/Projects
   ```

2. **Clone the RecipeTok repository**
   ```bash
   git clone https://github.com/jbarresi/RecipeTok.git
   ```
   (Note: Replace with the actual repository URL if different)

3. **Navigate to the project folder**
   ```bash
   cd RecipeTok
   ```

## Step 3: Set Up Firebase

You need your own Firebase project to store data and handle authentication:

1. **Go to Firebase Console**
   - Open your browser and go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account

2. **Create a new project**
   - Click "Add project"
   - Enter "RecipeTok" as the project name
   - Follow the setup wizard (you can disable Google Analytics if you want)
   - Click "Create project"

3. **Add a web app to your Firebase project**
   - From the project overview page, click the web icon (`</>`)
   - Register app with nickname "RecipeTok-Web"
   - Click "Register app"
   - Copy the entire firebaseConfig object (it looks like `const firebaseConfig = {...}`)

4. **Update the Firebase configuration in the app**
   - Open the file in a text editor:
     ```bash
     open -a TextEdit frontend/firebaseConfig.ts
     ```
   - Replace ONLY the firebaseConfig object with your copied configuration
   - Save and close the file

5. **Update the project ID in .firebaserc**
   - Get your Firebase project ID from the Firebase console (Project settings)
   - Open the file:
     ```bash
     open -a TextEdit backend/.firebaserc
     ```
   - Replace the project ID with yours
   - Save and close the file

6. **Set up Firebase services**
   - In the Firebase console, enable these services:
     - Authentication: Enable Email/Password sign-in method
     - Firestore Database: Create database in production mode
     - Storage: Set up in production mode

## Step 4: Deploy Firebase Backend

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Log in to Firebase**
   ```bash
   firebase login
   ```
   This will open a browser window; follow the prompts to log in.

3. **Deploy Firebase functions**
   ```bash
   cd backend/functions
   npm install
   firebase deploy
   ```
   This might take a few minutes. Wait for the "Deploy complete!" message.

## Step 5: Set Up and Run the Frontend

1. **Navigate to the frontend directory**
   ```bash
   cd ../../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will take a few minutes to download all required packages.

3. **Start the app**
   ```bash
   npm run start
   ```
   This will start the Expo development server.

## Step 6: Run the App on Your Device

You have several options to run the app:

### Option A: Use Expo Go on Your Phone (Easiest)

1. **Install the Expo Go app** on your iPhone or Android phone
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Connect your phone to the app**
   - Make sure your phone and computer are on the same WiFi network
   - Scan the QR code shown in your terminal with:
     - iOS: Use the Camera app
     - Android: Use the Expo Go app's scanner

3. **The app will open on your phone**
   - If you have connection issues, try the tunnel option:
     ```bash
     # Press Ctrl+C to stop the current server, then:
     npm run start -- --tunnel
     ```

### Option B: Use iOS Simulator (requires Xcode)

1. **Install Xcode** from the Mac App Store

2. **Open the app in the simulator**
   - In the Expo terminal interface, press `i`
   - Wait for the simulator to launch and install the app

### Option C: Use Android Emulator (requires Android Studio)

1. **Install Android Studio**
   ```bash
   brew install --cask android-studio
   ```

2. **Set up an Android Virtual Device**
   - Open Android Studio
   - Go to "More Actions" > "Virtual Device Manager"
   - Create a new device and start it

3. **Open the app in the emulator**
   - In the Expo terminal interface, press `a`

## Troubleshooting

### Firestore Index Error

If you see an error about "The query requires an index":
1. Click the URL in the error message
2. In the Firebase console page that opens, click "Create index"
3. Wait for the index to be created (may take a few minutes)
4. Restart the app

### Connection Issues

If your phone can't connect to the Expo server:
1. Make sure your phone and computer are on the same WiFi network
2. Try using the tunnel connection:
   ```bash
   npm run start -- --tunnel
   ```

### Firebase Deployment Issues

If you have problems with Firebase deployment:
1. Make sure you're logged in: `firebase login`
2. Verify your project ID in `.firebaserc` matches your Firebase project
3. Try running `firebase init` in the project root and reconfigure

## Using the App

Once the app is running, you can:
1. Create an account using email and password
2. Upload videos from your camera or gallery
3. Browse videos from other users
4. Like and comment on videos
5. Follow other users
6. Send direct messages

Enjoy using RecipeTok! If you have any questions or run into issues, please reach out.
