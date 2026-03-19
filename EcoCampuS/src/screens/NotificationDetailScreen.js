import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

const NotificationDetailScreen = ({ route, navigation }) => {
  const { notification } = route.params;
  const [loading, setLoading] = useState(false);
  const [alerte, setAlerte] = useState(null);

  const fetchAlert = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/alerts/getAlertById/${notification.alertId}`);
      setAlerte(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'alerte :', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAlert();
    }, [notification.alertId])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F9" />
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Détails de la Notification</Text>
          <Text style={styles.message}>{notification.message}</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#1B5E20" style={{ marginTop: 20 }} />
          ) : (
            <View style={{ marginTop: 16 }}>
              {alerte ? (
                <View>
                  <Text style={styles.label}>Description de l'alerte :</Text>
                  <Text style={styles.detail}>{alerte.description}</Text>

                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() => navigation.navigate('AlertDetailD', { alerte })}
                  >
                    <Text style={styles.detailButtonText}>Consulter l'alerte</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.noAlertText}>Aucune alerte trouvée.</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#1B5E20',
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  detailButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noAlertText: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
});

export default NotificationDetailScreen;