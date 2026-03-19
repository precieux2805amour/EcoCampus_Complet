import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground } from 'react-native';
import ScrollingMessage from './ScrollingMessage';
import { getToken } from '../utils/tokenUtils';
import axios from 'axios';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as TaskManager from 'expo-task-manager';
import api from '../services/api'; // Utilisation de l'instance api configurée

const CollectorDashboard = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const LOCATION_TASK_NAME = 'background-location-task';

  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error('Erreur dans le TaskManager:', error);
      return;
    }
    if (data) {
      const { locations } = data;
      const location = locations[0];
      const { latitude, longitude } = location.coords;

      const token = await getToken();
      if (token) {
        try {
          await api.put(`/users/update-location/${user.id}`, {
            longitude,
            latitude,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Localisation mise à jour en arrière-plan');
        } catch (error) {
          console.error('Erreur lors de la mise à jour des coordonnées en arrière-plan:', error);
        }
      } else {
        console.error('Token expiré ou non trouvé, arrêt de la mise à jour de la localisation');
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
    }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await getToken();
        if (token) {
          const response = await api.get('/users/getprofil', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } else {
          console.error('Token non trouvé');
        }
      } catch (error) {
        console.error('Error fetching profile:', error.response ? error.response.data : error.message);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      let token;
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          Alert.alert('Erreur', 'Impossible d\'obtenir le token pour les notifications push!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;

        savePushToken(token);
      } else {
        Alert.alert('Erreur', 'Vous devez utiliser un appareil physique pour les notifications push');
      }
    };

    if (user) {
      registerForPushNotificationsAsync();
    }
  }, [user]);

  const savePushToken = async (pushToken) => {
    try {
      const token = await getToken();
      if (token && user) {
        await api.put(`/users/save-push-token/${user.id}`,
          { pushToken },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Token push enregistré');
      } else {
        console.error('Token ou utilisateur non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du token push:', error);
    }
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission d\'accéder à la localisation refusée');
        return;
      }

      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== 'granted') {
        setErrorMsg('Permission d\'accéder à la localisation en arrière-plan refusée');
        return;
      }

      const watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 120000,
          distanceInterval: 500,
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setLocation({ latitude, longitude });
          updateLocationInDatabase(latitude, longitude);
        }
      );

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        distanceInterval: 500,
        timeInterval: 120000,
        showsBackgroundLocationIndicator: true,
      });

      return () => {
        watchId && watchId.remove();
      };
    };

    if (user) {
      requestLocationPermission();
    }
  }, [user]);

  const updateLocationInDatabase = async (latitude, longitude) => {
    try {
      const token = await getToken();
      if (token && user) {
        await api.put(`/users/update-location/${user.id}`, {
          longitude,
          latitude,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Localisation mise à jour');
      } else {
        console.error('Token ou utilisateur non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des coordonnées:', error);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrII1nSgU9d2dKjTGHoxzaO3r5BandT5sHZw&s' }}
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Eco<Text style={styles.titleGreen}>Campus</Text></Text>
          <Text style={styles.logo}>🌿</Text>
        </View>
        {user && (
          <View style={styles.welcomeContainer}>
            <ScrollingMessage message={`Bienvenue Collecteur ${user.name} ${user.surname}`} />
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#388E3C',
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  titleGreen: {
    color: '#A5D6A7',
  },
  logo: {
    fontSize: 24,
  },
  welcomeContainer: {
    marginBottom: 20,
    height: 40,
    overflow: 'hidden',
    backgroundColor: '#C8E6C9',
    borderRadius: 8,
    justifyContent: 'center',
  },
});

export default CollectorDashboard;
