import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import api from '../services/api';
import { setAuthSession } from '../services/authStore';

const primaryBlue = '#1463f3';

const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState(route?.params?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const isValid = useMemo(() => email.trim() && password.trim(), [email, password]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!isValid) {
      Alert.alert('Missing details', 'Please enter your email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      setAuthSession(response.data);
      const nextScreen = response.data.user?.role === 'owner' ? 'Dashboard' : 'Home';
      navigation.replace(nextScreen);
    } catch (error) {
      Alert.alert('Login failed', error?.response?.data?.message || 'Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <View style={styles.brandRow}>
          <Image source={require('../assets/logo.jpg')} style={styles.logoBadge} />
          <Text style={styles.brand}>StayProx</Text>
        </View>

        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subheading}>Log in to continue your stay search.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#97a4ba"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#97a4ba"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!isValid || isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.switchText}>No account yet? Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  brand: {
    marginLeft: 12,
    fontSize: 25,
    fontWeight: '800',
    color: '#111827',
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subheading: {
    color: '#5f6f89',
    marginBottom: 20,
    fontSize: 14,
  },
  label: {
    color: '#1e2c45',
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6deea',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 12,
    color: '#111827',
    backgroundColor: '#fdfefe',
  },
  button: {
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: primaryBlue,
    paddingVertical: 14,
  },
  buttonDisabled: {
    backgroundColor: '#89adef',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  switchText: {
    marginTop: 16,
    textAlign: 'center',
    color: primaryBlue,
    fontWeight: '600',
  },
});

export default LoginScreen;
