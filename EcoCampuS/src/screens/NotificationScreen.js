import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import api from '../services/api';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notif/getAdminNotifications');
      console.log('Réponse du serveur:', response.data.message);

      const sortedNotifications = response.data.notifications.sort(
        (a, b) => b.id - a.id
      );
      setNotifications(sortedNotifications);
    } catch (error) {
      if (error.response) {
        console.error('Erreur du serveur:', error.response.data.message);
      } else if (error.request) {
        console.error('Aucune réponse reçue du serveur:', error.request);
      } else {
        console.error('Erreur lors de la requête:', error.message);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 300000); // toutes les 5 min
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('NotificationDetail', { notification: item })
      }
      activeOpacity={0.8}
    >
      <Text style={styles.cardTitle}>{`Notification #${item.id}`}</Text>
      <Text style={styles.cardMessage}>
        {item.message || 'Pas de description disponible'}
      </Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() =>
            navigation.navigate('NotificationDetail', { notification: item })
          }
        >
          <Text style={styles.detailButtonText}>Voir les détails</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F9" />
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotification}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1B5E20',
  },
  cardMessage: {
    fontSize: 15,
    color: '#555',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  detailButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default NotificationScreen;