import React from "react";
import { get } from "lodash";
import { helpers, time } from "services";
import "./style.scss";

export default function View({ viewData }) {
	const getViewType = value => {
		if (get(value, "type") === 4) {
			if (get(value, "balance_filter") === 2) {
				return (
					<>
						<p className="mb-3">Тип пользователя : Пользователи с промокодам</p>{" "}
						{get(viewData, "date") ? <p>Время окончания тарифа : {helpers.formatDate(get(viewData, "date"), "DD.MM.YYYY / HH:mm:ss")}</p> : ""}
					</>
				);
			} else if (get(value, "balance_filter") === 1) {
				return "Тип пользователя : Пользователи с тарифами";
			} else if (get(value, "balance_filter") === 3) {
				return "Тип пользователя : Обычный пользователи";
			} else if (get(value, "balance_filter") === 4) {
				return "Тип пользователя : Все пользователи";
			}
		} else if (get(value, "type") === 3) {
		} else if (get(value, "type") === 2) {
			if (get(value, "model")) {
				return get(value, "model.name_ru");
			}
		} else if (get(value, "type") === 1) {
			if (get(value, "model")) {
				return get(value, "model.title");
			}
		}
	};

	const getViewTypeTitle = value => {
		if (value === 4) {
			return "По тарифу";
		} else if (value === 3) {
			return "Уведомление";
		} else if (value === 2) {
			return "Фильмы";
		} else if (value === 1) {
			return "Новости";
		}
	};
	return (
		<div className="notification-view">
			<div className="notification-view-inner">
				<p>Заголовок</p>
				<p className="notification-view-inner_info">{get(viewData, "title") ? get(viewData, "title") : "-"}</p>

				<p className="mt-3">Описание</p>
				<p className="notification-view-inner_info">{get(viewData, "message") ? get(viewData, "message") : "-"}</p>

				<p className="mt-3">Тип: {getViewTypeTitle(get(viewData, "type"))}</p>
				<div className="notification-view-inner_info">{getViewType(viewData) ? getViewType(viewData) : "-"}</div>

				<p className="mt-3">Перенаправление:</p>
				<div className="notification-view-inner_info">
					{get(viewData, "type") === 1 ? get(viewData, "model.title", "-") : get(viewData, "type") === 2 ? get(viewData, "model.name_ru", "-") : "-"}
				</div>

				<p className="mt-3">Дата создания:</p>
				<div className="notification-view-inner_info">{get(viewData, "date") ? time.to(get(viewData, "date"), "DD.MM.YYYY HH:mm") : "-"}</div>

				<p className="mt-3">Кол-во отправленных пользователей:</p>
				<div className="notification-view-inner_info">{get(viewData, "usersCount") ? get(viewData, "usersCount", "-") : "-"}</div>
			</div>
		</div>
	);
}
