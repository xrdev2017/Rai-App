import "./global.css";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useState } from "react";
import SplashScreenAnimated from "./src/root/SplashScreenAnimated";
import * as SplashScreen from "expo-splash-screen";
import FontProvider from "./src/utils/FontProvider";
import AppNavigator from "./src/root/AppNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FormProvider, useForm } from "react-hook-form";
import { Provider } from "react-redux";
import { persistor, store } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import i18n from "./src/utils/languageSetup";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider, useTheme } from "./src/utils/ThemeContext";

SplashScreen.preventAutoHideAsync();

// Wrapper component to apply dark mode
const AppContent = ({ methods, isReady, onSplashFinish }) => {
  const { isDarkMode } = useTheme();
  const navigationTheme = isDarkMode
    ? {
        ...NavigationDarkTheme,
        colors: {
          ...NavigationDarkTheme.colors,
          background: "#1A1820",
          card: "#1A1820",
          text: "#F5F4F7",
          border: "#3D3843",
          primary: "#8E54FE",
        },
      }
    : {
        ...NavigationDefaultTheme,
        colors: {
          ...NavigationDefaultTheme.colors,
          background: "#F5F4F7",
          card: "#F5F4F7",
          text: "#08002B",
          border: "#D8D4E0",
          primary: "#5700FE",
        },
      };

  return (
    <View className={isDarkMode ? "dark" : ""} style={{ flex: 1 }}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <FormProvider {...methods}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <I18nextProvider i18n={i18n}>
            <NavigationContainer theme={navigationTheme}>
              <SafeAreaProvider>
                {!isReady ? (
                  <SplashScreenAnimated onFinish={onSplashFinish} />
                ) : (
                  <AppNavigator />
                )}
              </SafeAreaProvider>
            </NavigationContainer>
          </I18nextProvider>
        </GestureHandlerRootView>
      </FormProvider>
    </View>
  );
};

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const onSplashFinish = async () => {
    await SplashScreen.hideAsync();
    setTimeout(() => setIsReady(true), 1000);
  };

  const methods = useForm({ mode: "onChange" });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <FontProvider>
            <AppContent
              methods={methods}
              isReady={isReady}
              onSplashFinish={onSplashFinish}
            />
          </FontProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
