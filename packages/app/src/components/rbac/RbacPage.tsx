import React, { useEffect, useState } from 'react';
import { Content, Page, Header, HeaderLabel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { rbacApiRef } from './api';
import { Role } from './RbacClient';
import {
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@material-ui/core';

export const RbacPage = () => {
  const rbacApi = useApi(rbacApiRef);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar papéis ao montar a página
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await rbacApi.listRoles();
        setRoles(fetchedRoles);
      } catch (err) {
        setError('Erro ao carregar papéis');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [rbacApi]);

  return (
    <Page themeId="tool">
      <Header title="Gerenciar Papéis (RBAC)">
        <HeaderLabel label="Administração" value="Controle de Acessos" />
      </Header>
      <Content>
        <Typography variant="h5">Lista de Papéis</Typography>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && roles.length === 0 && (
          <Typography>Nenhum papel encontrado.</Typography>
        )}
        <List>
          {roles.map(role => (
            <ListItem key={role.id}>
              <ListItemText primary={role.name} secondary={role.description} />
              {/* Futuro: colocar botões de editar/deletar */}
              <Button variant="outlined" color="primary" disabled>
                Editar
              </Button>
              <Button variant="outlined" color="secondary" disabled>
                Deletar
              </Button>
            </ListItem>
          ))}
        </List>
      </Content>
    </Page>
  );
};
