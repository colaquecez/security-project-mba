interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  silentCallbackURL: string;
  audience: string;
  apiUrl: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: "VzVbLbJtyhM2W0LksAbzqcTOQKzsqBPT",
  domain: "dev-kwzy6a4g.us.auth0.com",
  callbackURL: "http://localhost:4200/callback",
  silentCallbackURL: "http://localhost:4200/silent",
  audience: "http://localhost:4200",
  apiUrl: "http://localhost:3000",
};
