import React, { useEffect, useState, memo } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Watermark from "../components/Watermark";
import HexagonBackground from "../components/HexagonBackground";

const AUTH_MESSAGE = "Seu Laboratório Online de Cibersegurança";

SplashScreen.preventAutoHideAsync();

const MemoizedHexagonBackground = memo(HexagonBackground);

const AuthScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [typedText, setTypedText] = useState("");
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "VT323-Regular": require("../assets/fonts/VT323-Regular.ttf"),
          "SpaceGrotesk-Bold": require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
        });
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
      let index = 0;
      const type = () => {
        if (index <= AUTH_MESSAGE.length) {
          setTypedText(AUTH_MESSAGE.substring(0, index));
          index++;
          setTimeout(type, 80);
        }
      };
      type();
    }
  }, [appIsReady]);

  const handleLogin = () => {
    console.log("Login pressed");
    navigation.navigate("Login");
  }
  const handleRegister = () => console.log("Register pressed");

  if (!appIsReady) return null;

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" />
      <MemoizedHexagonBackground />
      <Watermark />

      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
            />
          </View>

          <Text style={styles.projectTitle}>LOCK</Text>
          <Text style={styles.typingText}>{typedText}_</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.dbStatus}>Sem Conexão</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A12",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  projectTitle: {
    fontSize: 40,
    color: "#FFFFFF",
    marginBottom: 10,
    fontFamily: "SpaceGrotesk-Bold",
    letterSpacing: 1,
  },
  typingText: {
    fontSize: 18,
    color: "#00FF41",
    marginBottom: 40,
    fontFamily: "VT323-Regular",
    textAlign: "center",
    paddingHorizontal: 25,
    lineHeight: 22,
    flexShrink: 1,
    maxWidth: "90%",
    alignSelf: "center",
  },
  dbStatus: {
    color: "#555",
    position: "absolute",
    bottom: 80,
    zIndex: 2,
    fontFamily: "VT323-Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#00E0FF",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  loginButtonText: {
    color: "#0A0A12",
    fontSize: 16,
    fontFamily: "SpaceGrotesk-Bold",
  },
  registerButton: {
    backgroundColor: "transparent",
    paddingVertical: 13,
    paddingHorizontal: 48,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#00E0FF",
  },
  registerButtonText: {
    color: "#00E0FF",
    fontSize: 16,
    fontFamily: "SpaceGrotesk-Bold",
  },
});

export default AuthScreen;
