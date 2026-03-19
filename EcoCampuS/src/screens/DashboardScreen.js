import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import ScrollingMessage from '../screens/ScrollingMessage';

const DashboardScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(1)); // Valeur initiale de l'opacité (1)

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.855, // Réduire légèrement l'opacité pour un effet de pulsation
          duration: 500, // Durée de la transition
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1, // Retour à l'opacité 1
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Eco<Text style={styles.titleGreen}>Campus</Text>
        </Text>
        <Text style={styles.logo}>🌿</Text>
      </View>
      <View style={styles.welcomeContainer}>
        <ScrollingMessage message="Bienvenue sur le tableau de bord" />
      </View>
      <View style={styles.alertButtonContainer}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            style={styles.alertButton}
            onPress={() => navigation.navigate('Alerter')} // Naviguer vers l'écran d'alerte
          >
            <Text style={styles.alertButtonText}>Alerter</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F5E9', // Fond vert clair
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: '#388E3C', // Fond vert foncé pour l'en-tête
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF', // Texte blanc pour le titre
    fontWeight: 'bold',
  },
  titleGreen: {
    color: '#A5D6A7', // Vert clair pour "Campus"
  },
  logo: {
    fontSize: 24,
  },
  welcomeContainer: {
    marginBottom: 20,
    height: 40,
    overflow: 'hidden',
    backgroundColor: '#C8E6C9', // Fond vert clair pour le message de bienvenue
    borderRadius: 8,
    justifyContent: 'center',
  },
  alertButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertButton: {
    width: 150,  // Augmentation de la largeur du bouton pour une meilleure visibilité
    height: 150, // Augmentation de la hauteur du bouton
    borderRadius: 75, // Bordures arrondies pour garder la forme circulaire
    backgroundColor: '#B22222', // Rouge sombre pour attirer l'attention
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24, // Taille de la police augmentée pour correspondre à la taille du bouton
  },
});

export default DashboardScreen;
