import api from "../api";

export const getNotificationsByAlert = (alertId) => api.get(`/notif/notification/${alertId}`);
export const getAdminNotifications = () => api.get("/notif/getAdminNotifications");