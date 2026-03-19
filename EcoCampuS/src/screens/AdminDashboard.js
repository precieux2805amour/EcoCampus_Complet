import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ImageBackground, Dimensions } from 'react-native';
import ScrollingMessage from './ScrollingMessage';
import { getToken } from '../utils/tokenUtils';
import api from '../services/api';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const { width, height } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const [alertes, setAlertes] = useState([]);
  const [utilisateur, setUtilisateur] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    { uri: 'https://lh6.googleusercontent.com/proxy/Aqi5btbwhuDbZhmfIv-nHgvFmlGsVhuycJcLi-Ky5BGefSaNreYK8IzK5uucE-jqGmFprxyvSInAX1oX0OTWuWO4gGI' },
    { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrII1nSgU9d2dKjTGHoxzaO3r5BandT5sHZw&s' },
  ];

  // ===============================
  // ENREGISTRER LE PUSH TOKEN
  // ===============================

  const savePushToken = async (pushToken) => {

    console.log("Push token reçu pour sauvegarde :", pushToken);

    if (!pushToken) {
      console.error('Push token non disponible');
      return;
    }

    try {

      const token = await getToken();

      console.log("JWT utilisateur :", token);
      console.log("Utilisateur :", utilisateur);

      if (token && utilisateur) {

        const response = await api.put(
          `/users/save-push-token/${utilisateur.id}`,
          { pushToken },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('Token push enregistré avec succès', response.data);

      } else {

        console.error('Token ou utilisateur non trouvé');

      }

    } catch (error) {

      console.error(
        'Erreur lors de l\'enregistrement du token push:',
        error.response ? error.response.data : error.message
      );

    }
  };

  // ===============================
  // RECUPERER TOKEN EXPO
  // ===============================

  const registerForPushNotificationsAsync = async () => {

    console.log("Demande de push token lancée");

    if (!Device.isDevice) {

      Alert.alert('Erreur', 'Les notifications push nécessitent un appareil physique');
      return;

    }

    try {

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {

        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;

      }

      if (finalStatus !== 'granted') {

        Alert.alert('Erreur', 'Permission refusée pour les notifications');
        return;

      }

      const { data: expoToken } = await Notifications.getExpoPushTokenAsync();

      console.log("Expo push token obtenu :", expoToken);

      if (expoToken && expoToken.startsWith('ExponentPushToken')) {

        savePushToken(expoToken);

      } else {

        console.error("Token Expo invalide :", expoToken);

      }

    } catch (error) {

      console.error("Erreur récupération push token :", error);

    }

  };

  // ===============================
  // RECUPERER PROFIL UTILISATEUR
  // ===============================

  useEffect(() => {

    const fetchUserProfile = async () => {

      try {

        const token = await getToken();

        if (!token) {
          console.error('Token non trouvé');
          return;
        }

        const response = await api.get('/users/getprofil', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Profil utilisateur :", response.data);

        setUtilisateur(response.data);

      } catch (error) {

        console.error(
          'Erreur récupération profil:',
          error.response ? error.response.data : error.message
        );

      }

    };

    fetchUserProfile();

  }, []);

  // ===============================
  // LANCER PUSH TOKEN
  // ===============================

  useEffect(() => {

    console.log("Utilisateur chargé :", utilisateur);

    if (utilisateur) {

      registerForPushNotificationsAsync();

    }

  }, [utilisateur]);

  // ===============================
  // DIAPORAMA
  // ===============================

  useEffect(() => {

    const intervalId = setInterval(() => {

      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % images.length
      );

    }, 5000);

    return () => clearInterval(intervalId);

  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={images[currentImageIndex]}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Eco<Text style={styles.titleGreen}>Campus</Text></Text>
          <Text style={styles.logo}>🌿</Text>
        </View>

        {utilisateur && (
          <View style={styles.welcomeContainer}>
            <ScrollingMessage message={`Bienvenue Admin ${utilisateur.name} ${utilisateur.surname}`} />
          </View>
        )}

        <FlatList
          data={alertes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.alertItem}>
              <Text style={styles.alertText}>{item.description}</Text>
            </View>
          )}
        />

      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    width,
    height
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(56, 142, 60, 0.8)',
    padding: 15,
    borderRadius: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },

  titleGreen: {
    color: '#A5D6A7'
  },

  logo: {
    fontSize: 36,
    color: '#FFFFFF'
  },

  welcomeContainer: {
    marginBottom: 20,
    height: 40,
    overflow: 'hidden',
    backgroundColor: 'rgba(200, 230, 201, 0.8)',
    borderRadius: 8,
    justifyContent: 'center',
  },

  alertItem: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  alertText: {
    color: '#4CAF50'
  },
});

export default AdminDashboard;