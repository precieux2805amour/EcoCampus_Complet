import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  Pressable
} from 'react-native';
import { getToken } from '../utils/tokenUtils';
import api from '../services/api';

const formatDateTime = (dateString) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleString('fr-FR', options).replace(',', '');
};

const AlertDetails = ({ route, navigation }) => {
  const { alerte } = route.params;

  const updateAlertStatus = async (status) => {
    try {
      const token = await getToken();
      const response = await api.patch(
        `/alerts/${alerte.id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Alert.alert('Succès', `Statut mis à jour en "${status}".`);
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>

        {alerte.imageUrl ? (
          <Image source={{ uri: alerte.imageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.noImage}>Image non disponible</Text>
        )}

        <Text style={styles.description}>{alerte.description}</Text>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Statut</Text>
          <Text style={styles.value}>{alerte.statut}</Text>

          <Text style={styles.label}>ID</Text>
          <Text style={styles.value}>{alerte.id}</Text>

          <Text style={styles.label}>Collecteur</Text>
          <Text style={styles.value}>{alerte.collectorId}</Text>

          <Text style={styles.label}>Date création</Text>
          <Text style={styles.value}>{formatDateTime(alerte.createdAt)}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[
              styles.actionBtn,
              styles.blueBtn,
              (alerte.statut === 'en cours' || alerte.statut === 'traité') && styles.disabled
            ]}
            disabled={alerte.statut === 'en cours' || alerte.statut === 'traité'}
            onPress={() => updateAlertStatus('en cours')}
          >
            <Text style={styles.btnText}>En cours</Text>
          </Pressable>

          <Pressable
            style={[
              styles.actionBtn,
              styles.greenBtn,
              (alerte.statut === 'envoyé' || alerte.statut === 'traité') && styles.disabled
            ]}
            disabled={alerte.statut === 'envoyé' || alerte.statut === 'traité'}
            onPress={() => navigation.navigate('StatutScreen', { alerte })}
          >
            <Text style={styles.btnText}>Traité</Text>
          </Pressable>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
  },
  noImage: {
    color: 'red',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  infoBlock: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#777',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  blueBtn: {
    backgroundColor: '#1E88E5',
  },
  greenBtn: {
    backgroundColor: '#2E7D32',
  },
  disabled: {
    backgroundColor: '#BDBDBD',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AlertDetails;