import { PropsWithChildren } from 'react';
import { Home as HomeIcon } from '@material-ui/icons';
import ExtensionIcon from '@material-ui/icons/Extension';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import GroupIcon from '@material-ui/icons/People';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CategoryIcon from '@material-ui/icons/Category';
import SettingsIcon from '@material-ui/icons/Settings';
import {
  Settings as SidebarSettings,
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
        {/* Menu principal */}
        <SidebarItem icon={HomeIcon} to="/" text="Home" />
        <SidebarItem icon={CategoryIcon} to="/catalog" text="Catálogo" />
        <MyGroupsSidebarItem
          singularTitle="Minha equipe"
          pluralTitle="Minha equipe"
          icon={GroupIcon}
        />
        <SidebarItem icon={ExtensionIcon} to="/api-docs" text="APIs" />
        {/* Documentação removida */}
        <SidebarItem icon={CreateComponentIcon} to="/create" text="Criar" />
        {/* Fim do menu */}
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
