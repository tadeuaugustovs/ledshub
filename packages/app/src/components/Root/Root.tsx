import { PropsWithChildren } from 'react';
import { Home as HomeIcon } from '@material-ui/icons';
import ExtensionIcon from '@material-ui/icons/Extension';
import GroupIcon from '@material-ui/icons/People';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import FeedIcon from '@mui/icons-material/Feed';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import LanguageIcon from '@mui/icons-material/Language';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ApiIcon from '@mui/icons-material/Api';

import {
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarScrollWrapper,
  SidebarSpace,
  useSidebarOpenState,
  Link,
} from '@backstage/core-components';
import { MyGroupsSidebarItem } from '@backstage/plugin-org';
import { DeveloperBoard } from '@mui/icons-material';

const SidebarLogo = () => {
  const { isOpen } = useSidebarOpenState();
  const logoSrc = isOpen ? '/logo.png' : '/logo.png';

  return (
    <div
      style={{
        width: '100%',
        height: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 0 8px 0',
      }}
    >
      <Link
        to="/"
        underline="none"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <img
          src={logoSrc}
          alt="LEDS HUB"
          style={{
            maxHeight: 85,
            maxWidth: 185,
            objectFit: 'contain',
          }}
        />
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarGroup label="Busca" icon={<SearchIcon />} to="/search">
        <SidebarSearchModal />
      </SidebarGroup>
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarItem icon={HomeIcon} to="/" text="Início" />
        <SidebarItem icon={DeveloperBoardIcon} to="/catalog" text="Tudo" />
        <MyGroupsSidebarItem
          singularTitle="Minha equipe"
          pluralTitle="Minha equipe"
          icon={GroupIcon}
        />
        <SidebarItem icon={ExtensionIcon} to="/api-docs" text="APIs" />
        <SidebarItem icon={LanguageIcon} to='/websites' text="WebSites" />
        <SidebarItem icon={AccountTreeIcon} to='/workflows' text="Workflows" />
        <SidebarItem icon={ApiIcon} to='/endpoints' text="Endpoints" />
        <SidebarItem icon={FeedIcon} to="/create" text="Templates" />
        <SidebarDivider />
        <SidebarScrollWrapper />
      </SidebarGroup>
      <SidebarSpace />
      <SidebarDivider />
      <SidebarGroup
        label="Configurações"
        icon={<UserSettingsSignInAvatar />}
        to="/settings"
      >
        <SidebarItem icon={SettingsIcon} to="/settings" text="Configurações" />
      </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
);
