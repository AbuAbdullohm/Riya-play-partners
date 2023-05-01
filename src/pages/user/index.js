import React from "react";
import EntityContainer from "modules/entity/containers";
import { useParams } from "react-router";
import { get } from "lodash";

export default function User() {
	const { id } = useParams();
	return (
		<EntityContainer.One
			key={"user"}
			entity="user"
			name="user"
			url={`/user/${id}`}
			version="v2"
			dataKey={"item"}
			params={{
				include: "files,userBalance,banned.reason,currentTariff.ratesPrice.rate,currentPromocode,currentPromocode.promoCode"
			}}>
			{({ item }) => {
				return (
					<div className="page-container">
						<div>id: {get(item, "id")}</div>
						<div>username: {get(item, "username")}</div>
						<div>full_name: {get(item, "full_name")}</div>
						<div>email: {get(item, "email")}</div>
						<div>phone: {get(item, "phone")}</div>
					</div>
				);
			}}
		</EntityContainer.One>
	);
}
