import api from "../api/axios";

export const getAllAlerts = () => api.get("/alerts/all");

export const assignCollector = (alertId, data) =>
  api.patch(`/alerts/assign/${alertId}`, data);

export const deleteAlert = (id) =>
  api.delete(`/alerts/${id}`);