import React from "react";
import { get } from "lodash";
import { helpers } from "services";

export default function ExtraDaysTab({ activeTab, user }) {
	if (activeTab !== "days") return "";

	return (
		<div className="extra-day_box" id="extra-day_box">
			{get(user, "extraTimeToSubscribes") &&
				get(user, "extraTimeToSubscribes").map((item, idx) => (
					<div className="d-flex extra-day" key={idx}>
						<p className="font-bold">Добавлено время: {helpers.formatDate(item.created_at * 1000, "DD.MM.YYYY / HH:mm")}</p>{" "}
						<p className="ml-3 font-medium">День добавления: {Number(item.extra_time) / 24 / 60 / 60}</p>
					</div>
				))}
		</div>
	);
}
