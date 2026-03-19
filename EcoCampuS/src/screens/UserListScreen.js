import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getToken } from '../utils/tokenUtils';
import api from '../services/api';

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isFocused = useIsFocused();

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await api.get('/users/list', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Erreur fetch users:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchUsers();
    }
  }, [isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const filteredUsers = users.filter(user =>
    user.id.toString().includes(searchQuery)
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1B5E20" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher par ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
        keyboardType="numeric"
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => navigation.navigate('UserDetail', { user: item })}
          >
            <Text style={styles.userText}>Utilisateur ID: {item.id}</Text>
            <Text style={styles.userName}>{item.name} {item.surname}</Text>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    height: 45,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 16,
    elevation: 2,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  userText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  userName: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});

export default UserListScreen;