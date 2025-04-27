import React from 'react';
import { Page, Content } from '@backstage/core-components';
import {
  HomePageCompanyLogo,
  HomePageToolkit,
} from '@backstage/plugin-home';
import { HomePageSearchBar } from '@backstage/plugin-search';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import {
  Grid,
  makeStyles,
  Avatar,
  Typography,
  Paper,
} from '@material-ui/core';
import { tools } from './shared';

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
    marginBottom: theme.spacing(1.5),
    gap: theme.spacing(1.5),
  },
  userName: {
    fontWeight: 500,
    color: '#fff',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  block: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: theme.spacing(3),
    maxWidth: 800,
    width: '100%',
  },
}));

export const HomePage = () => {
  const classes = useStyles();

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
          <Grid container justifyContent="center" spacing={1}>
            <HomePageCompanyLogo
              logo={
                <img
                  src="/logo.png"
                  alt="LEDS HUB"
                  style={{
                    height: 180,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    marginTop: 4,
                    marginBottom: 4,
                  }}
                />
              }
            />
            <Grid container item xs={12} justifyContent="center" style={{ marginTop: -8 }}>
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

          {/* Ferramentas com Toolkit (sem título e sem "Ferramentas" acima) */}
          <div className={classes.wrapper}>
            <Paper elevation={0} className={classes.block}>
              <HomePageToolkit tools={tools} title="" />
            </Paper>
          </div>

        </Content>
      </Page>
    </SearchContextProvider>
  );
};
