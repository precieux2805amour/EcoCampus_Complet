import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert, FlatList, TouchableOpacity, Modal } from 'react-native';
import { getToken } from '../utils/tokenUtils';
import api from '../services/api';

// Utility function to format date to 'yyyy/mm/dd hh:mm:ss'
const formatDateTime = (dateString) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return new Date(dateString).toLocaleString('fr-FR', options).replace(',', ''); // French locale + replacing the comma
};

const AlertDetailD = ({ route, navigation }) => {
  const { alerte } = route.params;
  const [collectors, setCollectors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showCollectors, setShowCollectors] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // État pour gérer l'affichage du modal

  const fetchCollectors = async () => {
    try {
      const token = await getToken();
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

      const response = await api.get('/users/collectors', {
        params: {
          updatedSince: tenMinutesAgo
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setCollectors(response.data.collectors);
        setShowCollectors(true);
        setModalVisible(true); // Afficher le modal lorsque les collecteurs sont trouvés
      } else {
        Alert.alert('Erreur',`${response.data.message || 'Aucun collecteur disponible.'}`);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = await getToken();
      const alertId =  alerte.id
      console.log(`aleryId: ${alertId}`)
      const response = await api.get(`/notif/notification/${alertId}`, {
      
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setNotifications(response.data.notifications);
        setModalVisible(true); // Afficher le modal lorsque les notifications sont trouvées
      } else {
        Alert.alert('Erreur', 'Aucune notification trouvée.');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const assignCollector = async (collector) => {
    try {
      const token = await getToken();
      const response = await api.patch(`/alerts/assign/${alerte.id}`, 
        { collectorId: collector.id }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        Alert.alert('Succès', response.data.message);
        setShowCollectors(false);
        setModalVisible(false); // Fermer le modal après l'attribution
        navigation.goBack(); // Retourner à la liste des alertes après l'attribution
      } else {
        Alert.alert('Erreur', `Réponse du serveur: ${response.status} - ${response.data.message || 'Une erreur est survenue.'}`);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error) => {
    if (error.response) {
      Alert.alert('Erreur', `Réponse du serveur: ${error.response.status} - ${error.response.data.message || error.response.data}`);
    } else if (error.request) {
      Alert.alert('Erreur', 'Aucune réponse reçue du serveur.');
    } else {
      Alert.alert('Erreur', `Erreur lors de la requête: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.detailText}>Description: {alerte.description}</Text>
      {alerte.imageUrl ? (
        <Image 
          source={{ uri: alerte.imageUrl }} 
          style={styles.alertImage} 
        />
      ) : (
        <Text style={styles.errorText}>Image non disponible</Text>
      )}
      <Text style={styles.detailText}>Identifiant: {alerte.id}</Text>
      <Text style={styles.detailText}>Collecteur ID: {alerte.collectorId}</Text>
      <Text style={styles.detailText}>Statut: {alerte.statut}</Text>
      <Text style={styles.detailText}>User ID: {alerte.userId}</Text>
      <Text style={styles.detailText}>Date de création: {formatDateTime(alerte.createdAt)}</Text>
      <Text style={styles.detailText}>Date de mise à jour: {formatDateTime(alerte.updatedAt)}</Text>
      
      <View style={styles.buttonRow}>
        <Button 
          title="NOTIFICATION" 
          onPress={fetchNotifications} 
          color="purple"
        />
        <Button 
          title="Attribuer" 
          onPress={fetchCollectors} 
          color="blue"
          disabled={alerte.statut !== 'envoyé'} // Désactiver si le statut n'est pas "envoyé"
        />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {notifications.length > 0 ? (
              <>
                <Text style={styles.modalTitle}>Notifications</Text>
                <FlatList
                  data={notifications}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                      <Text style={styles.notificationText}>{item.message}</Text>
                    </View>
                  )}
                />
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Sélectionner un Collecteur</Text>
                <FlatList
                  data={collectors}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.collectorItem} 
                      onPress={() => assignCollector(item)}
                    >
                      <Text style={styles.collectorText}>{item.name} {item.surname}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
            <Button 
              title="Fermer" 
              onPress={() => setModalVisible(false)} 
              color="red"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 12,
  },
  alertImage: {
    width: '100%', 
    height: 200,
    marginVertical: 12,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background semi-transparent
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  collectorItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  collectorText: {
    fontSize: 16,
  },
  notificationItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 16,
  },
});

export default AlertDetailD;
