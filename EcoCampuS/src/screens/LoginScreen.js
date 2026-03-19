import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import { saveToken } from '../utils/tokenUtils';
import api from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!tel || !password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/users/login', { tel, password });

      const { token, statut } = response.data;

      await saveToken(token);

      setTel('');
      setPassword('');

      if (statut === 'user') {
        navigation.replace('UserDashboard');
      } else if (statut === 'collector') {
        navigation.replace('CollectorDashboard');
      } else if (statut === 'admin') {
        navigation.replace('AdminDashboard');
      } else {
        Alert.alert('Erreur', 'Statut utilisateur inconnu');
      }

    } catch (error) {
      if (error.response) {
        const message = error.response.data.message;

        if (message === "Invalid credentials") {
          Alert.alert('Erreur', 'Mot de passe incorrect');
        } else {
          Alert.alert('Erreur', message);
        }
      } else {
        Alert.alert('Erreur', 'Serveur inaccessible');
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
          <View style={styles.header}>
            <Text style={styles.title}>
              <Text style={styles.titleEco}>Eco</Text>
              <Text style={styles.titleCampus}>Campus</Text>
            </Text>
            <Text style={styles.logo}>🌿</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Numéro de téléphone"
              value={tel}
              onChangeText={setTel}
              keyboardType="phone-pad"
              autoCapitalize="none"
              placeholderTextColor="#A9A9A9"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                placeholderTextColor="#A9A9A9"
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Text style={styles.toggleButtonText}>
                  {isPasswordVisible ? '👁️' : '🙈'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                styles.loginButton,
                loading && styles.buttonDisabled
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Se connecter</Text>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start', // 🔥 remonte le contenu
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  header: {
    marginTop: 60,
    marginBottom: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#388E3C',
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  titleEco: {
    color: '#FFFFFF',
  },
  titleCampus: {
    color: '#C0C0C0',
  },
  logo: {
    fontSize: 28,
  },
  form: {
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#A9A9A9',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#A9A9A9',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    height: 50,
  },
  passwordInput: {
    flex: 1,
    color: '#333333',
  },
  toggleButtonText: {
    fontSize: 18,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    backgroundColor: '#81C784',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});