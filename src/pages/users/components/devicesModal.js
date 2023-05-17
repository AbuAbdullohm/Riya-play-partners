import React from "react";
import EntityContainer from "modules/entity/containers";

export default function DevicesModal({ modal, setModal }) {
	const user = modal;

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
			{({ items }) => {
				return items.map(item => {
					return (
						<div key={item.id}>
							<div>{item.phone}</div>
							<div>{item.user_agent}</div>
						</div>
					);
				});
			}}
		</EntityContainer.All>
	);
}
