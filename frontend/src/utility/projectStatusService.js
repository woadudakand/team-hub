import { DataService } from './dataService';

export const fetchProjectStatuses = async (params = {}) => {
  const query = [];
  if (params.page) query.push(`page=${params.page}`);
  if (params.limit) query.push(`limit=${params.limit}`);
  if (params.search) query.push(`search=${encodeURIComponent(params.search)}`);
  if (params.archived) query.push(`archived=${params.archived}`);
  const q = query.length ? `?${query.join('&')}` : '';
  const res = await DataService.get(`/project-status-list${q}`);
  return res.data;
};

export const createProjectStatus = async (data) => {
  const res = await DataService.post('/project-status', data);
  return res.data;
};

export const updateProjectStatus = async (id, data) => {
  const res = await DataService.patch(`/project-status/${id}`, data);
  return res.data;
};

export const deleteProjectStatuses = async (ids) => {
  const res = await DataService.delete('/project-status', { ids });
  return res.data;
};

export const restoreProjectStatuses = async (ids) => {
  const res = await DataService.patch('/project-status/restore', { ids });
  return res.data;
};
