import React, { useState, useEffect, memo} from "react";
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    TouchableOpacity, 
    Animated, 
    ScrollView,
    Pressable,
    Dimensions
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Watermark from "../components/Watermark";
import HexagonBackground from "../components/HexagonBackground";
import { supabase } from "../lib/supabase";

SplashScreen.preventAutoHideAsync();

const MemoizedHexagonBackground = memo(HexagonBackground);

const DashboardScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [menuVisible, setMenuVisible] = useState(false);
    const [expanded, setExpanded] = useState({
        labs: false,
        library: false,
        quizzes: false,
        about: false,
    });
    const [fontsReady, setFontsReady] = useState(false);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const fadeAnim = useState(new Animated.Value(0))[0];

    const slideAnim = useState(new Animated.Value(-250))[0];

    useEffect(() => {
        async function loadFonts() {
            try {
                await Font.loadAsync({
                    "VT323-Regular": require("../assets/fonts/VT323-Regular.ttf"),
                    "SpaceGrotesk-Bold": require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
                });
            } finally {
                setFontsReady(true);
            }
        }
        loadFonts();
    }, []);

    useEffect(() => {
        if (fontsReady) {
            SplashScreen.hideAsync();
        }
    }, [fontsReady]);

    const toggleMenu = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: menuVisible ? -250 : 0,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(fadeAnim, {
                toValue: menuVisible ? 0 : 0.5,
                duration: 300,
                useNativeDriver: false,
            })
        ]).start();
        setMenuVisible(!menuVisible);
    };

    const toggleSection = (section) => {
        setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigation.replace("Auth");
    };

    if (!fontsReady) return null;

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top}]}>
            <MemoizedHexagonBackground />
            <Watermark />

            {/* Overlay escuro quando o menu está aberto */}
            <Animated.View 
                style={[
                    styles.overlay,
                    { opacity: fadeAnim }
                ]}
                pointerEvents={menuVisible ? "auto" : "none"}
                onTouchStart={menuVisible ? toggleMenu : null}
            />

            {/* Botão Menu */}
            <Pressable 
                style={({ pressed }) => [
                    styles.menuButton,
                    pressed && styles.menuButtonPressed
                ]} 
                onPress={toggleMenu}
            >
                <Ionicons name="settings-outline" size={28} color="#00E0FF" />
            </Pressable>

            {/* Menu Lateral */}
            <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
                <View style={styles.menuHeader}>
                    <Image
                        source={require("../assets/images/user.png")}
                        style={styles.userImage}
                    />
                    <Text style={styles.username}>Usuário</Text>
                </View>
                <Pressable 
                    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                >
                    <Ionicons name="key-outline" size={22} color="#00E0FF" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Alterar Senha</Text>
                </Pressable>
                <Pressable 
                    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                >
                    <Ionicons name="trash-outline" size={22} color="#FF4040" style={styles.menuIcon} />
                    <Text style={[styles.menuText, { color: "#FF4040" }]}>Deletar Conta</Text>
                </Pressable>
                {/* Botão Logout */}
                <Pressable 
                    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                    onPress={() => handleLogout()}
                >
                    <Ionicons name="log-out-outline" size={22} color="#00E0FF" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Sair</Text>
                </Pressable>
            </Animated.View>

            {/* a carne do negocio */}

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>Dashboard</Text>

            {/* Laboratórios */}
            <Pressable 
                style={({ pressed }) => [
                    styles.section,
                    pressed && styles.sectionPressed
                ]}
                onPress={() => toggleSection("labs")}
            >
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="flask-outline" size={24} color="#00E0FF" style={styles.sectionIcon} />
                        <Text style={styles.sectionTitle}>Laboratórios</Text>
                    </View>
                    <Ionicons
                        name={expanded.labs ? "chevron-up" : "chevron-down"}
                        size={22}
                        color="#00E0FF"
                    />
                </View>
                {expanded.labs && (
                    <View style={styles.sectionContent}>
                        <Text style={styles.subtitle}>Coloque seus conhecimentos em prática.</Text>
                    </View>
                )}
            </Pressable>

            {/* Biblioteca */}
            <Pressable 
                style={({ pressed }) => [
                    styles.section,
                    pressed && styles.sectionPressed
                ]}
                onPress={() => toggleSection("library")}
            >
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="library-outline" size={24} color="#00E0FF" style={styles.sectionIcon} />
                        <Text style={styles.sectionTitle}>Biblioteca</Text>
                    </View>
                    <Ionicons
                        name={expanded.library ? "chevron-up" : "chevron-down"}
                        size={22}
                        color="#00E0FF"
                    />
                </View>
                {expanded.library && (
                    <View style={styles.sectionContent}>
                        <Text style={styles.subtitle}>
                            Acesse guias, artigos e livros para aprofundar seu conhecimento.
                        </Text>
                    </View>
                )}
            </Pressable>

            {/* Quizzes */}
            <Pressable 
                style={({ pressed }) => [
                    styles.section,
                    pressed && styles.sectionPressed
                ]}
                onPress={() => toggleSection("quizzes")}
            >
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="help-circle-outline" size={24} color="#00E0FF" style={styles.sectionIcon} />
                        <Text style={styles.sectionTitle}>Quizzes</Text>
                    </View>
                    <Ionicons
                        name={expanded.quizzes ? "chevron-up" : "chevron-down"}
                        size={22}
                        color="#00E0FF"
                    />
                </View>
                {expanded.quizzes && (
                    <View style={styles.sectionContent}>
                        <Text style={styles.subtitle}>Teste sua compreensão teórica dos temas.</Text>

                        {['Burp Suite', 'TCPdump', 'Wireshark'].map((quiz, index) => (
                            <Pressable
                                key={index}
                                style={({ pressed }) => [
                                    styles.quizButton,
                                    activeQuiz === index && styles.quizButtonActive,
                                    pressed && styles.quizButtonPressed
                                ]}
                                onPressIn={() => setActiveQuiz(index)}
                                onPressOut={() => setActiveQuiz(null)}
                            >
                                <View style={styles.quizButtonContent}>
                                    <Ionicons 
                                        name={index === 0 ? "bug-outline" : index === 1 ? "terminal-outline" : "scan-outline"} 
                                        size={22} 
                                        color="#00E0FF" 
                                        style={styles.quizIcon} 
                                    />
                                    <Text style={styles.quizButtonText}>{quiz}</Text>
                                </View>
                            </Pressable>
                        ))}
                </View>
            )}
            </Pressable>

            {/* Sobre */}
            <Pressable 
                style={({ pressed }) => [
                    styles.section,
                    pressed && styles.sectionPressed
                ]}
                onPress={() => toggleSection("about")}
            >
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="information-circle-outline" size={24} color="#00E0FF" style={styles.sectionIcon} />
                        <Text style={styles.sectionTitle}>Sobre</Text>
                    </View>
                    <Ionicons
                        name={expanded.about ? "chevron-up" : "chevron-down"}
                        size={22}
                        color="#00E0FF"
                    />
                </View>
                {expanded.about && (
                    <View style={styles.sectionContent}>
                        <Text style={styles.subtitle}>
                            O Laboratório Online de Cibersegurança com Kali Linux (LOCK) nasce em meio à necessidade de um meio de pesquisa, estudo e aprendizagem prática sobre segurança e 
                            pentesting, principalmente na realidade do Instituto Federal do Sertão Pernambucano (IFSertão-PE) - Campus Salgueiro.
                            A equipe, composta por membros do Campus Salgueiro do IFSertão-PE, tem como objetivo investigar, pesquisar, desenvolver, comprovar e aplicar tecnologias relacionadas 
                            ao contexto da cibersegurança em estado da atualidade.
                            Diante disso, o grupo busca meios de transformar a cibersegurança em uma aprendizagem prática e dinâmica para incentivar a propagação do conhecimento, mitigar 
                            vulnerabilidades comuns, promover boas práticas de segurança da informação e preparar discentes e docentes para enfrentar cenários reais de ameaças cibernéticas.
                        </Text>
                    </View>
                )}
            </Pressable>
        </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A12",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 10,
  },
  menuButton: {
    position: "absolute",
    top: 35,
    left: 20,
    zIndex: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(10,10,18,0.8)",
    borderWidth: 1,
    borderColor: "rgba(0, 224, 255, 0.2)",
  },
  menuButtonPressed: {
    backgroundColor: "rgba(0, 224, 255, 0.15)",
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    height: "100%",
    backgroundColor: "rgba(10,10,18,0.95)",
    paddingTop: 80,
    paddingHorizontal: 15,
    zIndex: 15,
    borderRightWidth: 1,
    borderRightColor: "rgba(0, 224, 255, 0.1)",
  },
  menuHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#00E0FF",
  },
  username: {
    color: "#00E0FF",
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  menuItemPressed: {
    backgroundColor: "rgba(0, 224, 255, 0.1)",
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    color: "#FFFFFF",
    fontFamily: "VT323-Regular",
    fontSize: 18,
  },
  contentContainer: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 36,
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk-Bold",
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 224, 255, 0.1)",
  },
  sectionPressed: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    color: "#00E0FF",
    fontSize: 22,
    fontFamily: "SpaceGrotesk-Bold",
  },
  sectionContent: {
    marginTop: 15,
    paddingHorizontal: 8,
  },
  subtitle: {
    color: "#AFAFAF",
    fontFamily: "VT323-Regular",
    fontSize: 18,
    marginBottom: 20,
    lineHeight: 24,
  },
  quizButton: {
    backgroundColor: "rgba(0, 224, 255, 0.1)",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 224, 255, 0.2)",
    elevation: 3,
    shadowColor: "#00E0FF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quizButtonPressed: {
    backgroundColor: "rgba(0, 224, 255, 0.2)",
    transform: [{ scale: 0.98 }],
  },
  quizButtonActive: {
    backgroundColor: "#00E0FF",
    borderColor: "#FFF",
  },
  quizButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quizIcon: {
    marginRight: 10,
  },
  quizButtonText: {
    color: "#00E0FF",
    fontSize: 18,
    fontFamily: "SpaceGrotesk-Bold",
    textAlign: "center",
  },
});

export default DashboardScreen;