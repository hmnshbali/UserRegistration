import React, { useState } from 'react';
import { useUsers } from '../context/UserContext';
import {
  List, ListItem, ListItemText, Grid,
  Paper, Typography, Box, Button, TextField
} from '@mui/material';
import {
  DragDropContext, Droppable, Draggable
} from '@hello-pangea/dnd';

const TodoTaks = () => {
  const { tasks, addTask, setTasks } = useUsers();
  const [inputValue, setInputValue] = useState('');

  // Add task with default status
  const handleAddTask = () => {
    if (!inputValue.trim()) return;
    addTask({ id: Date.now().toString(), title: inputValue, status: 'todo' });
    setInputValue('');  
  };

  // Group tasks by status
  const groupedTasks = {
    todo: tasks.filter(task => task.status === 'todo'),
    inprogress: tasks.filter(task => task.status === 'inprogress'),
    completed: tasks.filter(task => task.status === 'completed'),
  };

  // Handle drag
  const onDragEnd = (result) => {
    console.log(result);
    
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) return;

    // Update task status based on destination
    setTasks(prev =>
      prev.map(task =>
        task.id === draggableId
          ? { ...task, status: destination.droppableId }
          : task
      )
    );
    console.log(tasks);
    
  };

  return (
    <>
      <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          variant="outlined"
          placeholder="Add a new task"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddTask}>
          Add
        </Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2}>
          {['todo', 'inprogress', 'completed'].map((column) => (
            <Grid item  key={column}>
              <Paper elevation={3} sx={{ p: 2, height: '80vh' }}>
                <Typography variant="h6" gutterBottom>
                  {column === 'todo'
                    ? 'To Do'
                    : column === 'inprogress'
                    ? 'In Progress'
                    : 'Completed'}
                </Typography>  

                <Droppable droppableId={column}>
                  {(provided) => (
                    <Box 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{ minHeight: '60vh', backgroundColor: '#f5f5f5', p: 1 }}
                    >
                      {groupedTasks[column].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}  isDragDisabled={task.status === 'completed'} >
                          {(provided) => ( 
                            <ListItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                mb: 1,
                                backgroundColor: 'white',
                                borderRadius: 1,
                                boxShadow: 1,
                              }}
                            >
                              <ListItemText primary={task.title} />
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
      </section>
    </>
  );
};

export default TodoTaks;
