import { Button, TextField, Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useMatch, useNavigate, useLocation } from "react-router-dom";
import { clean, loginThunk, registerThunk } from "../../app/appSlice";
import { useAppDispatch } from "../../app/hooks";
import { RootState } from "../../app/store";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isRegister = useMatch("/register");
  const location = useLocation();
  const status = useSelector((state: RootState) => state.app.status);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const [matchText, setMatchText] = useState<string>("");

  useEffect(() => {
    dispatch(clean());
    setUsername("");
    setPassword("");
    setMatchText("");
    setPasswordConfirm("");
    return () => {
      dispatch(clean());
    };
  }, [dispatch, location]);

  const onLoginSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await dispatch(registerThunk({ username, password })).unwrap();
        navigate("/login");
      } else {
        await dispatch(loginThunk({ username, password })).unwrap();
        navigate("/");
      }
    } catch (error: any) {
      console.log(error);
      setErrorText(error.message);
    }
  };

  const onChangeValue = (
    value: string,
    field: "username" | "password" | "confirm"
  ) => {
    switch (field) {
      case "username":
        setUsername(value);
        break;
      case "password": {
        setPassword(value);
        if (isRegister && value !== passwordConfirm) {
          setMatchText("Password confirmation does not match.");
        } else {
          setMatchText("");
        }
        break;
      }
      case "confirm": {
        setPasswordConfirm(value);
        if (isRegister && value !== password) {
          setMatchText("Password confirmation does not match.");
        } else {
          setMatchText("");
        }
        break;
      }
    }
    if (status === "error") {
      dispatch(clean());
    }
  };

  return (
    <div className={styles.loginFormContainer}>
      <form className={styles.loginForm}>
        <Typography variant="h5" gutterBottom textAlign={"center"}>
          {isRegister ? "Sign up" : "Login"}
        </Typography>
        <TextField
          id="usernameInput"
          error={status === "error"}
          label="Username"
          variant="outlined"
          value={username}
          autoComplete="off"
          onChange={(e) => onChangeValue(e.target.value, "username")}
        />
        <div className={styles.separator} />
        <TextField
          id="passwordInput"
          error={status === "error"}
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => onChangeValue(e.target.value, "password")}
        />
        {isRegister && (
          <Fragment>
            <div className={styles.separator} />
            <TextField
              id="passwordConfirmInput"
              label="Confirm password"
              error={status === "error" || !!matchText}
              helperText={matchText}
              variant="outlined"
              type="password"
              value={passwordConfirm}
              onChange={(e) => onChangeValue(e.target.value, "confirm")}
            />
          </Fragment>
        )}
        <div className={styles.separator} />
        {status === "error" && (
          <Typography
            variant="caption"
            display="block"
            color={"red"}
            textAlign={"center"}
          >
            {errorText}
          </Typography>
        )}
        <div className={styles.confirmCancelButtonContainer}>
          <Button
            variant="contained"
            id="loginSubmit"
            onClick={onLoginSubmit}
            disabled={status === "loading" || (!!isRegister && !!matchText)}
          >
            Submit
          </Button>
        </div>
        <div className={styles.separator} />
        <Typography variant="body2" gutterBottom textAlign={"center"}>
          {isRegister ? (
            <Fragment>
              Already registered?{" "}
              {status !== "loading" && (
                <Link to={"/login"}>Click here to log in!</Link>
              )}
            </Fragment>
          ) : (
            <Fragment>
              Not registered yet?{" "}
              {status !== "loading" && (
                <Link to={"/register"}>Click here to sign up!</Link>
              )}
            </Fragment>
          )}
        </Typography>
      </form>
    </div>
  );
};

export default Login;
