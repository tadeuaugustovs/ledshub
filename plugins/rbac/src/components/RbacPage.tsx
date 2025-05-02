import React from 'react';
import {
  Content,
  ContentHeader,
  Header,
  Page,
  SupportButton,
} from '@backstage/core-components';

export const RbacPage = () => {
  return (
    <Page themeId="tool">
      <Header title="RBAC" subtitle="Gerencie as permissões e papéis do LEDSHUB" />
      <Content>
        <ContentHeader title="Visão geral do RBAC">
          <SupportButton>
            Essa página permite visualizar e administrar as permissões de acesso.
          </SupportButton>
        </ContentHeader>
        <p>A página RBAC foi carregada com sucesso. Em breve você poderá criar roles e policies!</p>
      </Content>
    </Page>
  );
};
