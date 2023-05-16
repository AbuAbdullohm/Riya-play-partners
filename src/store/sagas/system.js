import { takeLatest, put, all, call } from "redux-saga/effects";

import { storage } from "services";
import systemActions from "../actions/system";
import { api, queryBuilder } from "services";

function* WorkTime(action) {
	storage.set("workTime", JSON.stringify(action.payload));
	yield put(systemActions.WorkTime.success());
}

function* ChangeLanguage(action) {
	storage.set("language", action.payload);
	yield put(systemActions.ChangeLanguage.success());
}

function* ChangeTheme(action) {
	storage.set("theme", action.payload);
	yield put(systemActions.ChangeTheme.success());
}

function* DeleteFile(action) {
	const { id, cb, version = "v1" } = action.payload;

	try {
		yield put(systemActions.DeleteFile.request());
		const { data } = yield call(api[`request${version}`].delete, queryBuilder(`/filemanager/${id}`));
		yield put(systemActions.DeleteFile.success({ files: data }));
		yield call(cb.success, data);
	} catch (e) {
		yield put(systemActions.DeleteFile.failure(e));
		yield call(cb.failure, e);
	} finally {
		yield put(systemActions.DeleteFile.fulfill());
		yield call(cb.finally);
	}
}

function* UploadFile(action) {
	const { files, cb, version = "v1" } = action.payload;

	try {
		const { data } = yield call(api[`request${version}`].post, queryBuilder("/filemanager/uploads"), files);

		yield put(systemActions.UploadFile.success({ files: data }));
		yield call(cb.success, data);
	} catch (e) {
		yield put(systemActions.UploadFile.failure(e));
		yield call(cb.failure, e);
	} finally {
		yield put(systemActions.UploadFile.fulfill());
		yield call(cb.finally);
	}
}

function* GetRates() {
	try {
		const { data } = yield call(api.request.get, queryBuilder("/rates"));
		const newData = data.data && data.data;
		yield put(systemActions.GetRates.success(newData));
	} catch (e) {
		yield put(systemActions.GetRates.failure(e));
	} finally {
		yield put(systemActions.GetRates.fulfill());
	}
}

function* GetDownloadFile() {
	try {
		const { data } = yield call(api.request.get, queryBuilder(`/log`, { filter: { status: 100 } }));
		const newData = data.data && data.data;
		yield put(systemActions.GetDownloadFile.success(newData));
	} catch (e) {
		yield put(systemActions.GetDownloadFile.failure(e));
	} finally {
		yield put(systemActions.GetDownloadFile.fulfill());
	}
}
function* GetAddDay() {
	try {
		const { data } = yield call(api.request.get, queryBuilder(`/log`, { filter: { status: 300 } }));
		const newData = data.data && data.data;
		yield put(systemActions.GetAddDay.success(newData));
	} catch (e) {
		yield put(systemActions.GetAddDay.failure(e));
	} finally {
		yield put(systemActions.GetAddDay.fulfill());
	}
}

export default function* root() {
	yield all([
		takeLatest(systemActions.ChangeLanguage.TRIGGER, ChangeLanguage),
		takeLatest(systemActions.ChangeTheme.TRIGGER, ChangeTheme),
		takeLatest(systemActions.UploadFile.TRIGGER, UploadFile),
		takeLatest(systemActions.DeleteFile.TRIGGER, DeleteFile),
		takeLatest(systemActions.GetRates.TRIGGER, GetRates),
		takeLatest(systemActions.GetDownloadFile.TRIGGER, GetDownloadFile),
		takeLatest(systemActions.GetAddDay.TRIGGER, GetAddDay),
		takeLatest(systemActions.WorkTime.TRIGGER, WorkTime)
	]);
}
