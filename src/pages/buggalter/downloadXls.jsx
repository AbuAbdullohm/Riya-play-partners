import React, { useState } from "react";
import { useSelector } from "react-redux";
import get from "lodash/get";
import axios from "axios";
import { queryBuilder } from "services";

import { storage } from "services";
import { useNotification } from "hooks";
import { Button } from "components";
import { ReactComponent as DownloadIcon2 } from "assets/images/icons/download-file2.svg";
import { useLocation } from "react-router";
import config from "config";

const DownloadXls = () => {
	const { downloadFile } = useSelector(state => state.system);
	const { search } = useLocation();
	const { notification } = useNotification();
	const [loading, setLoading] = useState({ state: false, search: null });
	let t = new Date().getTime();
	const token = storage.get("token");
	const stateToken = useSelector(state => state.auth.token);

	const urlLoad = queryBuilder(`${config.API_ROOT_V1}/transactions/report${search}`, {
		extra: {
			t
		}
	});

	const downloadDoc = () => {
		setLoading({ state: true, search });
		axios({
			// url: `http://api.bektv.uz/v1/admin/transactions/report${search}?${timestamp}`,
			url: urlLoad,
			method: "GET",
			responseType: "blob",
			headers: { Authorization: `Bearer ${stateToken ? stateToken : token}` }
		})
			.then(response => {
				// const link = document.createElement("a");
				// const file = new Blob([response.data]);
				// link.href = window.URL.createObjectURL(file);
				// link.setAttribute("download", `Отчет.xls`);
				// document.body.appendChild(link);
				// link.click();
				// setLoading({ state: false, search });
				// window.URL.revokeObjectURL(new Blob([response.data]));

				notification("Файл телеграмма отправлено", {
					type: "success"
				});
				setLoading({ state: false, search });
			})
			.catch(function(error) {
				setLoading({ state: false, search });
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
			className={`mb-2 ${downloadFile.length > 0 && "events-none"}`}
			onClick={() => downloadDoc(search)}>
			<div className="d-flex align-center justify-content-between">
				<DownloadIcon2 className="btn--icon" />
				<span className="ml-3">Скачать</span>
			</div>
		</Button.Default>
	);
};

export default DownloadXls;
