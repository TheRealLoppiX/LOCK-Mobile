import React, {useEffect, useState} from "react";
import { View, StyleSheet, Animated, Image} from 'react-native';
import SimpleHexagon from './SimpleHexagon';

const HexagonBackground = () => {
    const animatedValues = useState (
        Array.from({ length:20 }).map(() => new Animated.Value(0))
    )[0];

    useEffect(() => {
        animatedValues.forEach((animValue) => {
            const startAnimation = () => {
                animValue.setValue(0);
                Animated.timing(animValue, {
                    toValue: 1,
                    duration: Math.random() * 15000 + 10000,
                    useNativeDriver: true,
                }).start(() => startAnimation());
            };
            setTimeout(() => startAnimation(), Math.random() * 5000);
        });
    }, []);

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {animatedValues.map((animValue, index) => {
                const translateY = animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [900, -100]
                });

                const opacity = animValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.15, 0],
                });

                const left = '${Math.random() * 100}%';
                const size = Math.random() * 80 + 40;

                return (
                    <Animated.View
                        key={index}
                        style={{
                            position: 'absolute',
                            width: size,
                            height: size,
                            left: left,
                            opacity,
                            transform: [{ translateY }],
                        }}
                    >
                        <SimpleHexagon color='#00E0FF' />
                    </Animated.View>
                );
            })}
        </View>
    );
};

export default HexagonBackground;