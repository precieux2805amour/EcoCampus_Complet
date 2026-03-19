import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Liste d'images pour le fond d'écran
  const images = [
    { uri: 'https://lh6.googleusercontent.com/proxy/Aqi5btbwhuDbZhmfIv-nHgvFmlGsVhuycJcLi-Ky5BGefSaNreYK8IzK5uucE-jqGmFprxyvSInAX1oX0OTWuWO4gGI' },
    { uri: 'https://media.gettyimages.com/id/96573857/fr/photo/out-of-date-rotting-food-in-dustbin.jpg?s=612x612&w=gi&k=20&c=bvT_zRjTxPhAujsaAKcV0GZDqrV_G5-xycTUTKNoeBk=' },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Changer d'image de fond automatiquement toutes les 5 secondes
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ImageBackground
        source={images[currentImageIndex]}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Eco<Text style={styles.titleGreen}>Campus</Text></Text>
          <Text style={styles.logo}>🌿</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Inscription</Text>
        </TouchableOpacity>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    width,
    height,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(56, 142, 60, 0.8)', // Fond vert foncé semi-transparent
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  titleGreen: {
    color: '#A5D6A7',
  },
  logo: {
    fontSize: 36,
    color: '#FFFFFF',
  },
  button: {
    marginVertical: 10,
    width: '80%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF', // Bleu pour le bouton de connexion
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#4CAF50', // Vert pour le bouton d'inscription
  },
});

export default HomeScreen;
