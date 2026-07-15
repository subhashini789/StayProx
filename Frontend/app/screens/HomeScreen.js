import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { clearAuthSession, getAuthSession, subscribeAuthSession } from '../../services/authStore';

const categories = ['Single Room', 'Entire House'];
const bottomTabs = [
  { key: 'EXPLORE', icon: 'compass' },
  { key: 'BOOKINGS', icon: 'calendar' },
  { key: 'DASHBOARD', icon: 'grid' },
  { key: 'PROFILE', icon: 'person' },
];
const listItems = [
  {
    id: '1',
    title: 'Skyline Modern Studio',
    location: 'Quezon City, Metro Manila',
    price: 'PHP 12,500',
    rating: '4.9',
    perks: ['FAST WIFI', 'AC INCLUDED'],
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '2',
    title: 'The Hub Co-Living',
    location: 'University Belt, Manila',
    price: 'PHP 4,800',
    rating: '4.7',
    perks: ['FREE WATER', 'LAUNDRY'],
    image:
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '3',
    title: 'Zen Solo Suites',
    location: 'Makati City, PH',
    price: 'PHP 8,200',
    rating: '4.8',
    perks: ['24/7 SECURITY', 'KITCHENETTE'],
    image:
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function HomeScreen({ navigation, route }) {
  const [selectedCategory, setSelectedCategory] = useState('Single Room');
  const [authSession, setAuthSession] = useState(getAuthSession());

  useEffect(() => {
    const unsubscribe = subscribeAuthSession(setAuthSession);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (route?.params?.registrationSuccess) {
      Alert.alert('Registration successful', 'Your account has been created successfully.');
      navigation.setParams({ registrationSuccess: false });
    }
  }, [navigation, route?.params?.registrationSuccess]);

  const isOwner = authSession?.user?.role === 'owner';
  const isLoggedIn = Boolean(authSession?.token);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.brandWrap}>
            <View style={styles.logoBadge}>
              <Image source={require('../../assets/logo.jpg')} style={styles.logoBadgeImage} />
            </View>
            <Text style={styles.brandText}>StayProx</Text>
          </View>
          <View style={styles.headerActions}>
            {isLoggedIn ? (
              <TouchableOpacity
                style={styles.smallLoginButton}
                onPress={() => {
                  clearAuthSession();
                  navigation.navigate('Login');
                }}
              >
                <Text style={styles.smallLoginButtonText}>Logout</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.smallRegisterButton} onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.smallRegisterButtonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallLoginButton} onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.smallLoginButtonText}>Login</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {isOwner ? (
          <TouchableOpacity style={styles.ownerAddButton} onPress={() => navigation.navigate('AddBoarding')}>
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
            <Text style={styles.ownerAddButtonText}>Add New Boarding</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={22} color="#94a3b8" />
            <View style={styles.searchTextWrap}>
              <Text style={styles.whereTo}>WHERE TO?</Text>
              <Text style={styles.searchSub}>Location * Date * Guests</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <MaterialCommunityIcons name="tune-variant" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryWrap}>
          {categories.map((category) => {
            const selected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.categoryChip, selected && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(category)}
              >
                <Ionicons
                  name={category === 'Single Room' ? 'bed' : 'business'}
                  size={18}
                  color={selected ? '#fff' : '#334155'}
                />
                <Text style={[styles.categoryText, selected && styles.categoryTextActive]}>{category}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Featured Listings</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {listItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.92}
            onPress={() => navigation.navigate('RoomDetails', { item })}
          >
            <View>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons
                  name={index === 0 ? 'heart' : 'heart-outline'}
                  size={20}
                  color={index === 0 ? '#ef4444' : '#94a3b8'}
                />
              </TouchableOpacity>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={15} color="#f4b400" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <Text style={styles.listingTitle}>{item.title}</Text>
                <Text style={styles.price}>
                  {item.price}
                  <Text style={styles.monthly}>/mo</Text>
                </Text>
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={14} color="#6b7b94" />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>
              <View style={styles.perkRow}>
                <Text style={styles.perkText}>{item.perks[0]}</Text>
                <Text style={styles.perkText}>{item.perks[1]}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        {bottomTabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.bottomItem}
            onPress={() => {
              if (tab.key === 'PROFILE') navigation.navigate('Profile');
              if (tab.key === 'DASHBOARD') navigation.navigate('Dashboard');
              if (tab.key === 'BOOKINGS') navigation.navigate('Bookings');
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={index === 0 ? '#1463f3' : '#94a3b8'}
            />
            <Text style={[styles.bottomText, index === 0 && styles.bottomTextActive]}>{tab.key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.mapButton}>
        <Ionicons name="map" size={17} color="#fff" />
        <Text style={styles.mapButtonText}>Map View</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 10,
  },
  logoBadgeImage: {
    width: '100%',
    height: '100%',
  },
  brandText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#111827',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    minHeight: 60,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d9e2ee',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchTextWrap: {
    marginLeft: 10,
  },
  whereTo: {
    fontSize: 12,
    color: '#8ba0bd',
    fontWeight: '700',
  },
  searchSub: {
    color: '#7184a0',
    marginTop: 2,
    fontSize: 19,
    fontWeight: '500',
  },
  filterButton: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#1463f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryWrap: {
    marginVertical: 12,
  },
  categoryChip: {
    height: 42,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#d5deeb',
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#1463f3',
    borderColor: '#1463f3',
  },
  categoryText: {
    marginLeft: 8,
    color: '#334155',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  sectionTitleRow: {
    marginTop: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#111827',
  },
  seeAll: {
    color: '#1463f3',
    fontWeight: '700',
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginTop: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 210,
  },
  favoriteButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingPill: {
    position: 'absolute',
    left: 14,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ratingText: {
    marginLeft: 6,
    fontWeight: '700',
    color: '#111827',
  },
  cardBody: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginRight: 8,
  },
  price: {
    color: '#1463f3',
    fontWeight: '800',
    fontSize: 18,
  },
  monthly: {
    color: '#8fa1bb',
    fontWeight: '500',
    fontSize: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    color: '#65758f',
    marginLeft: 5,
    fontSize: 15,
  },
  perkRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e4ebf5',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  perkText: {
    fontSize: 12,
    color: '#52637d',
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    borderTopWidth: 1,
    borderTopColor: '#d8e1ee',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  bottomItem: {
    alignItems: 'center',
  },
  bottomText: {
    marginTop: 5,
    fontSize: 11,
    color: '#94a3b8',
    letterSpacing: 1,
    fontWeight: '700',
  },
  bottomTextActive: {
    color: '#1463f3',
  },
  mapButton: {
    position: 'absolute',
    right: 18,
    bottom: 92,
    borderRadius: 28,
    backgroundColor: '#0f1f3d',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: '800',
    marginLeft: 8,
    fontSize: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAddButton: {
    marginBottom: 12,
    alignSelf: 'flex-start',
    borderRadius: 12,
    backgroundColor: '#1463f3',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAddButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '700',
  },
  smallRegisterButton: {
    height: 30,
    borderRadius: 17,
    backgroundColor: '#1463f3',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: 8,
  },
  smallRegisterButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  smallLoginButton: {
    height: 30,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#1463f3',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  smallLoginButtonText: {
    color: '#1463f3',
    fontSize: 11,
    fontWeight: '700',
  },
});
