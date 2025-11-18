export const useLogin = () => {
  const login = async (credentials) => {
    try {
      const res = await fetch("https://api.mybmpl.com/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      return data;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  return { login };
};
