import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import api from '../services/api';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [statut, setStatut] = useState('user');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isValidPassword = (pwd) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleSignUp = async () => {
    if (!name || !surname || !tel || !password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    if (!isValidPhoneNumber(tel, 'BJ')) {
      Alert.alert('Erreur', 'Numéro de téléphone invalide (Bénin)');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert(
        'Erreur',
        'Mot de passe : 8 caractères minimum avec lettres, chiffres et symbole'
      );
      return;
    }

    const formattedPhone = parsePhoneNumber(tel, 'BJ').number;

    setLoading(true);

    try {
      await api.post('/users/sign-up', {
        name,
        surname,
        tel: formattedPhone,
        password,
        statut
      });

      Alert.alert('Succès', 'Compte créé avec succès');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inscription</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={surname}
        onChangeText={setSurname}
      />

      <TextInput
        style={styles.input}
        placeholder="Téléphone (ex: 97XXXXXX)"
        keyboardType="phone-pad"
        value={tel}
        onChangeText={setTel}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Mot de passe"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Text>{isPasswordVisible ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>

      <Picker
        selectedValue={statut}
        onValueChange={setStatut}
        style={styles.picker}
      >
        <Picker.Item label="User" value="user" />
        <Picker.Item label="Collector" value="collector" />
        <Picker.Item label="Admin" value="admin" />
      </Picker>

      <Button title="Créer le compte" onPress={handleSignUp} color="#4CAF50" />

      {loading && <ActivityIndicator size="large" color="#4CAF50" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  picker: {
    height: 48,
    marginBottom: 12
  }
});

export default SignUpScreen;
