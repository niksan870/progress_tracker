// in src/MyLoginPage.js
import React, { useState } from "react";
import { useLogin, useNotify, Notification } from "react-admin";
import { ThemeProvider } from "@material-ui/styles";

const MyLoginPage = ({ theme }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const notify = useNotify();
  const submit = (e) => {
    e.preventDefault();
    login({ username, password }).catch(() => notify("Invalid username or password"));
  };

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={submit}>
        <input
          name="username"
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <Notification />
    </ThemeProvider>
  );
};

export default MyLoginPage;
