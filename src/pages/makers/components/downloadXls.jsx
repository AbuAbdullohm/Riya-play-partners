import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import get from "lodash/get";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { storage } from "services";
import { useNotification } from "hooks";
import { Button } from "components";
import { ReactComponent as DownloadIcon2 } from "assets/images/icons/download-file2.svg";
import qs from "qs";
import Actions from "store/actions/system";
import config from "config";
import { queryBuilder } from "services";

const DownloadXls = () => {
	const { downloadFile } = useSelector(state => state.system);
	const dispatch = useDispatch();

	const { notification } = useNotification();
	const [loading, setLoading] = useState({ state: false, search: null });
	const location = useLocation();
	const query = qs.parse(location.search, { ignoreQueryPrefix: true });
	let t = new Date().getTime();
	const extraList = ["name", "id", "kinopoisk_id", "external_type"];
	let extra = {};

	for (const key in query) {
		if (Object.hasOwnProperty.call(query, key)) {
			if (extraList.includes(key)) {
				extra = { ...extra, [key]: query[key] };
			}
			//  else if (filterList.includes(key)) {
			// 	filter = { ...filter, [key]: query[key] };
			// }
		}
	}
	const urlLoad = queryBuilder(`${config.API_ROOT_V2}/reports/report-actors`, {
		extra: {
			...extra,
			id: query.id,
			name: query.name,
			external_type: query.external_type,
			kinopoisk_id: query.kinopoisk_id,
			t
		}
	});

	const token = storage.get("token");
	const stateToken = useSelector(state => state.auth.token);

	const downloadDoc = id => {
		setLoading({ state: true, query });
		axios({
			url: urlLoad,
			method: "GET",
			responseType: "blob",
			headers: { Authorization: `Bearer ${stateToken ? stateToken : token}` }
		})
			.then(() => {
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
		<>
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
		</>
	);
};

export default DownloadXls;
