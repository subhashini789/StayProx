import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const bookingsSeed = [
  {
    id: 'b1',
    roomName: 'Skyline Modern Studio',
    location: 'Quezon City',
    checkIn: '2026-05-02',
    checkOut: '2026-05-08',
    status: 'upcoming',
    amount: 'PHP 37,500',
  },
  {
    id: 'b2',
    roomName: 'Zen Solo Suites',
    location: 'Makati City',
    checkIn: '2026-03-12',
    checkOut: '2026-03-18',
    status: 'completed',
    amount: 'PHP 28,700',
  },
];

export default function BookingScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('upcoming');

  const filteredBookings = useMemo(
    () => bookingsSeed.filter((booking) => booking.status === activeTab),
    [activeTab]
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.tabRow}>
          <TabButton
            title="Upcoming"
            active={activeTab === 'upcoming'}
            onPress={() => setActiveTab('upcoming')}
          />
          <TabButton
            title="Completed"
            active={activeTab === 'completed'}
            onPress={() => setActiveTab('completed')}
          />
        </View>

        {filteredBookings.length ? (
          filteredBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.titleWrap}>
                <Text style={styles.roomName}>{booking.roomName}</Text>
                <Text style={styles.amount}>{booking.amount}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={15} color="#64748b" />
                <Text style={styles.infoText}>{booking.location}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={15} color="#64748b" />
                <Text style={styles.infoText}>
                  {booking.checkIn} to {booking.checkOut}
                </Text>
              </View>

              <View style={styles.statusRow}>
                <View style={[styles.statusBadge, booking.status === 'upcoming' ? styles.upcomingBadge : styles.completedBadge]}>
                  <Text style={[styles.statusText, booking.status === 'upcoming' ? styles.upcomingText : styles.completedText]}>
                    {booking.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-clear-outline" size={30} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No bookings here</Text>
            <Text style={styles.emptyText}>Your {activeTab} bookings will appear in this section.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TabButton({ title, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.tabButton, active && styles.tabButtonActive]} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{title}</Text>
    </TouchableOpacity>
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: '#64748b',
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#0f172a',
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  titleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginRight: 8,
  },
  amount: {
    color: '#1463f3',
    fontWeight: '800',
    fontSize: 14,
  },
  infoRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    color: '#64748b',
    fontSize: 13,
  },
  statusRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  upcomingBadge: {
    backgroundColor: '#dcfce7',
  },
  completedBadge: {
    backgroundColor: '#e2e8f0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  upcomingText: {
    color: '#166534',
  },
  completedText: {
    color: '#334155',
  },
  actionButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionButtonText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    color: '#0f172a',
    fontWeight: '700',
  },
  emptyText: {
    marginTop: 6,
    color: '#64748b',
    textAlign: 'center',
  },
});
