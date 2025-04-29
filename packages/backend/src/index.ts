/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import { createBackend } from '@backstage/backend-defaults';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { stringifyEntityRef, DEFAULT_NAMESPACE } from '@backstage/catalog-model';

// ✅ Configura apenas o GitHub manualmente
const customAuthResolver = createBackendModule({
  pluginId: 'auth',
  moduleId: 'custom-auth-provider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        // 🔵 GitHub login
        providers.registerProvider({
          providerId: 'github',
          factory: createOAuthProviderFactory({
            authenticator: githubAuthenticator,
            additionalScopes: ['read:user', 'user:email'],
            async signInResolver(info, ctx) {
              let email = info.profile.email;

              if (!email) {
                const accessToken = info.result.session?.accessToken;
                if (!accessToken) {
                  throw new Error('Login falhou: Access token não encontrado.');
                }

                const emailResponse = await fetch('https://api.github.com/user/emails', {
                  headers: {
                    Authorization: `token ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json',
                  },
                });

                if (!emailResponse.ok) {
                  throw new Error('Login falhou: Não foi possível buscar emails do GitHub.');
                }

                const emails = await emailResponse.json();
                const primaryEmail = emails.find((e: any) => e.primary && e.verified);

                if (!primaryEmail) {
                  throw new Error('Login falhou: Nenhum email primário e verificado encontrado.');
                }

                email = primaryEmail.email;
              }

              if (!email) {
                throw new Error('Login falhou: o perfil do usuário não possui email.');
              }

              const [localPart] = email.split('@');

              try {
                await ctx.findCatalogUser({ entityRef: { name: localPart } });
                return ctx.signInWithCatalogUser({
                  entityRef: {
                    kind: 'User',
                    namespace: DEFAULT_NAMESPACE,
                    name: localPart,
                  },
                });
              } catch (error) {
                console.warn(`Usuário '${localPart}' não encontrado no catalog. Permitindo login sem entidade.`);

                const userEntityRef = stringifyEntityRef({
                  kind: 'User',
                  namespace: DEFAULT_NAMESPACE,
                  name: localPart,
                });

                return ctx.issueToken({
                  claims: {
                    sub: userEntityRef,
                    ent: [userEntityRef],
                  },
                });
              }
            },
          }),
        });
      },
    });
  },
});

const backend = createBackend();

// Plugins padrão
backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@backstage/plugin-techdocs-backend'));

// 🔵 Apenas o auth backend principal
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-google-provider'));

backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'));
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

backend.add(import('@backstage/plugin-permission-backend'));
backend.add(import('@backstage/plugin-permission-backend-module-allow-all-policy'));

backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-pg'));
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

backend.add(import('@backstage/plugin-kubernetes-backend'));

// ✅ Adiciona o customAuthResolver personalizado
backend.add(customAuthResolver);

backend.start();
