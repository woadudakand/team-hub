import { DataService } from './dataService';

export const fetchProjectUsers = async (projectId) => {
  const res = await DataService.get(`/projects/${projectId}/users`);
  return res.data;
};

export const addProjectUser = async (projectId, data) => {
  const res = await DataService.post(`/projects/${projectId}/users`, data);
  return res.data;
};

export const removeProjectUser = async (projectId, userId) => {
  const res = await DataService.delete(`/projects/${projectId}/users/${userId}`);
  return res.data;
};
