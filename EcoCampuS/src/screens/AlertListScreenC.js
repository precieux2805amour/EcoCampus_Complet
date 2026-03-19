import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
  Text,
  Pressable
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getToken } from '../utils/tokenUtils';
import api from '../services/api';

const AlertListScreenC = ({ navigation }) => {
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAlertes, setFilteredAlertes] = useState([]);

  const fetchAlertes = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await api.get('/alerts/allc', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const sortedAlertes = response.data.sort((a, b) => b.id - a.id);
      setAlertes(sortedAlertes);
      setFilteredAlertes(sortedAlertes);
    } catch (error) {
      console.error("Erreur récupération alertes: ", error);
      Alert.alert(
        'Erreur',
        error.response?.data?.message ||
        "Une erreur est survenue lors de la récupération des alertes"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAlertes();
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAlertes();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlertes();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = alertes.filter(alerte =>
        alerte.id.toString().includes(query)
      );
      setFilteredAlertes(filtered);
    } else {
      setFilteredAlertes(alertes);
    }
  };

  const handlePress = (alerte) => {
    navigation.navigate('AlertDetails', { alerte });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'envoyé':
        return '#D32F2F';
      case 'en cours':
        return '#616161';
      case 'traité':
        return '#2E7D32';
      default:
        return '#000';
    }
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.card} onPress={() => handlePress(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.alertTitle}>Alerte #{item.id}</Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.statut) }
          ]}
        >
          <Text style={styles.statusText}>{item.statut}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.infoText}>ID : {item.id}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#1E88E5" />
      ) : (
        <View style={styles.content}>
          <TextInput
            style={styles.searchBar}
            placeholder="Rechercher une alerte par ID"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearch}
          />

          <FlatList
            data={filteredAlertes}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 25, // ✅ INPUT DESCENDU ICI
  },

  searchBar: {
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  cardBody: {
    marginTop: 10,
  },

  infoText: {
    fontSize: 14,
    color: '#777',
  },
});

export default AlertListScreenC;