// src/utils/logoutHandler.js

export const handleLogout = (navigation) => {
  // Réinitialiser la navigation, vider la pile, et revenir à l'écran Home
  navigation.reset({
    index: 0,
    routes: [{ name: 'Home' }], // Remplacer 'Home' par 'Login' pour forcer la déconnexion
  });
};
