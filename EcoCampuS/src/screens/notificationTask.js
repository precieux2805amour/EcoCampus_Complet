import * as Notifications from 'expo-notifications';

// Ce code sera exécuté même quand l'application est en arrière-plan ou fermée
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
export default Notifications.setNotificationHandler;