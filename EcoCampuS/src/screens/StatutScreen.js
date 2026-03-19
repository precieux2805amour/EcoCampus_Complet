import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '../utils/tokenUtils';
import api from '../services/api';

const StatutScreen = ({ route, navigation }) => {
  const { alerte } = route.params;

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission refusée',
        "L'accès à la caméra est nécessaire pour continuer."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!image) {
      Alert.alert('Photo requise', 'Veuillez prendre une photo avant validation.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: `alert-${alerte.id}.jpg`,
        type: 'image/jpeg',
      });

      const token = await getToken();

      await api.patch(`/alerts/${alerte.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Succès', 'Alerte marquée comme traitée.');
      navigation.goBack();

    } catch (error) {
      console.error(error);
      Alert.alert(
        'Erreur',
        "Impossible de mettre à jour l'alerte. Vérifiez votre connexion."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Eco<Text style={styles.titleGreen}>Campus</Text>
        </Text>
        <Text style={styles.subtitle}>Validation d'intervention</Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Alerte #{alerte.id}</Text>

        {/* IMAGE PREVIEW */}
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={50} color="#aaa" />
            <Text style={styles.placeholderText}>
              Aucune photo prise
            </Text>
          </View>
        )}

        {/* BUTTON PHOTO */}
        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
          <Ionicons name="camera" size={20} color="#fff" />
          <Text style={styles.buttonText}>Prendre une photo</Text>
        </TouchableOpacity>

        {/* BUTTON SAVE */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!image || loading) && { opacity: 0.6 }
          ]}
          onPress={handleSave}
          disabled={!image || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Valider l’intervention</Text>
            </>
          )}
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f6f8',
    padding: 20,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  titleGreen: {
    color: '#2E7D32',
  },
  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 15,
  },
  placeholder: {
    height: 220,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  placeholderText: {
    marginTop: 10,
    color: '#999',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#455A64',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    padding: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default StatutScreen;