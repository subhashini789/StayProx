import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const fallbackProfile = {
  fullName: 'StayProx User',
  email: 'user@stayprox.com',
  phone: '+94 77 123 4567',
  location: 'Colombo, Sri Lanka',
  bio: 'I love finding comfortable places close to work and university.',
};

export default function EditProfileScreen({ navigation, route }) {
  const profile = route?.params?.profile ?? fallbackProfile;
  const [form, setForm] = useState(profile);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.fullName.trim() || !form.email.trim()) {
      Alert.alert('Missing fields', 'Name and email are required.');
      return;
    }

    navigation.navigate({
      name: 'Profile',
      params: { updatedProfile: form },
      merge: true,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.formCard}>
            <FormInput
              label="Full Name"
              value={form.fullName}
              onChangeText={(value) => updateField('fullName', value)}
              placeholder="Enter your full name"
            />
            <FormInput
              label="Email"
              value={form.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FormInput
              label="Phone"
              value={form.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
            <FormInput
              label="Location"
              value={form.location}
              onChangeText={(value) => updateField('location', value)}
              placeholder="Enter your location"
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.bio}
              onChangeText={(value) => updateField('bio', value)}
              placeholder="Write a short bio"
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormInput(props) {
  const { label, ...inputProps } = props;
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#94a3b8" {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerRow: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSpacer: {
    width: 38,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
  },
  fieldWrap: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    color: '#334155',
    fontWeight: '700',
    fontSize: 13,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#dbe3ef',
    borderRadius: 12,
    backgroundColor: '#fcfdff',
    paddingHorizontal: 12,
    color: '#0f172a',
  },
  textArea: {
    height: 110,
    paddingTop: 10,
  },
  saveButton: {
    marginTop: 14,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1463f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
