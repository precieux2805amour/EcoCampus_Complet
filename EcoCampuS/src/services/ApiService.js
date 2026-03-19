import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AlertScreen from '../screens/AlertScreen';
import AlertsListScreen from '../screens/AlertsListScreen';
import ProfileUpdateForm from '../components/ProfileUpdateForm';
import DashboardScreen from '../screens/DashboardScreen';
import AdminDashboard from '../screens/AdminDashboard';
import CollectorDashboard from '../screens/CollectorDashboard';

import AlertDetailScreen from '../screens/AlertDetailScreen';
import MapScreen from '../screens/MapScreen';
import ScrollingMessage from '../screens/ScrollingMessage';
import AlertListScreenC from '../screens/AlertListScreenC';
import AlertListScreenD from '../screens/AlertListScreenD';
import AlertDetails from '../screens/AlertDetails';
import AlertDetailD from '../screens/AlertDetailD';
import StatutScreen from '../screens/StatutScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import UserListScreen from '../screens/UserListScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { handleLogout } from '../utils/logoutHandler'; // Import de la fonction de déconnexion partagée
import CustomDrawerContent from '../components/CustomDrawerContent'; // Import du Custom Drawer Content
import NotificationScreen from '../screens/NotificationScreen';
import NotificationDetailScreen from '../screens/NotificationDetailScreen';
import MesTachesScreen from '../screens/MesTachesScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
// Création du Drawer Navigator pour le Dashboard

const Drawer = createDrawerNavigator();

const DashboardDrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="Dashboard"
    drawerContent={(props) => <CustomDrawerContent {...props} />} >
    <Drawer.Screen name="Utilisateur" component={DashboardScreen} />
    <Drawer.Screen name="Mon Profil" component={ProfileScreen} />
    <Drawer.Screen name="Modifier Profil" component={ProfileUpdateForm} />
    <Drawer.Screen name="Changer Mot de Passe" component={ChangePasswordScreen} /> 
    <Drawer.Screen name="Liste des alertes" component={AlertsListScreen} />
    <Drawer.Screen name="Alerter" component={AlertScreen} />
  </Drawer.Navigator>
);


const CollectorDashboardDrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="CollectorDashboard"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen name="Collecteur" component={CollectorDashboard} />
    <Drawer.Screen name="Mon Profil" component={ProfileScreen} />
    <Drawer.Screen name="Modifier Profil" component={ProfileUpdateForm} />
    <Drawer.Screen name="Changer Mot de Passe" component={ChangePasswordScreen} />
    <Drawer.Screen name="Liste des alertes" component={AlertListScreenC} />
    <Drawer.Screen name="Mes tâches" component={MesTachesScreen} /> 
  </Drawer.Navigator>
);


const AdminDashboardDrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="AdminDashboard"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen name="Admin" component={AdminDashboard} />
    <Drawer.Screen name="Mon Profil" component={ProfileScreen} />
    <Drawer.Screen name="Modifier Profil" component={ProfileUpdateForm} />
    <Drawer.Screen name="Changer Mot de Passe" component={ChangePasswordScreen} /> 
    <Drawer.Screen name="Liste des alertes" component={AlertListScreenD} />
    <Drawer.Screen name="Liste des utilisateurs" component={UserListScreen} />
    <Drawer.Screen name="Creer un compte" component={SignUpScreen} />
    <Drawer.Screen name="Notifications Urgentes" component={NotificationScreen} />
  </Drawer.Navigator>
);


// Création du Stack Navigator pour gérer les autres écrans
const Stack = createNativeStackNavigator();


const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      {/* Ecran d'accueil */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Écrans d'authentification */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
      <Stack.Screen name="ProfileUpdateForm" component={ProfileUpdateForm} />

      
      {/* Ecran de détails des alertes */}
      <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />

      {/* Ecran de carte */}
      <Stack.Screen name="Map" component={MapScreen} />

      {/* Ecran de message déroulant */}
      <Stack.Screen name="ScrollingMessage" component={ScrollingMessage} />

      {/* Ecran liste d'alertes pour les collecteurs */}
      <Stack.Screen name="AlertListC" component={AlertListScreenC} />
      <Stack.Screen name="AlertListD" component={AlertListScreenD} />

      {/* Détails des alertes */}
      <Stack.Screen name="AlertDetails" component={AlertDetails} />
      <Stack.Screen name="AlertDetailD" component={AlertDetailD} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      {/* Ecran de statut */}
      <Stack.Screen name="StatutScreen" component={StatutScreen} />

      {/* Ecrans de gestion des utilisateurs */}
      <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} />
      <Stack.Screen name="UserListScreen" component={UserListScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />

      {/* Ecran principal avec Drawer pour le Dashboard */}
      <Stack.Screen
        name="Dashboard"
        component={DashboardDrawerNavigator}
        options={{ headerShown: false }} // Pas de header pour le Drawer
      />

      <Stack.Screen
        name="CollectorDashboard"
        component={CollectorDashboardDrawerNavigator}
        options={{ headerShown: false }} // Pas de header pour le Drawer
      />

      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardDrawerNavigator}
        options={{ headerShown: false }} // Pas de header pour le Drawer
      />

    </Stack.Navigator>
  );
};

export default AppNavigator;
