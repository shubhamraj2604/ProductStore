// Determine the correct redirect URI based on environment

export const auth0Config = {
  domain: "dev-ui7xzdipe0qsutjl.us.auth0.com",
  clientId: "LGehVhHNN3k5OvE43Z2mPkqYjiGzPJvs",
  authorizationParams: {
    redirect_uri: window.location.origin
  }
}; 