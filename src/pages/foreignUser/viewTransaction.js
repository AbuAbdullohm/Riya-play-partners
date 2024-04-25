import React, { useState, useEffect } from "react";
import { get } from "lodash";
import EntityContainer from "modules/entity/containers";
import { useSelector } from "react-redux";
import { helpers } from "services";
import { Loader, Icon } from "components";

import { ReactComponent as RiyaPlay } from "assets/images/icons/riya.svg";
import { ReactComponent as Payme } from "assets/images/icons/payme.svg";
import { ReactComponent as Uzum } from "assets/images/icons/uzum.svg";
import { ReactComponent as Paynet } from "assets/images/icons/paynet.svg";
import { ReactComponent as Click } from "assets/images/icons/click.svg";

const ViewTransaction = ({ idModal, viewTransaction }) => {
	const [trnData, setTrnData] = useState();

	const [trnType, setTrnType] = useState(null);
	const ratesData = useSelector(state => state.system.rates);

	useEffect(() => {
		if (viewTransaction) {
			setTrnType(null);
		}
	}, [viewTransaction]);
	return (
		<>
			{get(idModal, "phone") ? (
				<EntityContainer.One
					entity="user"
					name={`all`}
					url={`/transactions`}
					primaryKey="transaction_id"
					onSuccess={data => {
						setTrnData(data.data);
					}}
					params={{
						extra: {
							phone: get(idModal, "phone") ? get(idModal, "phone") : "",
							type: trnType || ""
						}
					}}>
					{({ isFetched }) => {
						return (
							<>
								{trnData && trnData.length > 0 ? (
									<>
										<div className="d-flex gap-2">
											<div onClick={() => setTrnType(null)} className={`viewTransaction_tab ${trnType === null ? "active" : ""}`}>
												<Icon name="transaction" />
												Все транзакции
											</div>
											<div onClick={() => setTrnType(1)} className={`viewTransaction_tab ${trnType === 1 ? "active" : ""}`}>
												<Icon name="log-out" className="logOutIcon" />
												Пополнение счета
											</div>
											<div onClick={() => setTrnType(2)} className={`viewTransaction_tab ${trnType === 2 ? "active" : ""}`}>
												<Icon name="log-out" className="logOutIcon_down" />
												Покупка тарифа
											</div>
										</div>
										<div className="viewTransaction" id="viewTransaction">
											{isFetched ? (
												<>
													<table cellSpacing={10} className="table">
														<thead>
															<tr>
																<th scope="col" className="viewTitle w-33">
																	Тип и метод транзакции
																</th>
																<th scope="col" className="viewTitle w-33 text-center">
																	Дата и время
																</th>
																<th scope="col" className="viewTitle w-33 text-center">
																	Сумма
																</th>
															</tr>
														</thead>
														<tbody>
															{trnData
																? trnData.map((item, id) => {
																		let rates = ratesData.find(i => i.id === get(item, "invoice_id.trip_id"));
																		return (
																			<React.Fragment key={id}>
																				<tr>
																					<td>
																						<div className="viewTransaction-box">
																							{item.payment_method === "payme" ? (
																								<Payme />
																							) : item.payment_method === "From Api" ? (
																								<RiyaPlay />
																							) : item.payment_method === "apelsin" ? (
																								<Uzum />
																							) : item.payment_method === "paynet" ? (
																								<Paynet />
																							) : item.payment_method === "click" ? (
																								<Click />
																							) : (
																								""
																							)}
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
																										: ""}
																								</p>
																								<span className="viewTitle">
																									{item.invoice_id ? "Оплата" : "Пополнение"}
																								</span>
																							</div>
																						</div>
																					</td>
																					<td className="text-center">
																						<div>
																							<div className="viewText">
																								{helpers.formatDate(
																									item.created_at * 1000,
																									"DD.MM.YYYY / HH:mm:ss"
																								)}
																							</div>
																						</div>
																					</td>
																					<td className="text-center">
																						<div>
																							<div
																								className={`viewTransaction-p ${
																									item.payment_method !== "From Api"
																										? "payment-green"
																										: "payment-red"
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
																  })
																: "malumot yuklanmoqda"}
														</tbody>
													</table>
												</>
											) : (
												<Loader />
											)}
										</div>
									</>
								) : (
									<h1 className="not-found">Этот пользователь еще не производил платеж</h1>
								)}
							</>
						);
					}}
				</EntityContainer.One>
			) : (
				"malumot yoq"
			)}
		</>
	);
};

export default ViewTransaction;
