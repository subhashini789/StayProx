import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './app/LoginScreen';
import RegisterScreen from './app/RegisterScreen';
import HomeScreen from './app/screens/HomeScreen';
import RoomDetailsScreen from './app/screens/RoomDetailsScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import EditProfileScreen from './app/screens/EditProfileScreen';
import DashboardScreen from './app/screens/DashboardScreen';
import BookingScreen from './app/screens/BookingScreen';
import AddBoardingScreen from './app/screens/AddBoardingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f5f7fb' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Bookings" component={BookingScreen} />
        <Stack.Screen name="AddBoarding" component={AddBoardingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
