import React from "react";
import { get } from "lodash";
import { Icon } from "components";
import { time } from "services";

export default function DeviceTab({ activeTab, deviceList, setConfirmModal }) {
	if (activeTab !== "device") return "";

	return deviceList.map(device => {
		return (
			<div className="device-item" key={device.id}>
				<p>{device.device_name}</p>
				<p>{time.to(device.created_at, "DD.MM.YYYY / HH:mm:ss")}</p>
				<p>{`IP: ${get(device, "user_ip")}`}</p>
				<p className="trash" onClick={() => setConfirmModal({ open: true, item: device })}>
					<Icon name="trash-2" />
				</p>
			</div>
		);
	});
}
