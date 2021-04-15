import loginImg from "../../login.svg";
import React, { useState } from "react";
import { useLogin, useNotify, Notification } from "react-admin";
import { ThemeProvider } from "@material-ui/styles";

export const Login = ({ theme, containerRef }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const notify = useNotify();
  const submit = (e) => {
    e.preventDefault();
    login({ username, password }).catch(() =>
      notify("Invalid username or password")
    );
  };

  return (
    <ThemeProvider theme={theme} ref={containerRef}>
      <form onSubmit={submit}>
        <div className="base-container">
          <div className="header">Login</div>
          <div className="content">
            <div className="image">
              <img src={loginImg} alt="img" />
            </div>
            <div className="form">
              <div className="form-group">
                <input
                  name="username"
                  type="username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="footer">
            <button type="submit" className="btn">
              Login
            </button>
          </div>
        </div>
      </form>
      <Notification />
    </ThemeProvider>
  );
};

// export default Login;
