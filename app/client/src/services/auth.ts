export const isUserLoggedIn = async (): Promise<boolean> => {
  const token = localStorage.getItem("authToken");
  return !!token;
};
