/*import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getToken();
      if (token) {
        try {
          const response = await axios.get('http://10.5.0.139:3000/users/getProfile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      {profile ? (
        <View>
          <Text>Name: {profile.name}</Text>
          <Text>Email: {profile.email}</Text>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default Profile;
*/