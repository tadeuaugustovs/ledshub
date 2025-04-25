import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const priorities = [
  { label: '🔴 Sprint', value: 'red' },
  { label: '🟡 Próximo', value: 'yellow' },
  { label: '🟢 Em breve', value: 'green' },
];

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    { text: 'Atualizar Documentação', color: 'red' },
    { text: 'Corrigir bug de autenticação', color: 'red' },
    { text: 'Refatorar Código', color: 'blue' },
    { text: 'Melhorar segurança da API', color: 'blue' },
    { text: 'Implementar nova feature no LEDS HUB', color: 'blue' },
    { text: 'Marcar reunião com o Gabriel – Líder de IA', color: 'green' },
  ]);

  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newColor, setNewColor] = useState('red');

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask.trim(), color: newColor }]);
      setNewTask('');
      setNewColor('red');
      setOpen(false);
    }
  };

  return (
    <Card style={{ backgroundColor: '#1E1E1E', borderRadius: 16 }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>A Fazer</Typography>
          <IconButton onClick={() => setOpen(true)} style={{ color: '#FFFFFF' }}>
            <AddIcon />
          </IconButton>
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tasks.slice(0, 3).map((task, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#2C2C2C',
                borderRadius: 10,
                padding: '10px 16px',
                color: '#FFFFFF',
                fontSize: 15,
              }}
            >
              <span
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: '50%',
                  backgroundColor: task.color,
                  marginRight: 12,
                }}
              />
              {task.text}
            </div>
          ))}
          {tasks.length > 3 && (
            <Button
              size="small"
              style={{ color: '#3B82F6', marginTop: 4, alignSelf: 'flex-start' }}
              onClick={() => alert('Abrir todas as tarefas (em desenvolvimento)')}
            >
              Ver mais...
            </Button>
          )}
        </div>

        {/* Diálogo para adicionar tarefa */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Adicionar Tarefa</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Tarefa"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Prioridade"
              value={newColor}
              onChange={e => setNewColor(e.target.value)}
              margin="normal"
            >
              {priorities.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddTask} color="primary" variant="contained">
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TaskManager;