import React from "react";
import { Panel } from "components";
export default function CardBox({ img, total, transaction, title }) {
	return (
		<Panel className="dashboard_cardBox">
			<img src={img} alt="" />
			<p className="dashboard_title">{title}</p>
			<p className="dashboard_result">
				{total
					? String(total).replace(/(.)(?=(\d{3})+$)/g, "$1,")
					: Number(transaction).toLocaleString("en-US", {
							style: "currency",
							currency: "UZS",
							minimumFractionDigits: 0
					  })}
			</p>
		</Panel>
	);
}
