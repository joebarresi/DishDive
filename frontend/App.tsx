import { store } from "./src/redux/store";
import { Provider } from "react-redux";
import Route from "./src/navigation/main";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Audio } from "expo-av";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      staleTime: Infinity,
    },
  },
});

export default function App() {
  Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Route />
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
