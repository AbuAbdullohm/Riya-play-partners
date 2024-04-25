import React, { useState } from "react";
import { get } from "lodash";
import { Loader, Icon } from "components";
import EntityContainer from "modules/entity/containers";
import { time } from "services";

export default function PromocodeTab({ activeTab, id }) {
	if (activeTab !== "promocode") return "";
	const [collapsedColumns, setCollapsedColumns] = useState([]);

	function changeCollapse(id) {
		if (collapsedColumns.find(i => i === id)) {
			setCollapsedColumns(collapsedColumns.filter(i => i !== id));
		} else {
			setCollapsedColumns([id, ...collapsedColumns]);
		}
	}

	return (
		<EntityContainer.All
			entity={`/user/${id}/promocodes`}
			name={`/user/${id}/promocodes`}
			url={`/user/${id}/promocodes`}
			version="v1"
			dataKey={"items"}
			params={{
				sort: "-id"
			}}>
			{({ isFetched, items }) => {
				if (!isFetched) return <Loader />;

				return items.map(item => {
					const collapsed = collapsedColumns.find(i => i === item.id);
					return (
						<div className="tariff_box" key={get(item, "id")}>
							{get(item, "isForeign") && (
								<div className="is-foreign">
									<Icon name="globe" />
								</div>
							)}
							<div className="tariff">
								<div className="collapsed-title">
									<p className="font-bold">Названия:</p>
									<p
										className="font-bold"
										style={{
											marginRight: get(item, "isForeign") ? "30px" : "0"
										}}>
										{get(item, "title_ru")}
									</p>
								</div>

								<div
									className="tariff-content"
									style={{
										maxHeight: collapsed ? "500px" : "0"
									}}>
									<div className="field">
										<div className="font-bold">Тарифы промокодa:</div>
										<div className="holders">
											{get(item, "tariff", []).map((holder, i) => {
												return (
													<span className="holder" key={i}>
														{holder}
													</span>
												);
											})}
										</div>
									</div>
									<div className="field">
										<div className="font-bold">Правообладатель:</div>
										<div className="holders">
											{get(item, "holders", []).map((holder, i) => {
												return (
													<span className="holder" key={i}>
														{holder}
													</span>
												);
											})}
										</div>
									</div>

									<div className="field d-flex align-items-center justify-content-between">
										<p className="font-bold">Действует в течение:</p>
										<p>{get(item, "available_day")}</p>
									</div>
									<div className="field d-flex align-items-center justify-content-between">
										<p className="font-bold">Количество устройств:</p>
										<p>{get(item, "users_count")}</p>
									</div>
									<div className="field d-flex align-items-center justify-content-between">
										<p className="font-bold">Дата активации промокодa:</p>
										<p>{time.to(get(item, "created_at"))}</p>
									</div>
									<div className="field d-flex align-items-center justify-content-between">
										<p className="font-bold">Срок действия промокодa:</p>
										<p>{time.to(get(item, "expire_at"))}</p>
									</div>
									<div className="field d-flex align-items-center justify-content-between">
										<p className="font-bold">Статус использования:</p>
										<p>{get(item, "")}</p>
									</div>
									<div className="field d-flex align-items-center justify-content-between">
										<p className="font-bold">Статус промокодa:</p>
										<p className={get(item, "status") === 1 ? "green" : "red"}>{get(item, "status") === 1 ? "Активный" : "Неактивный"}</p>
									</div>
								</div>
								<div className="collapsed-button" onClick={() => changeCollapse(item.id)}>
									<Icon name={collapsed ? "chevron-up" : "chevron-down"} />
								</div>
							</div>
						</div>
					);
				});
			}}
		</EntityContainer.All>
	);
}
