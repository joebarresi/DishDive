---- This has since been archived in favor of using a private repo ----
This project is to be the app for all things cooking. It's a fork of a react-native tiktok with filling in missing implementations.

## Setup & Usage

### Backend - Firebase Functions

Install the Firebase CLI tools globally to be able to manage and deploy Firebase services from your local machine.

```
npm install -g firebase-tools
```

Next, authenticate your account with Firebase and gain the necessary permissions.

```
firebase login
```
Go to the `backend\functions` directory and install the needed dependencies.

```
npm install
```
Run the following command to deploy the Firebase functions contained in the project, allowing them to be executed on the Firebase servers.

```
firebase deploy
```

### Frontend - React Native Application with Expo

Go to the `frontend` directory and install the needed dependencies.

```
npm install
```

To start the application, run the following command.

```
npm run start
```

This will launch the Expo development server. To view the application, you'll need either an iOS or Android emulator. If you're unfamiliar with setting up an emulator, you can follow the beginning of [this tutorial](https://www.youtube.com/watch?v=HrN1Fvjp2CE) for guidance on configuring an Android emulator. Watch [this tutorial](https://www.youtube.com/watch?v=DloY4tyzKDA) to set up an iOS emulator.

When you first run the project, you will encounter the following error related to Firestore:

```
@firebase/firestore: Firestore (10.3.0): Uncaught Error in snapshot listener: FirebaseError: [code=failed-precondition]: The query requires an index. You can create it here:
```

This error occurs because Firestore needs to create a specialized index for the query you're running, and it doesn't yet exist. Without this index, Firestore can't execute the query efficiently.

To resolve this issue, you'll need to follow the provided link in the error message and click "Save" to create the required index. Doing so will optimize Firestore for your specific query needs, ensuring smooth and efficient operations.

## Next Steps

There are plenty of features to add, so here is what I would work on next. Feel free to contribute if you are interested.

- Ability to reload profile/feed/chat screens
- Ability to share posts through messaging
- For You feed page vs Following feed page
