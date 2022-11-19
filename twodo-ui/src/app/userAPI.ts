export const login = async (username: string, password: string) => {
  const requestHeaders = new Headers();
  requestHeaders.set("Content-Type", "application/json");
  const res = await fetch("/api/user/login", {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorResponse = await res.json();
    return Promise.reject(errorResponse);
  }
  return res.json();
};

export const logout = async () => {
  const res = await fetch("/api/user/logout", {
    method: "POST"
  });
  if (!res.ok) {
    const errorResponse = await res.json();
    return Promise.reject(errorResponse);
  }
  return res.json();
};

export const register = async (username: string, password: string) => {
  const requestHeaders = new Headers();
  requestHeaders.set("Content-Type", "application/json");
  const res = await fetch("/api/user/register", {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorResponse = await res.json();
    return Promise.reject(errorResponse);
  }
  return res.json();
};
