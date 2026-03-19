import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Text,
  Pressable
} from 'react-native';
import api from '../services/api';

const AlertListScreen = ({ navigation }) => {
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlertes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/alerts/show');
      const sorted = response.data.sort((a, b) => b.id - a.id);
      setAlertes(sorted);
    } catch (error) {
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

  useEffect(() => {
    fetchAlertes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlertes();
  };

  const handlePress = (alerte) => {
    navigation.navigate('AlertDetail', { alerte });
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
    <Pressable
      style={styles.card}
      onPress={() => handlePress(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.alertTitle}>
          Alerte #{item.id}
        </Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.statut) }
          ]}
        >
          <Text style={styles.statusText}>
            {item.statut}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.subText}>
          ID : {item.id}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingVertical: 20 }}
          data={alertes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  );
};

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
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'capitalize',
  },

  cardBody: {
    marginTop: 10,
  },

  subText: {
    color: '#777',
    fontSize: 14,
  },
});

export default AlertListScreen;