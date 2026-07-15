import React, { useMemo, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

const fallbackItem = {
  title: 'Room details',
  location: 'Location unavailable',
  price: 'N/A',
  rating: '0.0',
  perks: ['NO DETAILS', 'NO DETAILS'],
  image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
};

export default function RoomDetailsScreen({ navigation, route }) {
  const item = route?.params?.item ?? fallbackItem;
  const [userRating, setUserRating] = useState(0);

  const parsedRating = useMemo(() => Number(item.rating) || 0, [item.rating]);
  const ratingLabel = useMemo(() => {
    if (!userRating) return null;
    if (userRating <= 2) return 'Thanks. We will improve this listing.';
    if (userRating === 3) return 'Thanks for your feedback.';
    return 'Great. Thanks for the positive rating!';
  }, [userRating]);

  const submitRating = () => {
    if (!userRating) {
      Alert.alert('Rating required', 'Please select at least one star before submitting.');
      return;
    }

    Alert.alert('Rating submitted', `You rated this listing ${userRating} star${userRating > 1 ? 's' : ''}.`);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Room Details</Text>
          <View style={styles.headerRightSpacer} />
        </View>

        <Image source={{ uri: item.image }} style={styles.heroImage} />

        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={15} color="#64748b" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.monthly}> / month</Text>
          </View>

          <View style={styles.ratingSummaryRow}>
            <Ionicons name="star" size={18} color="#f4b400" />
            <Text style={styles.ratingSummaryText}>{parsedRating.toFixed(1)} rating from guests</Text>
          </View>

          <Text style={styles.sectionTitle}>Highlights</Text>
          <View style={styles.perksWrap}>
            {(item.perks || []).map((perk) => (
              <View key={perk} style={styles.perkChip}>
                <Text style={styles.perkText}>{perk}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Rate this listing</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setUserRating(star)}
                style={styles.starTouch}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={star <= userRating ? 'star' : 'star-outline'}
                  size={33}
                  color={star <= userRating ? '#f59e0b' : '#cbd5e1'}
                />
              </TouchableOpacity>
            ))}
          </View>

          {ratingLabel ? <Text style={styles.ratingLabel}>{ratingLabel}</Text> : null}

          <TouchableOpacity style={styles.submitButton} onPress={submitRating}>
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          </TouchableOpacity>
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
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerRightSpacer: {
    width: 38,
  },
  heroImage: {
    width: '100%',
    height: 250,
    borderRadius: 18,
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  locationRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 6,
    color: '#64748b',
    fontSize: 15,
  },
  priceRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1463f3',
  },
  monthly: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  ratingSummaryRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingSummaryText: {
    marginLeft: 8,
    color: '#334155',
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  perksWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  perkChip: {
    borderRadius: 999,
    backgroundColor: '#e8f0ff',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  perkText: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starTouch: {
    marginRight: 6,
  },
  ratingLabel: {
    marginTop: 10,
    color: '#475569',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 14,
    backgroundColor: '#1463f3',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
