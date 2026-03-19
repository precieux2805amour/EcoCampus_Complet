/*
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import api from '../services/api'; 

const RegisterForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const userData = { name, surname, tel, password };
    try {
      // Remplacez l'URL par celle de votre API
      const response = await axios.post('http://10.5.0.139:3000/users/sign-up', userData);
      //const response = await api.post('users/sign-up', userData);

      // Gérez la réponse de l'API
     console.log('Registration successful:', response.data);
      Alert.alert('Success', 'Votre compte a été créé avec succès');
      onSubmit(userData);
    } catch (error) {
      // Gérez les erreurs de l'API
       if (error.response && error.response.status === 409) {
        // Si le statut de la réponse est 409, affichez le message d'erreur de l'API
        Alert.alert('Error', error.response.data.message);
      } else {
        // Pour d'autres erreurs, affichez un message d'erreur générique
        console.error('Error during registration:', error);
        Alert.alert('Error', 'Echec de l\'enrégistrement');
      }

      }
      

  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="Numéro de téléphone"
        value={tel}
        onChangeText={setTel}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Enregistrer" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default RegisterForm;

*/