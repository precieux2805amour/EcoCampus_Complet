import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Alert, Text, Animated, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { getToken } from '../utils/tokenUtils';
import api from '../services/api';

const AlertScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); 
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erreur', 'Permission d\'accès à la localisation refusée');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        setLocation(location);
      } else {
        Alert.alert('Erreur', 'Impossible de récupérer la localisation.');
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la localisation:", error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération de la localisation.');
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

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

  const handleCreateAlert = useCallback(async () => {
    if (!location || !image) {
      Alert.alert('Erreur', 'La localisation ou l\'image est manquante');
      return;
    }

    setLoading(true); 

    let formData = new FormData();
    formData.append('description', description);
    formData.append('latitude', location.coords.latitude);
    formData.append('longitude', location.coords.longitude);
    formData.append('image', {
      uri: image,
      name: 'alert.jpg',
      type: 'image/jpeg'
    });

    const token = await getToken();

    try {
      const response = await api.post('/alerts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      Alert.alert('Succès', response.data.message);
      setDescription('');
      setImage(null);
      fetchLocation();
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Erreur', error.response && error.response.data ? error.response.data.message : "Une erreur est survenue");
      setDescription('');
      setImage(null);
      fetchLocation();
    } finally {
      setLoading(false); 
    }
  }, [description, image, location, navigation, fetchLocation]);

  const pickImage = useCallback(async () => {
    let { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Permission d\'accès à l\'appareil photo refusée');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
  allowsEditing: false,
  quality: 0.8,
});

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      console.log("La capture d'image a été annulée ou aucun asset trouvé");
    }
  }, []);

  const handleCancel = () => {
    setDescription('');
    setImage(null);
    setLocation(null);
    fetchLocation();
    navigation.goBack();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Eco<Text style={styles.titleGreen}>Campus</Text></Text>
        <Text style={styles.logo}>🌿</Text>
      </View>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Ajouter une description"
        placeholderTextColor="#A8A8A8"
      />
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Prendre une photo</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {loading && <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleCreateAlert}>
          <Text style={styles.submitButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8F5', 
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
    fontSize: 28,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  titleGreen: {
    color: '#388E3C',
  },
  logo: {
    fontSize: 30,
  },
  input: {
    height: 45,
    borderColor: '#388E3C',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    color: '#000',
    width: '85%',
  },
  imageButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    width: '85%',
    marginTop: 30,
  },
  cancelButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default AlertScreen;
