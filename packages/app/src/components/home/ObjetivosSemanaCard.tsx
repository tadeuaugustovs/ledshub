import React from 'react';
import { Page, Content } from '@backstage/core-components';
import {
  HomePageCompanyLogo,
  TemplateBackstageLogo,
  HomePageToolkit,
} from '@backstage/plugin-home';
import { HomePageSearchBar } from '@backstage/plugin-search';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import {
  Grid,
  makeStyles,
  Avatar,
  Typography,
  Card,
  CardContent,
} from '@material-ui/core';
import { tools, useLogoStyles } from './shared';
import { ResumoTimeCard } from './ResumoTimeCard';
import { ObjetivosSemanaCard } from './ObjetivosSemanaCard';

const useStyles = makeStyles(theme => ({
  searchBarInput: {
    maxWidth: '60vw',
    margin: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '50px',
    boxShadow: theme.shadows[1],
  },
  searchBarOutline: {
    borderStyle: 'none',
  },
  userInfo: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    gap: theme.spacing(1.5),
  },
  userName: {
    fontWeight: 500,
    color: '#fff',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: theme.spacing(2),
    height: '100%',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    color: '#fff',
  },
}));

export const HomePage = () => {
  const classes = useStyles();
  const { svg, path, container } = useLogoStyles();

  return (
    <SearchContextProvider>
      <Page themeId="home">
        <Content>

          {/* Usuário no topo direito */}
          <div className={classes.userInfo}>
            <Typography variant="body1" className={classes.userName}>
              Tadeu Augusto
            </Typography>
            <Avatar alt="Tadeu Augusto" src="/static/images/avatar/1.jpg" />
          </div>

          {/* Logo + Busca */}
          <Grid container justifyContent="center" spacing={2}>
            <HomePageCompanyLogo
              className={container}
              logo={<TemplateBackstageLogo classes={{ svg, path }} />}
            />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar
                InputProps={{
                  classes: {
                    root: classes.searchBarInput,
                    notchedOutline: classes.searchBarOutline,
                  },
                }}
                placeholder="Pesquisar..."
              />
            </Grid>
          </Grid>

          {/* Cards dinâmicos */}
          <Grid container spacing={2} style={{ marginTop: 16 }}>
            <Grid item xs={12} md={6}>
              <ResumoTimeCard />
            </Grid>
            <Grid item xs={12} md={6}>
              <ObjetivosSemanaCard />
            </Grid>
          </Grid>

          {/* Toolkit */}
          <Grid container spacing={2} style={{ marginTop: 24 }}>
            <Grid item xs={12}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.sectionTitle}>Ferramentas da Equipe</Typography>
                  <HomePageToolkit tools={tools} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

        </Content>
      </Page>
    </SearchContextProvider>
  );
};
