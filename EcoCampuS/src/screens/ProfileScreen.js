import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from 'react-native';
import api from '../services/api';
import { getToken } from '../utils/tokenUtils';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await api.get('/users/getprofil', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } else {
        setError('Token non trouvé');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Échec du chargement du profil');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'admin':
        return '#1565C0';
      case 'collector':
        return '#EF6C00';
      default:
        return '#2E7D32';
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Eco<Text style={styles.titleGreen}>Campus</Text>
        </Text>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : profile ? (
        <View style={styles.card}>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  profile.avatarUrl ||
                  'https://via.placeholder.com/150',
              }}
              style={styles.avatar}
            />
          </View>

          {/* Nom */}
          <Text style={styles.name}>
            {profile.name} {profile.surname}
          </Text>

          {/* Badge statut */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(profile.statut) }
            ]}
          >
            <Text style={styles.statusText}>
              {profile.statut.toUpperCase()}
            </Text>
          </View>

          {/* Informations */}
          <View style={styles.infoContainer}>
            <InfoRow label="Téléphone" value={profile.tel} />
            <InfoRow
              label="Créé le"
              value={new Date(profile.createdAt).toLocaleDateString()}
            />
            <InfoRow
              label="Mis à jour le"
              value={new Date(profile.updatedAt).toLocaleDateString()}
            />
          </View>

          {/* Bouton */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('ProfileUpdateForm')}
          >
            <Text style={styles.editButtonText}>
              Modifier mon profil
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Aucune donnée trouvée</Text>
      )}
    </ScrollView>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    paddingHorizontal: 16,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
  },

  titleGreen: {
    color: '#2E7D32',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  avatarContainer: {
    borderWidth: 4,
    borderColor: '#2E7D32',
    borderRadius: 100,
    padding: 4,
    marginBottom: 15,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },

  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },

  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  infoContainer: {
    width: '100%',
    marginTop: 10,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  infoLabel: {
    color: '#777',
    fontSize: 14,
  },

  infoValue: {
    color: '#333',
    fontWeight: '600',
  },

  editButton: {
    marginTop: 25,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1E88E5',
    alignItems: 'center',
  },

  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 40,
  },
});

export default ProfileScreen;