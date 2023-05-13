import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import get from "lodash/get";
import axios from "axios";
import { queryBuilder } from "services";
import { storage } from "services";
import { useNotification } from "hooks";
import qs from "qs";
import Actions from "store/actions";
import { Button } from "components";
import { ReactComponent as DownloadIcon2 } from "assets/images/icons/download-file2.svg";
import { useLocation } from "react-router-dom";
import config from "config";

const DownloadXls = () => {
	const { downloadFile } = useSelector(state => state.system);
	const dispatch = useDispatch();

	const { notification } = useNotification();
	const [loading, setLoading] = useState({ state: false, search: null });
	const location = useLocation();
	const query = qs.parse(location.search, { ignoreQueryPrefix: true });
	const token = storage.get("token");
	const stateToken = useSelector(state => state.auth.token);
	const extraList = [
		"phone",
		"name",
		"balance",
		"promoCode",
		"tariff_id",
		"last_subscribe",
		"balance_filter",
		"sort",
		"id",
		"status",
		"subscribe_type",
		"is_active",
		"is_active1",
		"is_active2"
	];
	const filterList = [];
	let t = new Date().getTime();
	let extra = {};
	let filter = {};

	for (const key in query) {
		if (Object.hasOwnProperty.call(query, key)) {
			if (extraList.includes(key)) {
				extra = { ...extra, [key]: query[key] };
			} else if (filterList.includes(key)) {
				filter = { ...filter, [key]: query[key] };
			}
		}
	}

	const urlLoad = queryBuilder(`${config.API_ROOT_V1}/reports/report-users`, {
		extra: {
			...extra,
			foreign_user: 1,
			subscribe_finish_date_start: (query.rates_finish || []).length > 0 ? query.rates_finish[0] : null,
			subscribe_finish_date_end: (query.rates_finish || []).length > 0 ? query.rates_finish[1] : null,
			subscribe_got_date_end: (query.rates_start || []).length > 0 ? query.rates_start[1] : null,
			subscribe_got_date_start: (query.rates_start || []).length > 0 ? query.rates_start[0] : null,
			user_created_start: (query.user_created || []).length > 0 ? query.user_created[0] : null,
			user_created_end: (query.user_created || []).length > 0 ? query.user_created[1] : null,
			t
		}
	});

	const downloadDoc = () => {
		setLoading({ state: true, query });
		axios({
			url: urlLoad,
			method: "GET",
			responseType: "blob",
			headers: { Authorization: `Bearer ${stateToken ? stateToken : token}` }
		})
			.then(() => {
				dispatch(Actions.system.GetDownloadFile());
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
			onClick={() => {
				downloadDoc(query);
			}}>
			<div className="d-flex align-center justify-content-between">
				<DownloadIcon2 className="btn--icon" />
				<span className="ml-3">Скачать</span>
			</div>
		</Button.Default>
	);
};

export default DownloadXls;
