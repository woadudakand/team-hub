import { DataService } from './dataService';

export const fetchTasks = async (projectId) => {
  const res = await DataService.get(`/projects/${projectId}/tasks`);
  return res.data;
};

export const createTask = async (projectId, data) => {
  const res = await DataService.post(`/projects/${projectId}/tasks`, data);
  return res.data;
};

export const updateTask = async (id, data) => {
  const res = await DataService.put(`/tasks/${id}`, data);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await DataService.delete(`/tasks/${id}`);
  return res.data;
};
