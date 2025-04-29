import { useApi } from '@backstage/core-plugin-api';
import { githubAuthApiRef, googleAuthApiRef } from '@backstage/core-plugin-api';
import { Button } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import GoogleIcon from '@material-ui/icons/AccountCircle';
import './CustomSignInPage.css'; 
import logo from '../../assets/logo.png'; // ou o caminho certo da sua logo

export function CustomSignInPage() {
  const githubApi = useApi(githubAuthApiRef);
  const googleApi = useApi(googleAuthApiRef);

  const handleGitHubSignIn = async () => {
    await githubApi.signIn();
  };

  const handleGoogleSignIn = async () => {
    await googleApi.signIn();
  };

  return (
    <div className="custom-signin-page">
      <img src={logo} alt="LEDS HUB" className="custom-logo" />
      <h2 className="custom-text">Logar com:</h2>
      <div className="custom-buttons">
        <Button
          variant="contained"
          style={{ backgroundColor: '#ffffff', color: '#000000', margin: '10px' }}
          startIcon={<GitHubIcon />}
          onClick={handleGitHubSignIn}
        >
          GitHub
        </Button>
        <Button
          variant="contained"
          style={{ backgroundColor: '#4285F4', color: '#ffffff', margin: '10px' }}
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
        >
          Google
        </Button>
      </div>
    </div>
  );
}
