import React from "react";
import Chart from "react-apexcharts";
import { get } from "lodash";

export default function Donut({ items, keyword, ratesData }) {
	const getChartSeries = (items, keyword) => {
		if (keyword === "chart1") {
			return items && get(items, "expenses", []).map(item => Number(item.amount));
		} else if (keyword === "chart2") {
			return items && get(items, "incomes", []).map(item => Number(item.amount));
		}
	};

	const getChartLabel = keyword => {
		if (keyword === "chart1") {
			return get(items, "expenses", []).map(item => {
				const rates = ratesData && ratesData.find(rates => rates.id === item.invoice_id);
				return rates ? rates.name_ru : "-";
			});
		} else if (keyword === "chart2") {
			return get(items, "incomes", []).map(item => item.payment_method.toUpperCase());
		}
	};

	const getChartColor = (items, keyword) => {
		if (keyword === "chart1") {
			return ["#3F8CFF", "#8263CC", "#EDA430", "#147D43", "#a52a2a", "#84c5b2", "#1b3ed4", "#2B4285", "#bc75d0", "#0df721", "#ffd000"];
		} else if (keyword === "chart2") {
			return get(items, "incomes", []).map(item => item.colorIncomes);
		}
	};

	const result = {
		options: {
			colors: getChartColor(items, keyword),
			tooltip: {
				y: {
					formatter: function(y) {
						if (typeof y !== "undefined") {
							return `
								<span>
									${Number(y).toLocaleString("en-US", {
										style: "currency",
										currency: "UZS",
										minimumFractionDigits: 0
									})}
								</span>`;
						}
						return y;
					}
				}
			},

			labels: getChartLabel(keyword)
		},
		series: getChartSeries(items, keyword)
	};

	return (
		<div className="donut">
			<Chart options={result.options} series={result.series} type="donut" width="300" />
		</div>
	);
}
