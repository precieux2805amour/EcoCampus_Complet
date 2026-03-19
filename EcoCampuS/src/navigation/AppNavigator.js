import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'; // Icônes pour les tabs

/* Screens */
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import DashboardScreen from '../screens/DashboardScreen';
import CollectorDashboard from '../screens/CollectorDashboard';
import AdminDashboard from '../screens/AdminDashboard';

import ProfileScreen from '../screens/ProfileScreen';
import ProfileUpdateForm from '../components/ProfileUpdateForm';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

import AlertScreen from '../screens/AlertScreen';
import AlertsListScreen from '../screens/AlertsListScreen';
import AlertListScreenC from '../screens/AlertListScreenC';
import AlertListScreenD from '../screens/AlertListScreenD';

import AlertDetailScreen from '../screens/AlertDetailScreen';
import AlertDetails from '../screens/AlertDetails';
import AlertDetailD from '../screens/AlertDetailD';

import MapScreen from '../screens/MapScreen';

import NotificationScreen from '../screens/NotificationScreen';
import NotificationDetailScreen from '../screens/NotificationDetailScreen';

import UserListScreen from '../screens/UserListScreen';
import UserDetailScreen from '../screens/UserDetailScreen';

import MesTachesScreen from '../screens/MesTachesScreen';
import StatutScreen from '../screens/StatutScreen';

/* Navigators */
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Thème global
const theme = {
  colors: {
    primary: '#4CAF50',
    secondary: '#A5D6A7',
    background: '#F5F5F5',
    text: '#333',
  },
};

// =======================
// USER STACKS
// =======================
function UserDashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
      <Stack.Screen name="AlertDetails" component={AlertDetails} />
    </Stack.Navigator>
  );
}

function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'home';
          if (route.name === 'Alertes') iconName = 'list-alt';
          if (route.name === 'Alerter') iconName = 'plus-circle';
          if (route.name === 'Profil') iconName = 'user';
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={UserDashboardStack} />
      <Tab.Screen name="Alertes" component={AlertsListScreen} />
      <Tab.Screen name="Alerter" component={AlertScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// =======================
// COLLECTOR STACKS
// =======================
function CollectorDashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CollectorMain" component={CollectorDashboard} />
      <Stack.Screen name="AlertDetailC" component={AlertDetailScreen} />
      <Stack.Screen name="MesTachesDetail" component={MesTachesScreen} />
    </Stack.Navigator>
  );
}

function CollectorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Collecteur') iconName = 'tasks';
          if (route.name === 'Alertes') iconName = 'list-alt';
          if (route.name === 'Mes tâches') iconName = 'check-square';
          if (route.name === 'Profil') iconName = 'user';
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Collecteur" component={CollectorDashboardStack} />
      <Tab.Screen name="Alertes" component={AlertListScreenC} />
      <Tab.Screen name="Mes tâches" component={MesTachesScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// =======================
// ADMIN STACKS
// =======================
function AdminDashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminMain" component={AdminDashboard} />
      <Stack.Screen name="AlertDetailD" component={AlertDetailD} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
    </Stack.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Admin') iconName = 'dashboard';
          if (route.name === 'Alertes') iconName = 'list-alt';
          if (route.name === 'Utilisateurs') iconName = 'users';
          if (route.name === 'Notifications') iconName = 'bell';
          if (route.name === 'Profil') iconName = 'user';
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Admin" component={AdminDashboardStack} />
      <Tab.Screen name="Alertes" component={AlertListScreenD} />
      <Tab.Screen name="Utilisateurs" component={UserListScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// =======================
// ROOT NAVIGATOR
// =======================
export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      {/* Public screens */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Role-based dashboards */}
      <Stack.Screen name="UserDashboard" component={UserTabs} />
      <Stack.Screen name="CollectorDashboard" component={CollectorTabs} />
      <Stack.Screen name="AdminDashboard" component={AdminTabs} />

      {/* Shared screens */}
      <Stack.Screen name="ProfileUpdateForm" component={ProfileUpdateForm} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
      <Stack.Screen name="AlertDetails" component={AlertDetails} />
      <Stack.Screen name="AlertDetailD" component={AlertDetailD} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="SignUpScreen" component={RegisterScreen} />
      <Stack.Screen name="StatutScreen" component={StatutScreen} />
    </Stack.Navigator>
  );
}