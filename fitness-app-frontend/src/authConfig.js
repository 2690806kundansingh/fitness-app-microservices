const keycloakBase = import.meta.env.VITE_KEYCLOAK_URL || 'https://keycloak-production-abf4.up.railway.app/realms/fitness-oauth2';
const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

export const authConfig = {
    clientId: 'oauth2-pkce-client',
    authorizationEndpoint: `${keycloakBase}/protocol/openid-connect/auth`,
    tokenEndpoint: `${keycloakBase}/protocol/openid-connect/token`,
    redirectUri: redirectOrigin,
    scope: 'openid profile email offline_access',
    onRefreshTokenExpire: (event) => event.logIn(),
};