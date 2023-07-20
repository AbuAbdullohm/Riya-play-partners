import React from "react";
import EntityContainer from "modules/entity/containers";
import api from "services/api";
import queryBuilder from "services/queryBuilder";
import { useNotification } from "hooks";

export default function DevicesModal({ modal, setModal }) {
	const user = modal;
	const { notification } = useNotification();

	function kickDevice(item) {
		api["requestv1"]
			.delete(
				queryBuilder("/user/kick-device", {
					extra: {
						token_id: item.id
					}
				})
			)
			.then(() => {
				setModal(false);
				notification("Успешно", {
					type: "success"
				});
			})
			.catch(() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			});
	}

	if (!modal) return "";

	return (
		<EntityContainer.All
			entity="/user/devices"
			name="/user/devices"
			url="/user/devices"
			version="v1"
			dataKey={"items"}
			params={{
				sort: "-id",
				extra: {
					page: 1,
					limit: 50,
					user_id: user.id
				}
			}}>
			{({ items, isFetched }) => {
				if (!isFetched) {
					return "Loading...";
				}

				if (items.length === 0) {
					return "Empty";
				}

				return items.map(item => {
					return (
						<div className="device-item mb-10" key={item.id}>
							<p>{item.phone}</p>
							<p>{item.user_agent}</p>
							<span onClick={() => kickDevice(item)}>x</span>
						</div>
					);
				});
			}}
		</EntityContainer.All>
	);
}
