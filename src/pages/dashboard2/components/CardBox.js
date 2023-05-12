import React from "react";
import { Panel } from "components";

export default function CardBox({ Icon, total, transaction, title }) {
	return (
		<Panel className="dashboard_cardBox">
			<Icon />
			<p className="dashboard_title">{title}</p>
			<p className="dashboard_result">
				{total
					? total
					: Number(transaction).toLocaleString("en-US", {
							style: "currency",
							currency: "UZS",
							minimumFractionDigits: 0
					  })}
			</p>
		</Panel>
	);
}
