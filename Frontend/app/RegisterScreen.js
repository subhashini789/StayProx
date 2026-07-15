import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import api from '../services/api';

const primaryBlue = '#1463f3';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('tenant');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => name.trim() && email.trim() && password.trim() && confirmPassword.trim(),
    [name, email, password, confirmPassword]
  );

  const registerUser = async () => {
    if (!canSubmit) {
      Alert.alert('Missing details', 'Please complete all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Please make sure both passwords match.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      const registeredEmail = response?.data?.user?.email || email.trim();
      navigation.reset({
        index: 0,
        routes: [
          { name: 'Login', params: { registeredEmail } },
        ],
      });
    } catch (error) {
      Alert.alert('Registration failed', error?.response?.data?.message || 'Please try again.');
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

        <Text style={styles.heading}>Create account</Text>
        <Text style={styles.subheading}>Register to browse and book your next room.</Text>

        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'tenant' && styles.roleButtonActive]}
            onPress={() => setRole('tenant')}
          >
            <Text style={[styles.roleText, role === 'tenant' && styles.roleTextActive]}>Tenant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'owner' && styles.roleButtonActive]}
            onPress={() => setRole('owner')}
          >
            <Text style={[styles.roleText, role === 'owner' && styles.roleTextActive]}>Owner</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor="#97a4ba"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#97a4ba"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#97a4ba"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor="#97a4ba"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={registerUser}
          disabled={!canSubmit || isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Registering...' : 'Register'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.switchText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

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
    marginBottom: 18,
    fontSize: 14,
  },
  roleRow: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  roleButton: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#fff',
  },
  roleText: {
    color: '#64748b',
    fontWeight: '700',
  },
  roleTextActive: {
    color: '#0f172a',
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
