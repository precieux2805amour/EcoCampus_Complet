import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { isValidPhoneNumber } from 'libphonenumber-js';
import api from '../services/api';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [tel, setTel] = useState('0167650562'); // Valeur par défaut
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidPassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async () => {
    if (loading) return;

    if (!name || !surname || !tel || !password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    if (!isValidPhoneNumber(tel, 'BJ')) {
      Alert.alert('Erreur', 'Numéro de téléphone invalide pour le Bénin');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert(
        'Erreur',
        'Mot de passe : minimum 8 caractères avec lettres, chiffres et caractère spécial'
      );
      return;
    }

    setLoading(true);

    try {
      await api.post('/users/sign-up', {
        name,
        surname,
        tel,
        password
      });

      Alert.alert('Succès', 'Compte créé avec succès');
      navigation.navigate('Home');

    } catch (error) {
      if (error.response?.data?.message) {
        Alert.alert('Erreur', error.response.data.message);
      } else {
        Alert.alert('Erreur', 'Échec de l’enregistrement');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>EcoCampus 🌿</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Prénom"
              placeholderTextColor="#999"
              value={surname}
              onChangeText={setSurname}
            />

            <TextInput
              style={styles.input}
              placeholder="Numéro de téléphone (ex: 0167650562)"
              placeholderTextColor="#999"
              value={tel}
              onChangeText={setTel}
              keyboardType="phone-pad"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Mot de passe"
                placeholderTextColor="#999"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Text style={styles.eyeIcon}>
                  {isPasswordVisible ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Créer un compte</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#F1F8E9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 40,
    color: '#2E7D32'
  },
  form: {
    width: '100%',
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
    color: '#000',
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
    height: 55,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000'
  },
  eyeIcon: {
    fontSize: 18
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#81C784'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17
  }
});

export default RegisterScreen;