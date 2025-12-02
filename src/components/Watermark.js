import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Watermark = () => {
  const insets = useSafeAreaInsets();

  const handlePress = async () => {
    const url = 'https://ifsertaope.edu.br/';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn('Não foi possivel abrir o link: ' + url);
    }
};

  return (
    <View style={[styles.container, { top: insets.top + 10, right: insets.right + 20 }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Image
            source={require('../assets/images/instituicao.png')}
            style={styles.logo}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    opacity: 0.8,
  },
});

export default Watermark;
