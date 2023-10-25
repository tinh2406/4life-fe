import axios, { AxiosError } from "axios";

import {
  loginStart,
  loginSuccess,
  loginFalse,
  logoutStart,
  logoutSuccess,
  logoutFalse,
  registerStart,
  registerSuccess,
  registerFalse,
//   setPasswordUpdated,
//   setUserUpdated,
} from "./authSlice";

import { UserLogin } from "../types/model/userLogin";
import { UserRegister } from "../types/model/userRegister";
import { Action, Dispatch } from "redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loginUser = async (user: UserLogin , dispatch: Dispatch<Action>,navigate: (path: string) => void) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(
      "https://dctt.azurewebsites.net/api/auths/login",
      user
    );
    dispatch(loginSuccess(res.data));
    navigate("/home");
  } catch (err:unknown) {
    dispatch(loginFalse());
    const error = err as AxiosError;
    console.log(error);
    return error.response?.status;
  }
};

export const registerUser = async (user: UserRegister , dispatch: Dispatch<Action>,navigate: (path: string) => void) => {
  console.log("user register actionn:", user);
  dispatch(registerStart());
  try {
    const res = await axios.post(
      "https://dctt.azurewebsites.net/api/auths/register",
      user
    );
    console.log("user register:", res.data);
    dispatch(registerSuccess(res.data));
    navigate("/login");
  } catch (err:unknown) {
    dispatch(registerFalse());
    const error = err as AxiosError;
    console.log(error);
    return error.response?.status;
  }
};


export const logoutUser =  (dispatch: Dispatch<Action>,navigate: (path: string) => void) => {
  dispatch(logoutStart());
  try {
    // await axiosJWT.post("http://127.0.0.1:8000/api/users/logout", {
    //   headers: { authorization: `Bearer ${accessToken}` },
    // });
    dispatch(logoutSuccess());
    navigate("/home");
  } catch (err) {
    console.log(err);
    dispatch(logoutFalse());
  }
};

// export const changePassword = async (
//   newPass,
//   id,
//   dispatch,
//   accessToken,
//   navigate
// ) => {
//   console.log(newPass);
//   try {
//     const res = await axios.patch(
//       `http://127.0.0.1:8000/api/users/${id}/change-password`,
//       newPass,
//       {
//         headers: { authorization: `Bearer ${accessToken}` },
//       }
//     );
//     console.log(res.data);
//     dispatch(setPasswordUpdated(res.data));
//     navigate("/");
//   } catch (err) {
//     console.log(err);
//     return err.response.status;
//   }
// };

// export const updateUser = async (user, id, dispatch, accessToken, navigate) => {
//   console.log("user o tren:", user);
//   try {
//     const res = await axios.put(
//       `http://127.0.0.1:8000/api/users/${id}/update`,
//       user,
//       {
//         headers: { authorization: `Bearer ${accessToken}` },
//       }
//     );
//     console.log("user update action:", res.data);
//     dispatch(setUserUpdated(res.data));
//     // navigate("/");
//   } catch (err) {
//     // console.log("error", err.response);
//     return err.response.status;
//   }
// };
