import React from "react";
import Svg, { Path } from 'react-native-svg';

const SimpleHexagon = ({ color }) => {
    return (
        <Svg height='100%' wight='100%' viewBox='0 0 100 86.6'>
            <Path 
                d="M25 0 L75 0 L100 43.3 L75 86.6 L25 86.6 L0 43.3 Z"
                fill={color}
            />
        </Svg>
    );
};

export default SimpleHexagon;