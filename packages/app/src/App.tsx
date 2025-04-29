import { Route } from 'react-router-dom';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';

import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
} from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';

import { CssBaseline } from '@material-ui/core';
import { UnifiedThemeProvider, themes } from '@backstage/theme';
import { hubTheme } from './theme/ledshubTheme';
import DarkIcon from '@material-ui/icons/Brightness4';

import { HomePage } from './components/home/HomePage';
import { githubAuthApiRef, googleAuthApiRef } from '@backstage/core-plugin-api';
import { GithubIssuesPage } from '@backstage/plugin-github-issues';

const app = createApp({
  apis,
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
  components: {
    SignInPage: props => (
      <SignInPage
        {...props}
        auto
        providers={[
          {
            id: 'github',
            title: 'Entrar com GitHub',
            message: 'Use sua conta GitHub para entrar',
            apiRef: githubAuthApiRef,
          },
          {
            id: 'google',
            title: 'Entrar com Google',
            message: 'Use sua conta Google para entrar',
            apiRef: googleAuthApiRef,
          },
        ]}
      />
    ),
  },
  themes: [
    {
      id: 'ledshub',
      title: 'LEDS HUB',
      variant: 'dark',
      icon: <DarkIcon />,
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={hubTheme}>
          <CssBaseline />
          {children}
        </UnifiedThemeProvider>
      ),
    },
    {
      id: 'light',
      title: 'Claro',
      variant: 'light',
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={themes.light}>
          <CssBaseline />
          {children}
        </UnifiedThemeProvider>
      ),
    },
    {
      id: 'dark',
      title: 'Escuro',
      variant: 'dark',
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={themes.dark}>
          <CssBaseline />
          {children}
        </UnifiedThemeProvider>
      ),
    },
  ],
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<HomePage />} />
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route path="/catalog/:namespace/:kind/:name" element={<CatalogEntityPage />}>
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route path="/docs/:namespace/:kind/:name/*" element={<TechDocsReaderPage />}>
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route path="/catalog-import" element={
      <RequirePermission permission={catalogEntityCreatePermission}>
        <CatalogImportPage />
      </RequirePermission>
    }/>
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/github-issues" element={<GithubIssuesPage />} />
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);