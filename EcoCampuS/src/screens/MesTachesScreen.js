import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
  ActivityIndicator
} from 'react-native';
import api from '../services/api';

const MesTachesScreen = ({ navigation }) => {
  const [alerts, setAlerts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const response = await api.get(`/alerts/showC`);
      const sortedAlerts = response.data.sort((a, b) => b.id - a.id);
      setAlerts(sortedAlerts);
    } catch (error) {
      console.error("Erreur lors de la récupération des alertes :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 300000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case "envoyé":
        return "#D32F2F";
      case "en cours":
        return "#616161";
      case "traité":
        return "#2E7D32";
      default:
        return "#000";
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate('AlertDetails', { alerte: item })}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Alerte #{item.id}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.statut) }]}>
          <Text style={styles.badgeText}>{item.statut}</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>ID Collecteur : {item.collectorId}</Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    paddingHorizontal: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  subtitle: {
    marginTop: 8,
    color: '#777',
    fontSize: 14,
  },
});

export default MesTachesScreen;