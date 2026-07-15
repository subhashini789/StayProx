import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const fallbackStats = {
  upcoming: 2,
  completed: 12,
  savedRooms: 5,
  avgRating: '4.8',
};

const quickActions = [
  { label: 'Add Listing', icon: 'add-circle-outline', action: 'addListing' },
  { label: 'View Profile', icon: 'person-outline', action: 'profile' },
  { label: 'Explore Rooms', icon: 'search-outline', action: 'explore' },
];

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState(fallbackStats);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('/rooms/mine');
        const ownerRooms = Array.isArray(response.data) ? response.data : [];

        const ratings = ownerRooms
          .map((room) => Number(room?.rating))
          .filter((value) => Number.isFinite(value) && value > 0);
        const avgRating = ratings.length
          ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1)
          : fallbackStats.avgRating;

        const roomCount = ownerRooms.length;
        const upcoming = Math.min(roomCount, 3) || fallbackStats.upcoming;
        const completed = roomCount > 3 ? roomCount - 3 : fallbackStats.completed;
        const savedRooms = roomCount || fallbackStats.savedRooms;

        if (!mounted) return;
        setRooms(ownerRooms);
        setStats({
          upcoming,
          completed,
          savedRooms,
          avgRating,
        });
        setApiMessage(ownerRooms.length ? '' : 'No listings yet — start by adding your first room.');
      } catch (_error) {
        if (!mounted) return;
        setApiMessage('Could not load owner listings. Please ensure you are logged in as an owner.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDashboardStats();
    return () => {
      mounted = false;
    };
  }, []);

  const summaryCards = useMemo(
    () => [
      { label: 'Your Listings', value: String(rooms.length), icon: 'home-outline' },
      { label: 'Upcoming', value: String(stats.upcoming), icon: 'calendar-outline' },
      { label: 'Completed', value: String(stats.completed), icon: 'checkmark-done-outline' },
      { label: 'Avg Rating', value: String(stats.avgRating), icon: 'star-outline' },
    ],
    [rooms.length, stats]
  );

  const onActionPress = (action) => {
    if (action === 'addListing') {
      navigation.navigate('AddBoarding');
      return;
    }
    if (action === 'profile') {
      navigation.navigate('Profile');
      return;
    }
    if (action === 'explore') {
      navigation.navigate('Home');
      return;
    }
    Alert.alert('Support', 'Support chat will be added soon.');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome back</Text>
          <Text style={styles.welcomeText}>Track bookings and access your most-used actions from one place.</Text>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#1463f3" />
              <Text style={styles.loadingText}>Loading live stats...</Text>
            </View>
          ) : null}
          {apiMessage ? <Text style={styles.apiMessage}>{apiMessage}</Text> : null}
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.grid}>
          {summaryCards.map((card) => (
            <View key={card.label} style={styles.gridCard}>
              <Ionicons name={card.icon} size={18} color="#1463f3" />
              <Text style={styles.gridValue}>{card.value}</Text>
              <Text style={styles.gridLabel}>{card.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsWrap}>
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.actionRow}
              onPress={() => onActionPress(item.action)}
              activeOpacity={0.85}
            >
              <View style={styles.actionLeft}>
                <Ionicons name={item.icon} size={20} color="#334155" />
                <Text style={styles.actionText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Your Listings</Text>
        <View style={styles.listCard}>
          {loading ? (
            <Text style={styles.loadingText}>Loading listings...</Text>
          ) : rooms.length ? (
            rooms.map((room) => (
              <View key={room._id} style={styles.listItem}>
                <View>
                  <Text style={styles.listingTitle}>{room.title}</Text>
                  <Text style={styles.listingMeta}>{room.location}</Text>
                  <Text style={styles.listingPrice}>₱{room.price} / mo</Text>
                </View>
                <View style={styles.listActions}>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => navigation.navigate('AddBoarding', { room })}
                  >
                    <Text style={styles.smallButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallButtonSecondary}
                    onPress={() => navigation.navigate('RoomDetails', { item: room })}
                  >
                    <Text style={styles.smallButtonTextSecondary}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.loadingText}>{apiMessage || 'No listings found.'}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  welcomeText: {
    marginTop: 6,
    color: '#64748b',
    lineHeight: 20,
  },
  loadingWrap: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: '#1463f3',
    fontWeight: '600',
  },
  apiMessage: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 12,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48.5%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  gridValue: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  gridLabel: {
    marginTop: 4,
    color: '#64748b',
    fontWeight: '600',
  },
  actionsWrap: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionRow: {
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 10,
    fontWeight: '600',
    color: '#334155',
  },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 12,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  listingMeta: {
    marginTop: 3,
    color: '#64748b',
    fontSize: 13,
  },
  listingPrice: {
    marginTop: 4,
    color: '#1463f3',
    fontWeight: '700',
  },
  listActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1463f3',
  },
  smallButtonSecondary: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  smallButtonTextSecondary: {
    color: '#334155',
    fontWeight: '700',
  },
});
