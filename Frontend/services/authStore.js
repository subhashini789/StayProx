let authSession = {
  token: null,
  user: null,
};

const listeners = new Set();

export const setAuthSession = ({ token, user }) => {
  authSession = { token, user };
  listeners.forEach((listener) => listener(authSession));
};

export const clearAuthSession = () => {
  authSession = { token: null, user: null };
  listeners.forEach((listener) => listener(authSession));
};

export const getAuthSession = () => authSession;

export const subscribeAuthSession = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
