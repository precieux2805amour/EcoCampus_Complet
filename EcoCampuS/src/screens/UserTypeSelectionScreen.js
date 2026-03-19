/*import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import api from '../services/api'; // Utilisation de l'instance api configurée

const UserTypeSelectionScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Valeur initiale pour l'opacité

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }
    ).start();
  }, [fadeAnim]);

  const handleSelection = (userType) => {
    navigation.navigate('Login', { userType });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Eco<Text style={styles.titleGreen}>Campus</Text></Text>
        <Text style={styles.logo}>🌿</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => handleSelection('User')}>
        <Text style={styles.buttonText}>User</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.collectorButton]} onPress={() => handleSelection('Collecteur')}>
        <Text style={styles.buttonText}>Collecteur</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.adminButton]} onPress={() => handleSelection('Admin')}>
        <Text style={styles.buttonText}>Admin</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    color: 'gray',
    fontWeight: 'bold',
  },
  titleGreen: {
    color: '#4CAF50',
  },
  logo: {
    fontSize: 24,
  },
  button: {
    marginVertical: 10, // Espace vertical entre les boutons
    width: '80%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  collectorButton: {
    backgroundColor: '#FFA500', // Couleur orange pour le bouton Collecteur
  },
  adminButton: {
    backgroundColor: '#808080', // Couleur grise pour le bouton Admin
  },
});

export default UserTypeSelectionScreen;
*/