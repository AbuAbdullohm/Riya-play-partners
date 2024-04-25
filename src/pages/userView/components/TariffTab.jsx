import React, { useState } from "react";
import { get } from "lodash";
import { Loader, Icon } from "components";
import EntityContainer from "modules/entity/containers";

export default function TariffTab({ activeTab, id }) {
	if (activeTab !== "tariff") return "";
	const [collapsedColumns, setCollapsedColumns] = useState([1]);

	const mock = [
		{
			id: 2,
			title: "nimadir",
			holders: ["O'zbek", "AQSH", "Rassiya"],
			price: "",
			isForeign: true
		},
		{
			id: 1,
			title: "nimadir",
			holders: ["O'zbek", "AQSH", "Rassiya"],
			price: "",
			isForeign: false
		}
	];

	function changeCollapse(id) {
		if (collapsedColumns.find(i => i === id)) {
			setCollapsedColumns(collapsedColumns.filter(i => i !== id));
		} else {
			setCollapsedColumns([id, ...collapsedColumns]);
		}
	}

	return (
		<EntityContainer.All
			entity={`/user/${id}/tariff`}
			name={`/user/${id}/tariff`}
			url={`/user/${id}/tariff`}
			version="v1"
			dataKey={"items"}
			params={{
				sort: "-id"
			}}>
			{({ isFetched, items }) => {
				if (!isFetched) return <Loader />;

				return [...items, ...mock].map(item => {
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
										{get(item, "title")}
									</p>
								</div>

								<div
									className="tariff-content"
									style={{
										maxHeight: collapsed ? "500px" : "0"
									}}>
									<div className="field">
										<div className="font-bold">Правообладатель:</div>
										<div className="holders">
											{get(item, "holders").map((holder, i) => {
												return (
													<span className="holder" key={i}>
														{holder}
													</span>
												);
											})}
										</div>
									</div>
									<div className="field d-flex align-items-center justify-content-between">
										<p className="font-bold">Цена:</p>
										<p>{get(item, "price")}</p>
									</div>
									<div className="field d-flex align-items-center justify-content-between">
										<p className="font-bold">Действует в течение:</p>
										<p>{get(item, "price")}</p>
									</div>
									<div className="field d-flex align-items-center justify-content-between">
										<p className="font-bold">Количество устройств:</p>
										<p>{get(item, "price")}</p>
									</div>
									<div className="field d-flex align-items-center justify-content-between">
										<p className="font-bold">Дата активации:</p>
										<p>{get(item, "price")}</p>
									</div>
									<div className="field d-flex align-items-center justify-content-between">
										<p className="font-bold">Срок действия до:</p>
										<p>{get(item, "price")}</p>
									</div>
									<div className="field d-flex align-items-center justify-content-between">
										<p className="font-bold">Статус использования:</p>
										<p>{get(item, "price")}</p>
									</div>
									<div className="field d-flex align-items-center justify-content-between">
										<p className="font-bold">Статус тарифа:</p>
										<p>{get(item, "price")}</p>
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
