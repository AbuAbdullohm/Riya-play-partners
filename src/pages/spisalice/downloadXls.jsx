import React, { useState } from "react";
import Actions from "store/actions/system";
import { useSelector, useDispatch } from "react-redux";
import get from "lodash/get";
import axios from "axios";
import { queryBuilder } from "services";
import { storage } from "services";
import { useNotification } from "hooks";
import { Button } from "components";
import qs from "query-string";
import { ReactComponent as DownloadIcon2 } from "assets/images/icons/download-file2.svg";
import { useLocation } from "react-router-dom";
import { useAccess } from "hooks";
const DownloadXls = ({ id }) => {
	const { downloadFile } = useSelector(state => state.system);
	const dispatch = useDispatch();

	const { notification } = useNotification();
	const [loading, setLoading] = useState({ state: false, search: null });
	const token = storage.get("token");
	const stateToken = useSelector(state => state.auth.token);
	const isAdmin = useAccess({ roles: ["admin"] });
	const location = useLocation();
	const query = qs.parse(location.search);
	const t = new Date().getTime();
	const urlLoad = queryBuilder("http://api.bektv.uz/v2/admin/reports/report-users", {
		extra: {
			name: query.username ? query.username : "",
			role: isAdmin ? (query.role ? query.role : "moderator,redactor") : query.role ? query.role : "admin,moderator,redactor,super_admin,bookkeeping",
			t
		}
	});

	const downloadDoc = id => {
		setLoading({ state: true, query });
		axios({
			url: urlLoad,
			method: "GET",
			responseType: "blob",
			headers: { Authorization: `Bearer ${stateToken ? stateToken : token}` }
		})
			.then(response => {
				dispatch(Actions.GetDownloadFile());

				// const link = document.createElement("a");
				// const file = new Blob([response.data]);
				// link.href = window.URL.createObjectURL(file);
				// link.setAttribute("download", `Отчет.xls`);
				// document.body.appendChild(link);
				// link.click();
				// setLoading({ state: false, query });
				// window.URL.revokeObjectURL(new Blob([response.data]));
				notification("Файл телеграмма отправлено", {
					type: "success"
				});
				setLoading({ state: false, query });
			})
			.catch(function(error) {
				setLoading({ state: false, query });
				const message = get(error, "message");
				notification(message, {
					type: "danger"
				});
			});
	};

	return (
		<Button.Default
			loading={!!loading.state}
			buttonType={"button"}
			size="lg"
			style={{ width: "100%" }}
			className={`${downloadFile.length > 0 && "events-none"}`}
			onClick={() => downloadDoc(query)}>
			<div className="d-flex align-center justify-content-between">
				<DownloadIcon2 className="btn--icon" />
				<span className="ml-3">Скачать</span>
			</div>
		</Button.Default>
	);
};

export default DownloadXls;
