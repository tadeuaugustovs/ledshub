import { Content, Header, Page } from '@backstage/core-components';
import { Button, TextField } from '@material-ui/core';
import { useState } from 'react';

export const ManageUsersPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const entity = {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'User',
          metadata: {
            name: name.toLowerCase().replace(/\s/g, '-'),
            annotations: {
              'google.com/email': email,
            },
          },
          spec: {
            profile: {
              displayName: displayName || name,
              email,
            },
            memberOf: [],
          },
        },
      };

      const response = await fetch('/api/catalog/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entity),
      });

      if (response.ok) {
        setMessage('Usuário cadastrado com sucesso!');
        setName('');
        setEmail('');
        setDisplayName('');
      } else {
        const errorText = await response.text();
        setMessage(`Erro ao cadastrar usuário: ${errorText}`);
      }
    } catch (error: any) {
      setMessage(`Erro inesperado: ${error.message}`);
    }
  };

  return (
    <Page themeId="tool">
      <Header title="Gerenciar Usuários" />
      <Content>
        <form noValidate autoComplete="off" style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
          <TextField
            label="Nome de Usuário"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Nome para Mostrar"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Cadastrar Usuário
          </Button>
        </form>
        {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      </Content>
    </Page>
  );
};
