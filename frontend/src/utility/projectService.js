import { DataService } from './dataService';

export const fetchProjects = async (params = {}) => {
  const query = [];
  if (params.page) query.push(`page=${params.page}`);
  if (params.limit) query.push(`limit=${params.limit}`);
  if (params.search) query.push(`search=${encodeURIComponent(params.search)}`);
  const q = query.length ? `?${query.join('&')}` : '';
  const res = await DataService.get(`/projects${q}`);
  return res.data;
};

export const createProject = async (data) => {
  const res = await DataService.post('/projects', data);
  return res.data;
};

export const updateProject = async (id, data) => {
  const res = await DataService.put(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await DataService.delete(`/projects/${id}`);
  return res.data;
};
