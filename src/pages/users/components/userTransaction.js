import React, { useState, useEffect } from "react";
import { get } from "lodash";
import EntityContainer from "modules/entity/containers";
import { useSelector } from "react-redux";
import { helpers } from "services";
import { Loader, Icon, Button } from "components";

import BektvBox from "assets/images/bektvbox.svg";
import PaymeUser from "assets/images/paymeUser.svg";
import ApelsinUser from "assets/images/apelsinUser.svg";
import PaynetUser from "assets/images/paynetUser.png";
import Click from "assets/images/click.png";

export default function UserTransaction({ user }) {
	const ratesData = useSelector(state => state.system.rates);

	const [trnType, setTrnType] = useState(null);
	const [perPage, setPerPage] = useState(1);

	return (
		<EntityContainer.All
			entity="transactions"
			name={`all`}
			url={`/transactions`}
			primaryKey="transaction_id"
			dataKey={"data"}
			appendData
			params={{
				page: perPage || "",
				extra: {
					phone: get(user, "phone") ? get(user, "phone") : "",
					type: trnType || ""
				}
			}}
			onSuccess={() => {}}>
			{({ items, isFetched, meta }) => {
				return (
					<>
						<div className="d-flex gap-2">
							<div
								onClick={() => {
									setTrnType(null);
									setPerPage(1);
								}}
								className={`viewTransaction_tab ${trnType === null ? "active" : ""}`}>
								Все транзакции
							</div>
							<div
								onClick={() => {
									setPerPage(1);
									setTrnType(1);
								}}
								className={`viewTransaction_tab ${trnType === 1 ? "active" : ""}`}>
								Пополнение счета
							</div>
							<div
								onClick={() => {
									setPerPage(1);
									setTrnType(2);
								}}
								className={`viewTransaction_tab ${trnType === 2 ? "active" : ""}`}>
								Покупка тарифа
							</div>
						</div>
						<div className="viewTransaction" id="viewTransaction">
							{!isFetched ? (
								<Loader />
							) : items && items.length > 0 ? (
								<>
									<table className="table">
										<tbody>
											{items &&
												items.map((item, id) => {
													let rates = ratesData.find(i => i.id === get(item, "invoice_id.trip_id"));
													return (
														<React.Fragment key={id}>
															<tr className="table_tr">
																<td>
																	<div className="viewTransaction-box">
																		<img
																			src={
																				item.payment_method === "payme"
																					? PaymeUser
																					: item.payment_method === "From Api"
																					? BektvBox
																					: item.payment_method === "apelsin"
																					? ApelsinUser
																					: item.payment_method === "paynet"
																					? PaynetUser
																					: item.payment_method === "click"
																					? Click
																					: ""
																			}
																			alt={
																				item.payment_method === "payme"
																					? "Payme"
																					: item.payment_method === "From Api"
																					? "From Api"
																					: item.payment_method === "apelsin"
																					? "apelsin"
																					: item.payment_method === "paynet"
																					? "paynet"
																					: ""
																			}
																		/>
																		<div className="viewTransaction-box-way">
																			<p className="viewText mb-0">
																				{rates
																					? rates.name_ru
																					: item.payment_method === "payme"
																					? "Payme"
																					: item.payment_method === "apelsin"
																					? "Apelsin"
																					: item.payment_method === "paynet"
																					? "Paynet"
																					: item.payment_method === "click"
																					? "Click"
																					: ""}
																			</p>
																			<div className="viewText">
																				{helpers.formatDate(item.created_at * 1000, "DD.MM.YYYY / HH:mm:ss")}
																			</div>
																		</div>
																	</div>
																</td>
																<td className="text-center">
																	<div>
																		<div
																			className={`viewTransaction-p ${
																				item.payment_method !== "From Api" ? "payment-green" : "payment-red"
																			}`}>
																			{Number(item.amount).toLocaleString("en-US", {
																				style: "currency",
																				currency: "UZS",
																				minimumFractionDigits: 0
																			})}
																		</div>
																	</div>
																</td>
															</tr>
														</React.Fragment>
													);
												})}
										</tbody>
									</table>
									{get(meta, "currentPage") < get(meta, "pageCount") && (
										<div className="d-flex justify-content-center">
											<Button.Default loading={!isFetched} onClick={() => setPerPage(p => p + 1)}>
												Barchasini ko'rish
											</Button.Default>
										</div>
									)}
								</>
							) : (
								<h1 className="not-found">Этот пользователь еще не производил платеж</h1>
							)}
						</div>
					</>
				);
			}}
		</EntityContainer.All>
	);
}
