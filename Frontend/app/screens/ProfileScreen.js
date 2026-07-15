import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const defaultProfile = {
  fullName: 'StayProx User',
  email: 'user@stayprox.com',
  phone: '+94 77 123 4567',
  location: 'Colombo, Sri Lanka',
  bio: 'I love finding comfortable places close to work and university.',
};

export default function ProfileScreen({ navigation, route }) {
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [profileData, setProfileData] = useState(defaultProfile);

  useEffect(() => {
    if (route?.params?.updatedProfile) {
      setProfileData(route.params.updatedProfile);
    }
  }, [route?.params?.updatedProfile]);

  const pickProfileImage = async () => {
    const permissionResponse = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResponse.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to change your profile photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.length) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.profileCard}>
          <Image
            source={profileImageUri ? { uri: profileImageUri } : require('../../assets/logo.jpg')}
            style={styles.logo}
          />
          <TouchableOpacity style={styles.changePhotoButton} onPress={pickProfileImage}>
            <Ionicons name="camera-outline" size={14} color="#fff" />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
          <Text style={styles.brandName}>{profileData.fullName}</Text>
          <Text style={styles.subTitle}>{profileData.bio}</Text>

          <View style={styles.detailList}>
            <ProfileLine icon="mail-outline" text={profileData.email} />
            <ProfileLine icon="call-outline" text={profileData.phone} />
            <ProfileLine icon="location-outline" text={profileData.location} />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuCard}>
          <MenuItem
            icon="person-outline"
            title="Edit Profile"
            onPress={() => navigation.navigate('EditProfile', { profile: profileData })}
          />
          <MenuItem icon="heart-outline" title="Saved Listings" />
          <MenuItem icon="time-outline" title="Booking History" />
          <MenuItem icon="settings-outline" title="Settings" />
          <MenuItem icon="log-out-outline" title="Logout" danger />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, title, danger = false, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={20} color={danger ? '#dc2626' : '#334155'} />
        <Text style={[styles.menuText, danger && styles.menuDanger]}>{title}</Text>
      </View>
      {!danger ? <Ionicons name="chevron-forward" size={18} color="#94a3b8" /> : null}
    </TouchableOpacity>
  );
}

function ProfileLine({ icon, text }) {
  return (
    <View style={styles.profileLine}>
      <Ionicons name={icon} size={16} color="#64748b" />
      <Text style={styles.profileLineText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f1f5f9',
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
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
  },
  logo: {
    width: 94,
    height: 94,
    borderRadius: 47,
    marginBottom: 10,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1463f3',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  changePhotoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  subTitle: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
  detailList: {
    marginTop: 12,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  profileLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  profileLineText: {
    marginLeft: 8,
    color: '#334155',
    fontSize: 13,
    fontWeight: '500',
  },
  statsRow: {
    marginTop: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    paddingVertical: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  menuCard: {
    marginTop: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  menuItem: {
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 10,
    color: '#334155',
    fontWeight: '600',
  },
  menuDanger: {
    color: '#dc2626',
  },
});
