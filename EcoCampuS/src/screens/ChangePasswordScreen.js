import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import d'une icône de visibilité
import api from '../services/api'; // Import de l'instance API configurée
import { getToken } from '../utils/tokenUtils';

const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Erreur', 'Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    try {
      const token = await getToken();
      if (token) {
        await api.put(
          '/users/change-password',
          { oldPassword, newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Alert.alert('Succès', 'Votre mot de passe a été changé avec succès.');

        // Réinitialiser les champs après succès
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');

        navigation.goBack(); // Retourner à l'écran précédent
      } else {
        console.error('Token non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error.response ? error.response.data : error.message);
      Alert.alert('Erreur', 'Une erreur est survenue lors du changement de mot de passe.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Changer le Mot de Passe</Text>
      
      {/* Ancien mot de passe */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ancien mot de passe"
          secureTextEntry={!oldPasswordVisible}
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TouchableOpacity
          style={styles.visibilityToggle}
          onPress={() => setOldPasswordVisible(!oldPasswordVisible)}
        >
          <MaterialIcons
            name={oldPasswordVisible ? 'visibility' : 'visibility-off'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      
      {/* Nouveau mot de passe */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nouveau mot de passe"
          secureTextEntry={!newPasswordVisible}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity
          style={styles.visibilityToggle}
          onPress={() => setNewPasswordVisible(!newPasswordVisible)}
        >
          <MaterialIcons
            name={newPasswordVisible ? 'visibility' : 'visibility-off'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      
      {/* Confirmer nouveau mot de passe */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirmer nouveau mot de passe"
          secureTextEntry={!confirmNewPasswordVisible}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
        />
        <TouchableOpacity
          style={styles.visibilityToggle}
          onPress={() => setConfirmNewPasswordVisible(!confirmNewPasswordVisible)}
        >
          <MaterialIcons
            name={confirmNewPasswordVisible ? 'visibility' : 'visibility-off'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <Button title="Changer le mot de passe" onPress={handleChangePassword} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#4CAF50',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  visibilityToggle: {
    marginLeft: 8,
  },
});

export default ChangePasswordScreen;
