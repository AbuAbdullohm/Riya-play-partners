import React, { useEffect, useState } from "react";
import Actions from "modules/entity/actions";
import { useDispatch } from "react-redux";
import { get } from "lodash";
import { Icon } from "components";
import Icon1 from "assets/images/icon1.svg";
import Icon2 from "assets/images/icon2.svg";
import Icon3 from "assets/images/icon3.svg";

import Payme from "assets/images/payme.svg";
import Apelsin from "assets/images/uzum.svg";
import Paynet from "assets/images/paynet.svg";
import Click from "assets/images/icons/icons-dashboard/click.svg";
import Upay from "assets/images/icons/icons-dashboard/upay.svg";
import moment from "moment";

export default function BugalterComponent({ items, params }) {
	const [statistics, setStatistics] = useState();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(
			Actions.LoadDefault.request({
				url: "/transactions/statistics",
				cb: {
					success: data => {
						setStatistics(data);
					},
					error: error => {
						console.log(error);
					}
				},
				params: {
					extra: {
						phone: params.phone ? params.phone : "",
						invoice_id: params.invoice_id,
						type: params.type,
						user_id: params.user_id,
						payment_method: params.payment_method,
						start: (params.start || []).length > 0 ? params.start[0] : null,
						end: (params.start || []).length > 0 ? params.start[1] : null
					}
				}
			})
		);
	}, [params]);

	const transaction = get(statistics, "trnCount");
	const comming = get(statistics, "comming");
	const expanse = get(statistics, "expanse");
	const apelsin = get(statistics, "apelsin");
	const payme = get(statistics, "payme");
	const paynet = get(statistics, "paynet");
	const click = get(statistics, "click");
	const upay = get(statistics, "upay");

	return (
		<div>
			{params.start ? (
				<div className="text-right">
					<div className="viewDate">
						<p className="d-flex align-center">
							<Icon name="calendar" className="mr-2" /> {moment.unix(params.start[0]).format("DD/MM/YYYY")} -{" "}
							{moment.unix(params.start[1]).format("DD/MM/YYYY")}
						</p>
					</div>
				</div>
			) : (
				""
			)}
			<div className="bugalter">
				<div className="bugalter-box color1">
					<img src={Icon1} alt="" className="bugalterIcon" />
					<div>
						<h2 className="bugalter-box_1">
							Транзакции
							<span className="bugalter-box_span">i</span>
						</h2>
						<h1 className="total">{transaction}</h1>
					</div>
				</div>

				<div className="bugalter-box color2">
					<img src={Icon2} alt="" className="bugalterIcon" />
					<div>
						<h2 className="bugalter-box_2">
							Пополнение счета <span className="bugalter-box_span">i</span>
						</h2>
						<h1 className="total">
							{Number(comming || 0).toLocaleString("en-US", {
								style: "currency",
								currency: "UZS",
								minimumFractionDigits: 0
							})}
						</h1>
					</div>
				</div>

				<div className="bugalter-box color3">
					<img src={Icon3} alt="" className="bugalterIcon" />
					<div>
						<h2 className="bugalter-box_3">
							Абонентская плата <span className="bugalter-box_span">i</span>
						</h2>
						<h1 className="total">
							{Number(expanse || 0).toLocaleString("en-US", {
								style: "currency",
								currency: "UZS",
								minimumFractionDigits: 0
							})}
						</h1>
					</div>
				</div>

				<div className="bugalter-box color4">
					<div>
						<div className="bugalter-box_4_card">
							<img src={Paynet} alt="" />

							<p className="bugalter-box_4_card_p2">
								{Number(paynet || 0).toLocaleString("en-US", {
									style: "currency",
									currency: "UZS",
									minimumFractionDigits: 0
								})}
							</p>
						</div>
						<div className="bugalter-box_4_card">
							<div className="bugalter-box_4_card_img">
								<img
									src={Apelsin}
									alt=""
									style={{
										width: "5rem"
									}}
								/>
							</div>

							<p className="bugalter-box_4_card_p2">
								{Number(apelsin || 0).toLocaleString("en-US", {
									style: "currency",
									currency: "UZS",
									minimumFractionDigits: 0
								})}
							</p>
						</div>
						<div className="bugalter-box_4_card">
							<div className="bugalter-box_4_card_img">
								<img src={Payme} alt="" style={{ width: "70px" }} />
							</div>

							<p className="bugalter-box_4_card_p2">
								{Number(payme || 0).toLocaleString("en-US", {
									style: "currency",
									currency: "UZS",
									minimumFractionDigits: 0
								})}
							</p>
						</div>
						<div className="bugalter-box_4_card mb-0">
							<div className="bugalter-box_4_card_img">
								<img src={Click} alt="" style={{ width: "70px" }} />
							</div>

							<p className="bugalter-box_4_card_p2">
								{Number(click || 0).toLocaleString("en-US", {
									style: "currency",
									currency: "UZS",
									minimumFractionDigits: 0
								})}
							</p>
						</div>
						<div className="bugalter-box_4_card mb-0">
							<div className="bugalter-box_4_card_img">
								<img src={Upay} alt="" style={{ width: "70px" }} />
							</div>

							<p className="bugalter-box_4_card_p2">
								{Number(upay || 0).toLocaleString("en-US", {
									style: "currency",
									currency: "UZS",
									minimumFractionDigits: 0
								})}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
