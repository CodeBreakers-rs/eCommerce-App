export const encodeCredentials = (clientId: string, clientSecret: string) =>
  btoa(`${clientId}:${clientSecret}`)
