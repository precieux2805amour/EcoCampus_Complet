// src/components/CustomDrawerContent.js

import React from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Alert } from 'react-native'; // Import de Alert pour la confirmation
import { handleLogout } from '../utils/logoutHandler'; // Import de la fonction de déconnexion

const CustomDrawerContent = (props) => {
  const confirmLogout = () => {
    Alert.alert(
      "Confirmation", // Titre de l'alerte
      "Êtes-vous sûr de vouloir vous déconnecter ?", // Message de confirmation
      [
        {
          text: "Annuler", // Option pour annuler
          onPress: () => console.log("Déconnexion annulée"),
          style: "cancel" // Style pour le bouton d'annulation
        },
        {
          text: "Se Déconnecter", // Option pour confirmer
          onPress: () => handleLogout(props.navigation), // Gère la déconnexion
          style: "destructive" // Style pour indiquer une action destructive
        }
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Se Déconnecter" // Libellé pour l'élément de menu
        onPress={confirmLogout} // Appelle la fonction de confirmation
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
