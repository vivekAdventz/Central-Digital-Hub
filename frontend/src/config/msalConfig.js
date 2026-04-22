/**
 * MSAL (Microsoft Authentication Library) Configuration
 * -------------------------------------------------------
 * Configure your Azure AD app registration details here.
 * These values come from the Azure Portal → App Registrations.
 */

export const msalConfig = {
  auth: {
    // Your Azure AD Application (client) ID
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'your-client-id',
    // Authority URL — use your tenant ID for single-tenant apps
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || 'common'}`,
    // Where Microsoft redirects after login
    redirectUri: window.location.origin,
  },
  cache: {
    // Store auth state in sessionStorage (cleared when tab closes)
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Scopes to request during login
export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
};
