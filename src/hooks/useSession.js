import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cria o contexto
const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carrega sessão salva ao iniciar
    const loadSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user = await AsyncStorage.getItem("user");
        if (token && user) {
          setSession({ token, user: JSON.parse(user) });
        }
      } catch (e) {
        console.log("Erro ao carregar sessão:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const signIn = async (user, token) => {
    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setSession({ user, token }); // Atualiza estado -> Redireciona na navegação
    } catch (e) {
      console.log("Erro ao salvar login:", e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setSession(null); // Atualiza estado -> Redireciona na navegação
    } catch (e) {
      console.log("Erro ao sair:", e);
    }
  };

  return (
    <SessionContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession deve ser usado dentro de um SessionProvider');
  }
  return context;
}