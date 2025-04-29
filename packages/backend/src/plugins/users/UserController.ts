import express from 'express';
import fs from 'fs';
import path from 'path';

const userRouter = express.Router();
const usersFilePath = path.resolve(__dirname, 'users.json');

// Prefixa aqui! 👇
userRouter.post('/api/users', express.json(), async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Nome e email são obrigatórios.' });
  }

  let users: any[] = [];
  if (fs.existsSync(usersFilePath)) {
    users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
  }

  const userExists = users.some(u => u.metadata?.name === name);

  if (userExists) {
    return res.status(409).json({ message: 'Usuário já existe.' });
  }

  const newUser = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name,
      annotations: {
        'google.com/email': email,
      },
    },
    spec: {
      profile: {
        email,
        displayName: name,
      },
      memberOf: [],
    },
  };

  users.push(newUser);

  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

  return res.status(201).json({ message: 'Usuário criado com sucesso.' });
});

export { userRouter };
