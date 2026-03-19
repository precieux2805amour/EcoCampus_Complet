import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getToken } from '../utils/tokenUtils';
import api from '../services/api';
import { isValidPhoneNumber } from 'libphonenumber-js';

const ProfileUpdateForm = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [passwordError, setPasswordError] = useState(false);
  const [fieldError, setFieldError] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getToken();
      setToken(fetchedToken);
    };
    fetchToken();
  }, []);

  const handleUpdate = async () => {
    setPasswordError(false);
    setFieldError(false);

    if (!password || (!name && !surname && !tel)) {
      if (!password) setPasswordError(true);
      if (!name && !surname && !tel) setFieldError(true);

      Alert.alert(
        'Erreur',
        'Le mot de passe et au moins un autre champ doivent être remplis'
      );
      return;
    }

    if (tel && !isValidPhoneNumber(tel, 'BJ')) {
      Alert.alert(
        'Erreur',
        'Veuillez entrer un numéro valide pour le Bénin'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.patch(
        '/users/updateprofil',
        { name, surname, tel, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Alert.alert('Succès', 'Profil mis à jour avec succès', [
          {
            text: 'OK',
            onPress: () => {
              setName('');
              setSurname('');
              setTel('');
              setPassword('');
              navigation.navigate('Mon Profil');
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Erreur',
        error.response?.data?.message ||
          'Une erreur s’est produite lors de la mise à jour'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>
          Mettre à jour le profil
        </Text>

        <View style={styles.card}>
          <InputField placeholder="Nom" value={name} onChangeText={setName} />
          <InputField placeholder="Prénom" value={surname} onChangeText={setSurname} />

          <InputField
            placeholder="Numéro de téléphone"
            keyboardType="phone-pad"
            value={tel}
            onChangeText={setTel}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mot de passe"
              placeholderTextColor="#888"
              value={password}
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeButton}
            >
              <Text style={{ fontSize: 18 }}>
                {isPasswordVisible ? '👁️' : '🙈'}
              </Text>
            </TouchableOpacity>
          </View>

          {passwordError && (
            <Text style={styles.errorText}>
              Le mot de passe est obligatoire.
            </Text>
          )}

          {fieldError && (
            <Text style={styles.errorText}>
              Au moins un autre champ doit être rempli.
            </Text>
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                Enregistrer les modifications
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const InputField = ({ ...props }) => (
  <TextInput
    style={styles.input}
    placeholderTextColor="#888"
    {...props}
  />
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F4F6FA',
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  input: {
    height: 50,
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },

  eyeButton: {
    position: 'absolute',
    right: 15,
  },

  saveButton: {
    marginTop: 15,
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  errorText: {
    color: '#D32F2F',
    marginBottom: 10,
    fontSize: 13,
  },
});

export default ProfileUpdateForm;