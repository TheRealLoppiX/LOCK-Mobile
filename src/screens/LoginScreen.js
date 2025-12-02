import React, { useState, useEffect, memo } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  TextInput,
  Pressable,
  Animated,
  Keyboard
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import Watermark from "../components/Watermark";
import HexagonBackground from "../components/HexagonBackground";
import { supabase } from "../lib/supabase";

const MemoizedHexagonBackground = memo(HexagonBackground);

const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const buttonScale = new Animated.Value(1);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setIsLoading(false);

    if (error) {
      console.log("Login error:", error.message);
      console.log("Supabase error object:", error);
      alert("Erro ao entrar: " + error.message);
      } else if (data?.user) {
        console.log("Login successful:", data.user.email);
        navigation.replace("Dashboard");
      }
  };

  const handleGoToRegister = () => {
    navigation.navigate("Register");
  };

  useEffect(() => {
    async function checkConnection() {
      const { data, error } = await supabase.from('users').select('*').limit(1);
      if (error) console.log('Erro ao conectar ao Supabase:', error.message);
      else console.log('Conexão OK ✅');
    }
    checkConnection();
  }, []);

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" />
      <MemoizedHexagonBackground />
      <Watermark />

      <Pressable 
        style={({ pressed }) => [
          styles.backButton, 
          { top: insets.top + 10 },
          pressed && styles.backButtonPressed
        ]} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#00E0FF" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </Pressable>

      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>ENTRAR</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={emailFocused ? "#00E0FF" : "#888"} style={styles.inputIcon} />
            <TextInput
              style={[
                styles.input,
                emailFocused && styles.inputFocused
              ]}
              placeholder="Seu email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={passwordFocused ? "#00E0FF" : "#888"} style={styles.inputIcon} />
            <TextInput
              style={[
                styles.input,
                passwordFocused && styles.inputFocused
              ]}
              placeholder="Sua senha"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry={!showPassword}
              textContentType="password"
            />
            <Pressable 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#888" 
              />
            </Pressable>
          </View>

          <Pressable 
            style={({ pressed }) => [
              styles.forgotButton,
              pressed && styles.forgotButtonPressed
            ]} 
            onPress={() => console.log('Forgot pass pressed')}
          >
            <Text style={styles.forgotButtonText}>Esqueceu a senha?</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
              isLoading && styles.loginButtonLoading
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loginButtonText}>Entrando</Text>
                <View style={styles.loadingDots}>
                  <Text style={styles.loadingDot}>.</Text>
                  <Text style={styles.loadingDot}>.</Text>
                  <Text style={styles.loadingDot}>.</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.registerLink,
              pressed && styles.registerLinkPressed
            ]} 
            onPress={handleGoToRegister}
          >
            <Text style={styles.registerLinkText}>
              Não tem uma conta? <Text style={styles.registerLinkHighlight}>Cadastre-se</Text>
            </Text>
          </Pressable>
        </View>
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
    justifyContent: "center", 
    paddingHorizontal: 20,
    zIndex: 1,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
  },
  backButtonPressed: {
    backgroundColor: 'rgba(0, 224, 255, 0.1)',
  },
  backButtonText: {
    color: '#00E0FF',
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    fontSize: 40,
    color: "#FFFFFF",
    marginBottom: 40,
    fontFamily: "SpaceGrotesk-Bold",
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 224, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a40',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    color: '#FFFFFF',
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
  },
  inputFocused: {
    borderColor: '#00E0FF',
  },
  passwordToggle: {
    padding: 8,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 25,
    padding: 8,
    borderRadius: 15,
  },
  forgotButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  forgotButtonText: {
    color: '#888',
    fontFamily: 'VT323-Regular',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#00E0FF",
    paddingVertical: 15,
    borderRadius: 30,
    width: '100%', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#00E0FF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButtonPressed: {
    backgroundColor: "rgba(0, 224, 255, 0.8)",
    transform: [{ scale: 0.98 }],
  },
  loginButtonLoading: {
    opacity: 0.8,
  },
  loginButtonText: {
    color: "#0A0A12",
    fontSize: 16,
    fontFamily: "SpaceGrotesk-Bold",
    letterSpacing: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  loadingDot: {
    color: "#0A0A12",
    fontSize: 16,
    fontFamily: "SpaceGrotesk-Bold",
    marginLeft: 2,
  },
  registerLink: {
    marginTop: 30,
    padding: 8,
    borderRadius: 15,
  },
  registerLinkPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  registerLinkText: {
    color: '#FFFFFF',
    fontFamily: 'VT323-Regular',
    fontSize: 16,
  },
  registerLinkHighlight: {
    color: '#00E0FF',
    fontFamily: 'SpaceGrotesk-Bold', 
  },
});

export default LoginScreen;