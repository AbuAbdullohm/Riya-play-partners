import { createRoutine } from "redux-saga-routines";

const ChangeLanguage = createRoutine("CHANGE_LANGUAGE");
const Reset = createRoutine("RESET");
const Callback = createRoutine("CALLBACK");
const UploadFile = createRoutine("UPLOAD_FILE");
const DeleteFile = createRoutine("DELETE_FILE");
const ChangeTheme = createRoutine("CHANGE_THEME");
const GetRates = createRoutine("GET_RATES");
const GetDownloadFile = createRoutine("GET_DOWNLOAD_FILE");
const GetAddDay = createRoutine("GET_ADD_DAY");
export default {
	ChangeLanguage,
	Reset,
	Callback,
	UploadFile,
	DeleteFile,
	ChangeTheme,
	GetRates,
	GetDownloadFile,
	GetAddDay
};
