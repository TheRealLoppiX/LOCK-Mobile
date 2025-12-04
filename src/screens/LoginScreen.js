import React, { useState, useEffect, memo } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  TextInput,
  Pressable,
  Keyboard,
  Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import Watermark from "../components/Watermark";
import HexagonBackground from "../components/HexagonBackground";
// Importe o hook de sessão corretamente
import { useSession } from "../hooks/useSession"; 

const MemoizedHexagonBackground = memo(HexagonBackground);

// DICA: Mova isso para um arquivo de configuração (ex: src/config.js)
const API_URL = "https://lock-api-w4ia.onrender.com";

const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  // Hook de sessão para gerenciar o login
  const { signIn } = useSession(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // --------------------------
  // 🔐 LOGIN VIA BACKEND
  // --------------------------
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("❌ Erro login:", data.message);
        Alert.alert("Falha no Login", data.message || "Verifique suas credenciais.");
        return;
      }

      // SUCESSO: Chama o hook de sessão
      // O hook vai salvar o token e atualizar o estado global
      // Isso fará o AppNavigation redirecionar AUTOMATICAMENTE para a Dashboard
      await signIn(data.user, data.token);

      console.log("Login bem-sucedido:", data.user.email);

    } catch (err) {
      console.log("❌ Erro inesperado:", err);
      Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor. Verifique sua internet.");
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------
  // 🛠 TESTAR CONEXÃO (Opcional, mas útil para debug)
  // --------------------------
  useEffect(() => {
    const testConnection = async () => {
      try {
        const res = await fetch(`${API_URL}/ping`);
        console.log(res.ok ? "✅ Backend conectado!" : "❌ Backend não respondeu");
      } catch (e) {
        console.log("❌ Erro ao conectar backend:", e);
      }
    };
    testConnection();
  }, []);

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A12" />
      <MemoizedHexagonBackground />
      <Watermark />

      {/* BOTÃO VOLTAR */}
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

      {/* ÁREA PRINCIPAL */}
      <View style={styles.container}>
        <View style={styles.content}>

          <Text style={styles.title}>ENTRAR</Text>

          {/* EMAIL */}
          <View style={[styles.inputContainer, emailFocused && styles.inputContainerFocused]}>
            <Ionicons 
              name="mail-outline" 
              size={20} 
              color={emailFocused ? "#00E0FF" : "#888"} 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Seu email ou nome"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* SENHA */}
          <View style={[styles.inputContainer, passwordFocused && styles.inputContainerFocused]}>
            <Ionicons 
              name="lock-closed-outline" 
              size={20} 
              color={passwordFocused ? "#00E0FF" : "#888"} 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
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

          {/* ESQUECEU A SENHA */}
          <Pressable 
            style={({ pressed }) => [
              styles.forgotButton,
              pressed && styles.forgotButtonPressed
            ]}
            onPress={() => navigation.navigate("Recover")}
          >
            <Text style={styles.forgotButtonText}>Esqueceu a senha?</Text>
          </Pressable>

          {/* BOTÃO ENTRAR */}
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
                <Text style={styles.loginButtonText}>Entrando...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </Pressable>

          {/* IR PARA CADASTRO */}
          <Pressable 
            style={({ pressed }) => [
              styles.registerLink,
              pressed && styles.registerLinkPressed
            ]}
            onPress={() => navigation.navigate("Register")}
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

// ---------------------------------------
// 🔵 STYLES
// ---------------------------------------
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
    position: "absolute",
    left: 20,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 20,
  },
  backButtonPressed: {
    backgroundColor: "rgba(0, 224, 255, 0.1)",
  },
  backButtonText: {
    color: "#00E0FF",
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    fontSize: 40,
    color: "#FFFFFF",
    marginBottom: 40,
    fontFamily: "SpaceGrotesk-Bold",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 224, 255, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a40",
    paddingHorizontal: 15,
    height: 55,
  },
  inputContainerFocused: {
    borderColor: "#00E0FF",
    shadowColor: "#00E0FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    height: "100%",
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 16,
  },
  passwordToggle: { padding: 8 },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 25,
    padding: 8,
    borderRadius: 15,
  },
  forgotButtonText: {
    color: "#888",
    fontFamily: "VT323-Regular",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#00E0FF",
    paddingVertical: 15,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#00E0FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonPressed: {
    backgroundColor: "rgba(0, 224, 255, 0.8)",
    transform: [{ scale: 0.98 }],
  },
  loginButtonLoading: { opacity: 0.7 },
  loginButtonText: {
    color: "#0A0A12",
    fontSize: 18,
    fontFamily: "SpaceGrotesk-Bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  registerLink: { marginTop: 30, padding: 8 },
  registerLinkText: { color: "#FFFFFF", fontFamily: "VT323-Regular", fontSize: 16 },
  registerLinkHighlight: { color: "#00E0FF", fontFamily: "SpaceGrotesk-Bold" },
});

export default LoginScreen;