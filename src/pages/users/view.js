import React, { useState, useEffect } from "react";
import { Avatar, Tag, Button, Loader } from "components";
import { get } from "lodash";
import Actions from "modules/entity/actions";
import { helpers } from "services";
import UserInfo from "./components/userInfo";
import EntityContainer from "modules/entity/containers";
import { useDispatch } from "react-redux";

const View = ({ viewDataModal: data, view }) => {
	const [startRatesTime, setStartRatesTime] = useState();
	const [button, setButton] = useState(false);
	const [balance, setBalance] = useState();
	const [viewDataModal, setViewDataModal] = useState();
	const dispatch = useDispatch();
	useEffect(() => {
		if (view === false) {
			setBalance(null);
		}

		if (button) {
			dispatch(
				Actions.LoadDefault.request({
					url: `/user/balance/${get(data, "id")}`,
					cb: {
						success: data => {
							setButton(!button);
							setBalance(data);
						},
						error: error => {
							console.log(error);
						}
					}
				})
			);
		}
	}, [button, view]);

	useEffect(() => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/user/${get(data, "id")}`,
				params: {
					include:
						"files,subscribe,userBalance,banned.reason,lastSubscribe,promoSubscribe,userTokens,extraTimeToSubscribes,currentTariff.ratesPrice.rate,currentPromocode,currentPromocode.promoCode,endOfPremium"
				},
				cb: {
					success: data => {
						setViewDataModal(data);
					},
					error: error => {
						console.log(error);
					}
				}
			})
		);
	}, []);

	return (
		<EntityContainer.One
			entity="user"
			name={`all`}
			url={`/transactions`}
			primaryKey="transaction_id"
			onSuccess={data => {
				setStartRatesTime(data);
			}}
			params={{
				extra: {
					phone: get(data, "phone") ? get(data, "phone") : ""
				}
			}}>
			{({ isFetched }) => {
				const time = get(startRatesTime, "data", []).filter(item => item.invoice_id !== null);

				return (
					<>
						{isFetched ? (
							<>
								<div className="viewGrid">
									<div className="viewBox">
										{viewDataModal ? (
											<Avatar src={get(viewDataModal, "files[0].thumbnails.small.src")} className="avatar--rectangle avatar--h85" />
										) : (
											"-"
										)}
										<UserInfo
											title="Роле"
											style={{ marginTop: "10px" }}
											text={get(viewDataModal, "foreign_user") === 1 ? "foreign_user" : get(viewDataModal, "role")}
										/>
									</div>
									<div className="viewBox ">
										<UserInfo title="Усер ID" text={get(viewDataModal, "id")} />
										<UserInfo
											title="Дата регистрации"
											text={
												get(viewDataModal, "created_at")
													? helpers.formatDate(get(viewDataModal, "created_at") * 1000, "DD.MM.YYYY / HH:mm:ss")
													: "Нет регистрации"
											}
										/>
										<UserInfo title="Дата начала бан" text={"Нет бан"} />
										<UserInfo
											title="Тариф"
											text={
												get(viewDataModal, "currentTariff") ? get(viewDataModal, "currentTariff.ratesPrice.rate.name_ru") : "Нет тарифы"
											}
										/>
										<UserInfo
											title="Промокод"
											text={
												get(viewDataModal, "currentPromocode")
													? get(viewDataModal, "currentPromocode.promoCode.title_ru")
													: "Нет промокод"
											}
										/>
									</div>

									<div className="viewBox ">
										<UserInfo title="Логин" text={get(viewDataModal, "username") !== null ? get(viewDataModal, "username") : "-"} />
										<UserInfo
											title="Баланс"
											text={
												balance
													? Number(balance).toLocaleString("en-US", {
															style: "currency",
															currency: "UZS",
															minimumFractionDigits: 0
													  })
													: Number(get(viewDataModal, "userBalance")).toLocaleString("en-US", {
															style: "currency",
															currency: "UZS",
															minimumFractionDigits: 0
													  })
											}
										/>
										<UserInfo
											title="Использование"
											text={
												get(viewDataModal, "banned.status") === 1 ? (
													<Tag color={"red"}>Заблокированный</Tag>
												) : (
													<Tag color={"green"}>Разрешено</Tag>
												)
											}
										/>
										<UserInfo
											title="Дата начала тарифы"
											text={
												get(time[0], "created_at") && get(viewDataModal, "currentTariff")
													? helpers.formatDate(get(time[0], "created_at") * 1000, "DD.MM.YYYY / HH:mm:ss")
													: "Нет даты начала"
											}
										/>
										<UserInfo
											title="Дата начала промокод"
											text={
												get(viewDataModal, "currentPromocode")
													? helpers.formatDate(get(viewDataModal, "currentPromocode.created_at") * 1000, "DD.MM.YYYY / HH:mm:ss")
													: "Нет даты начала"
											}
										/>
									</div>
									<div className="viewBox ">
										<UserInfo title="Полное имя" text={get(viewDataModal, "full_name") !== null ? get(viewDataModal, "full_name") : "-"} />
										<UserInfo
											title="Устройства"
											text={
												<div>
													{get(viewDataModal, "userTokens", []).length > 0
														? get(viewDataModal, "userTokens", []).map(item => (
																<p key={item.id} className="mb-1">
																	{item.device_name}
																</p>
														  ))
														: "Нет устройства"}
												</div>
											}
										/>
										<UserInfo
											title="Прокомментировать"
											text={
												get(viewDataModal, "banned.status") === 2 ? (
													<Tag color={"red"}>Заблокированный</Tag>
												) : (
													<Tag color={"green"}>Разрешено</Tag>
												)
											}
										/>
										<UserInfo
											title="Завершение тарифа"
											text={
												get(viewDataModal, "subscribe_date") && get(viewDataModal, "currentTariff")
													? helpers.formatDate(get(viewDataModal, "subscribe_date") * 1000, "DD.MM.YYYY / HH:mm:ss")
													: "Нет даты тарифы"
											}
										/>

										<UserInfo
											title="Завершение промокод"
											text={
												get(viewDataModal, "currentPromocode")
													? helpers.formatDate(get(viewDataModal, "currentPromocode.expires") * 1000, "DD.MM.YYYY / HH:mm:ss")
													: "Нет даты завершение"
											}
										/>
									</div>
									<div className="viewBox">
										<UserInfo title="Телефон" text={get(viewDataModal, "phone")} />
										<UserInfo
											title="IP"
											text={
												get(viewDataModal, "userTokens", []).length > 0
													? get(viewDataModal, "userTokens").map((item, idx) => (
															<p key={idx}>{item.user_ip ? item.user_ip : "Нет IP"}</p>
													  ))
													: "Нет IP"
											}
										/>
										<UserInfo
											title="Завершение бан"
											text={
												<div>
													{get(viewDataModal, "banned.banned_until")
														? helpers.formatDate(get(viewDataModal, "banned.banned_until") * 1000, "DD.MM.YYYY / HH:mm:ss")
														: "Нет бан"}
												</div>
											}
										/>
										<Button.Default onClick={() => setButton(!button)} loading={button}>
											Обновление баланса
										</Button.Default>
									</div>
								</div>
								<div className="extra-day_box" id="extra-day_box">
									{get(viewDataModal, "extraTimeToSubscribes") &&
										get(viewDataModal, "extraTimeToSubscribes").map((item, idx) => (
											<div className="d-flex justify-center extra-day" key={idx}>
												<p className="font-bold">
													Добавлено время: {helpers.formatDate(item.created_at * 1000, "DD.MM.YYYY / HH:mm:ss")}
												</p>{" "}
												<p className="ml-3 font-medium">День добавления: {Number(item.extra_time) / 24 / 60 / 60}</p>
											</div>
										))}
								</div>
							</>
						) : (
							<Loader />
						)}
					</>
				);
			}}
		</EntityContainer.One>
	);
};

export default View;
