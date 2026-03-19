import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '../utils/tokenUtils';
import api from '../services/api';

const UserDetailScreen = ({ route, navigation }) => {
  const { user, onUserDeleted } = route.params;
  const userId = user.id;

  const [loading, setLoading] = useState(false);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const handleAction = async (endpoint, message) => {
    try {
      setLoading(true);
      const token = await getToken();

      await api.patch(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert("Succès", message);
      if (onUserDeleted) onUserDeleted();
      navigation.goBack();

    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeactivate = () => {
    Alert.alert(
      'Confirmer la désactivation',
      'Êtes-vous sûr de vouloir désactiver cet utilisateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () =>
            handleAction(`/users/${userId}`, "Utilisateur désactivé.")
        }
      ]
    );
  };

  const confirmActivate = () => {
    Alert.alert(
      'Confirmer l’activation',
      'Réactiver cet utilisateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () =>
            handleAction(`/users/active/${userId}`, "Utilisateur activé.")
        }
      ]
    );
  };

  const getRoleColor = () => {
    switch (user.statut) {
      case 'admin': return '#1E88E5';
      case 'collector': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.card}>

        <View style={styles.headerRow}>
          <Text style={styles.title}>Détails Utilisateur</Text>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor() }]}>
            <Text style={styles.roleText}>{user.statut.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>ID</Text>
          <Text style={styles.value}>{user.id}</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Nom complet</Text>
          <Text style={styles.value}>{user.name} {user.surname}</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Téléphone</Text>
          <Text style={styles.value}>{user.tel}</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Statut du compte</Text>
          <Text style={[
            styles.value,
            { color: user.isActive ? '#2E7D32' : '#C62828' }
          ]}>
            {user.isActive ? "Actif" : "Inactif"}
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Créé le</Text>
          <Text style={styles.value}>{formatDateTime(user.createdAt)}</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Dernière mise à jour</Text>
          <Text style={styles.value}>{formatDateTime(user.updatedAt)}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              user.isActive ? styles.deactivateButton : styles.disabledButton
            ]}
            onPress={confirmDeactivate}
            disabled={!user.isActive || loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> :
              <>
                <Ionicons name="close-circle" size={18} color="#fff" />
                <Text style={styles.buttonText}> Désactiver</Text>
              </>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              !user.isActive ? styles.activateButton : styles.disabledButton
            ]}
            onPress={confirmActivate}
            disabled={user.isActive || loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> :
              <>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.buttonText}> Activer</Text>
              </>
            }
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
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
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  infoBlock: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#777',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 25,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.48,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deactivateButton: {
    backgroundColor: '#D32F2F',
  },
  activateButton: {
    backgroundColor: '#2E7D32',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default UserDetailScreen;