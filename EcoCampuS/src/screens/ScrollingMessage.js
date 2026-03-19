import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

const ScrollingMessage = ({ message }) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }),
    ).start();
  }, [scrollAnim]);

  return (
    <Animated.Text
      style={[
        styles.scrollingText,
        {
          transform: [
            {
              translateX: scrollAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [300, -300], // Ajustez selon la longueur du message
              }),
            },
          ],
        },
      ]}
    >
      {message}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  scrollingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    whiteSpace: 'nowrap',
  },
});

export default ScrollingMessage;
