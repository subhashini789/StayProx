import React, { useState, useEffect } from 'react';
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
import api from '../../services/api';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

export default function AddBoardingScreen({ navigation, route }) {
  const existingRoom = route?.params?.room;
  const [title, setTitle] = useState(existingRoom?.title || '');
  const [location, setLocation] = useState(existingRoom?.location || '');
  const [price, setPrice] = useState(existingRoom?.price?.toString() || '');
  const [description, setDescription] = useState(existingRoom?.description || '');
  const [contact, setContact] = useState(existingRoom?.contact || '');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // local URIs

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Camera roll permissions are required to upload images.');
        }
      }
    })();
  }, []);

  const submitBoarding = async () => {
    if (!title.trim() || !location.trim() || !price.trim()) {
      Alert.alert('Missing details', 'Title, location and price are required.');
      return;
    }

      try {
      setLoading(true);
      const requestData = {
        title: title.trim(),
        location: location.trim(),
        price: Number(price),
        description: description.trim(),
        contact: contact.trim(),
      };
      // if images selected, upload them first and attach returned URLs
      if (images.length) {
        const form = new FormData();
        images.forEach((uri, idx) => {
          const filename = uri.split('/').pop();
          const match = filename?.match(/\.([0-9A-Za-z]+)$/);
          const ext = match ? match[1] : 'jpg';
          const name = `image_${Date.now()}_${idx}.${ext}`;
          form.append('images', {
            uri,
            name,
            type: `image/${ext}`,
          });
        });

        const uploadRes = await api.post('/rooms/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        requestData.images = uploadRes.data;
      }
      if (existingRoom?._id) {
        const response = await api.put(`/rooms/${existingRoom._id}`, requestData);
        // navigate back to dashboard and merge the updated room into the list
        navigation.navigate('Dashboard', { newRoom: response.data });
      } else {
        const response = await api.post('/rooms', requestData);
        // navigate back to dashboard and prepend the new room to the list
        navigation.navigate('Dashboard', { newRoom: response.data });
      }
    } catch (error) {
      Alert.alert('Failed', error?.response?.data?.message || 'Could not save boarding.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
      });

      if (!result.cancelled) {
        setImages((prev) => [result.uri, ...prev]);
      }
    } catch (err) {
      console.warn('Image pick error', err);
    }
  };

  const removeImage = (uri) => setImages((prev) => prev.filter((u) => u !== uri));

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Boarding</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Images</Text>
            <View style={styles.imagesRow}>
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <Ionicons name="camera" size={20} color="#fff" />
                <Text style={styles.imagePickerText}>Add Image</Text>
              </TouchableOpacity>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesPreview}>
                {images.map((uri) => (
                  <View key={uri} style={styles.thumbWrap}>
                    <Image source={{ uri }} style={styles.thumb} />
                    <TouchableOpacity style={styles.removeThumb} onPress={() => removeImage(uri)}>
                      <Text style={styles.removeThumbText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
            <Field label="Title" value={title} onChangeText={setTitle} placeholder="Cozy private room" />
            <Field label="Location" value={location} onChangeText={setLocation} placeholder="Colombo 06" />
            <Field
              label="Monthly Price"
              value={price}
              onChangeText={setPrice}
              placeholder="25000"
              keyboardType="numeric"
            />
            <Field
              label="Contact"
              value={contact}
              onChangeText={setContact}
              placeholder="+94 77 123 4567"
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add room details and facilities"
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={submitBoarding} disabled={loading}>
            <Text style={styles.submitButtonText}>{loading ? 'Saving...' : 'Save Boarding'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#94a3b8" {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f5f9' },
  flex: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  headerSpacer: { width: 38 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 14 },
  fieldWrap: { marginBottom: 10 },
  label: { marginBottom: 6, color: '#334155', fontWeight: '700', fontSize: 13 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#dbe3ef',
    borderRadius: 12,
    backgroundColor: '#fcfdff',
    paddingHorizontal: 12,
    color: '#0f172a',
  },
  multiline: { height: 100, paddingTop: 10 },
  imagesRow: { marginTop: 10, marginBottom: 8 },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1463f3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  imagePickerText: { color: '#fff', marginLeft: 8, fontWeight: '700' },
  imagesPreview: { marginLeft: 12, height: 70 },
  thumbWrap: { marginLeft: 8, position: 'relative' },
  thumb: { width: 70, height: 70, borderRadius: 8 },
  removeThumb: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  removeThumbText: { color: '#f43f5e', fontWeight: '800' },
  submitButton: {
    marginTop: 14,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1463f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
