import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../../utility/taskService';
import { Box, Typography, Button, TextField, Paper, IconButton, CircularProgress, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const columns = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

export default function KanbanBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks(projectId);
      setTasks(data);
    } catch (err) {
      setError(err?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, [projectId]);

  const handleAdd = async (status) => {
    if (!newTask) return;
    setLoading(true);
    setError(null);
    try {
      await createTask(projectId, { title: newTask, status });
      setNewTask('');
      fetchData();
    } catch (err) {
      setError(err?.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTask(id);
      fetchData();
    } catch (err) {
      setError(err?.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (task, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await updateTask(task.id, { ...task, status: newStatus });
      fetchData();
    } catch (err) {
      setError(err?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  // Drag-and-drop handler
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const task = tasks.find(t => t.id.toString() === draggableId);
    if (!task) return;
    const newStatus = destination.droppableId;
    setLoading(true);
    setError(null);
    try {
      await updateTask(task.id, { ...task, status: newStatus });
      fetchData();
    } catch (err) {
      setError(err?.message || 'Failed to move task');
    } finally {
      setLoading(false);
    }
  };

  if (!projectId) return <Alert severity="warning">No project selected.</Alert>;
  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box display="flex" gap={2}>
        {columns.map(col => (
          <Droppable droppableId={col.key} key={col.key}>
            {(provided) => (
              <Paper ref={provided.innerRef} {...provided.droppableProps} sx={{ flex: 1, p: 2, minHeight: 300 }}>
                <Typography variant="h6" mb={2}>{col.label}</Typography>
                {tasks.filter(t => t.status === col.key).map((task, idx) => (
                  <Draggable draggableId={task.id.toString()} index={idx} key={task.id}>
                    {(provided) => (
                      <Paper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ p: 1, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{task.title}</span>
                        <Box>
                          {columns.filter(c => c.key !== col.key).map(c => (
                            <Button key={c.key} size="small" onClick={() => handleStatusChange(task, c.key)}>{c.label}</Button>
                          ))}
                          <IconButton size="small" color="error" onClick={() => handleDelete(task.id)}><DeleteIcon /></IconButton>
                        </Box>
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <Box mt={2} display="flex" gap={1}>
                  <TextField size="small" label="New Task" value={newTask} onChange={e => setNewTask(e.target.value)} />
                  <Button variant="contained" onClick={() => handleAdd(col.key)}>Add</Button>
                </Box>
              </Paper>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  );
}
