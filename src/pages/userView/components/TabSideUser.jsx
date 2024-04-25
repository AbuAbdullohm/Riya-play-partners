import React, { useState } from "react";
import { Panel, Tabs } from "components";

import UserTransaction from "./UserTransaction";
import DeviceTab from "./DeviceTab";
import ExtraDaysTab from "./ExtraDaysTab";
import PromocodeTab from "./PromocodeTab";
import TariffTab from "./TariffTab";

const tabTitleList = [
	{ code: "device", title: "Устройства" },
	{ code: "transaction", title: "Транзакции" },
	{ code: "days", title: "Доп-время" },
	{ code: "promocode", title: "Промокоды" },
	{ code: "tariff", title: "Подписки" }
];

export default function TabSideUser({ user, id, setConfirmModal, deviceList }) {
	const [activeTab, setActiveTab] = useState("device");
	return (
		<Panel className="tabs-panel">
			<Tabs activeItem={activeTab} items={tabTitleList} onTabChange={code => setActiveTab(code)} />
			{/*  */}

			<div className="tab-content">
				{/* device */}
				<DeviceTab activeTab={activeTab} deviceList={deviceList} setConfirmModal={setConfirmModal} />

				{/* transaction */}
				<UserTransaction activeTab={activeTab} user={user} />

				{/* days */}
				<ExtraDaysTab activeTab={activeTab} user={user} />

				{/* promocode */}
				<PromocodeTab activeTab={activeTab} id={id} />

				{/* tariff */}
				<TariffTab activeTab={activeTab} id={id} />
			</div>
		</Panel>
	);
}
