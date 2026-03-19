/*import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const LoginForm = ({ onSubmit, buttonStyle }) => {
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit({ tel, password });
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Numéro de téléphone"
        value={tel}
        onChangeText={setTel}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={[styles.button, buttonStyle]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default LoginForm;
*/