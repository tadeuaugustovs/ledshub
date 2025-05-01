import React from 'react';
import { 
  SignInPage as BackstageSignInPage,
  SignInProviderConfig,
  githubAuthApiRef,
  googleAuthApiRef
} from '@backstage/core-components';
import { makeStyles, Box, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    height: '100vh',
    background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px', // Padding reduzido
    boxSizing: 'border-box',
    '& header': {
      display: 'none !important',
    },
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '280px', // Largura reduzida
  },
  buttonGroup: {
    width: '100%',
    marginBottom: '4px', // Espaço mínimo abaixo dos botões
    '& .MuiButton-root': {
      margin: '4px 0', // Espaçamento ultra-reduzido
      padding: '8px 16px', // Botões mais compactos
    },
    '& .MuiTypography-body1': {
      marginBottom: '4px', // Espaço reduzido entre texto e botão
    }
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.8rem', // Fonte menor
    textAlign: 'center',
    lineHeight: '1.2', // Linha mais compacta
    marginTop: '-10px', // Espaço mínimo acima
  }
});

const CustomSignInPage = (props: { providers: SignInProviderConfig[] }) => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Box className={classes.contentWrapper}>
        <Box className={classes.buttonGroup}>
          <BackstageSignInPage
            {...props}
            providers={props.providers}
            align="center"
            title={false}
          />
        </Box>
        
        <Typography className={classes.footerText}>
          May the force be with you
        </Typography>
      </Box>
    </div>
  );
};

export default CustomSignInPage;