import React, { useEffect, useState, useCallback } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../../utility/taskService';
import { Box, Typography, Button, TextField, Paper, IconButton, CircularProgress, Alert, Card, CardContent, Skeleton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNotification } from '../../../hooks/useNotification';
import StatusChip from '../../../components/common/StatusChip';

const columns = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

export default function KanbanBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState({ todo: '', in_progress: '', done: '' });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const { success, error: notifyError } = useNotification();

  const fetchData = useCallback(async () => {
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
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (status) => {
    const taskTitle = newTasks[status];
    if (!taskTitle) return;
    setActionLoading(true);
    setError(null);
    try {
      await createTask(projectId, { title: taskTitle, status });
      setNewTasks(prev => ({ ...prev, [status]: '' }));
      success('Task added successfully');
      fetchData();
    } catch (err) {
      notifyError(err?.message || 'Failed to add task');
    } finally {
      setActionLoading(false);
    }
  };
  const handleDelete = async (id) => {
    setActionLoading(true);
    setError(null);
    try {
      await deleteTask(id);
      success('Task deleted successfully');
      fetchData();
    } catch (err) {
      notifyError(err?.message || 'Failed to delete task');
    } finally {
      setActionLoading(false);
    }
  };
  const handleStatusChange = async (task, newStatus) => {
    setActionLoading(true);
    setError(null);
    try {
      await updateTask(task.id, { ...task, status: newStatus });
      success(`Task moved to ${newStatus.replace('_', ' ')}`);
      fetchData();
    } catch (err) {
      notifyError(err?.message || 'Failed to update task');
    } finally {
      setActionLoading(false);
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
    setActionLoading(true);
    setError(null);
    try {
      await updateTask(task.id, { ...task, status: newStatus });
      success(`Task moved to ${newStatus.replace('_', ' ')}`);
      fetchData();
    } catch (err) {
      notifyError(err?.message || 'Failed to move task');
    } finally {
      setActionLoading(false);
    }
  };

  const SkeletonColumn = () => (
    <Paper sx={{ flex: 1, p: 2, minHeight: 300 }}>
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
      {Array.from({ length: 3 }).map((_, idx) => (
        <Card key={idx} sx={{ mb: 1, p: 1 }}>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="40%" />
        </Card>
      ))}
    </Paper>
  );

  if (!projectId) return <Alert severity="warning">No project selected.</Alert>;

  if (loading) {
    return (
      <Box display="flex" gap={2}>
        {columns.map((col, idx) => (
          <SkeletonColumn key={idx} />
        ))}
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box display="flex" gap={2} sx={{ overflowX: 'auto', pb: 2 }}>
        {columns.map(col => {
          const columnTasks = tasks.filter(t => t.status === col.key);
          return (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided, snapshot) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    minWidth: 300,
                    flex: 1,
                    backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'background.paper',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {col.label}
                      </Typography>
                      <Chip label={columnTasks.length} size="small" variant="outlined" />
                    </Box>

                    <Box sx={{ minHeight: 200 }}>
                      {columnTasks.map((task, idx) => (
                        <Draggable draggableId={task.id.toString()} index={idx} key={task.id}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                mb: 1,
                                p: 2,
                                cursor: 'grab',
                                backgroundColor: snapshot.isDragging ? 'action.selected' : 'background.default',
                                boxShadow: snapshot.isDragging ? 3 : 1,
                                '&:hover': { boxShadow: 2 },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                {task.title}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <StatusChip status={task.status} size="small" variant="outlined" />
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(task.id);
                                  }}
                                  disabled={actionLoading}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>

                    <Box mt={2} display="flex" gap={1}>
                      <TextField
                        size="small"
                        label="New Task"
                        value={newTasks[col.key]}
                        onChange={e => setNewTasks(prev => ({ ...prev, [col.key]: e.target.value }))}
                        onKeyPress={e => e.key === 'Enter' && handleAdd(col.key)}
                        fullWidth
                      />
                      <Button
                        variant="contained"
                        onClick={() => handleAdd(col.key)}
                        disabled={actionLoading || !newTasks[col.key]}
                        startIcon={actionLoading ? <CircularProgress size={16} /> : <AddIcon />}
                        size="small"
                      >
                        Add
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Droppable>
          );
        })}
      </Box>
    </DragDropContext>
  );
}
