import api from "../api/axios";

export const listUsers = () => api.get("/users/list");
export const activateUser = (id) => api.patch(`/users/active/${id}`);
export const deactivateUser = (id) => api.patch(`/users/${id}`);
export const getCollectors = () => api.get("/users/collectors");
export const createUser = (data) => api.post("users/sign-up",data)