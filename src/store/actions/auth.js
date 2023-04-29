import { createRoutine } from "redux-saga-routines";
const GetMe = createRoutine("GET_ME");
const Login = createRoutine("LOGIN");
const Registration = createRoutine("REGISTRATION");
const Logout = createRoutine("LOGOUT");

export default {
    GetMe,
    Logout,
    Login,
    Registration
};
