import React, { useState, useEffect } from "react";
import { Avatar, Tag, Button, Spinner } from "components";
import { get } from "lodash";
import Actions from "modules/entity/actions";
import { helpers } from "services";
import UserInfo from "./components/userInfo";
import EntityContainer from "modules/entity/containers";
import { useDispatch } from "react-redux";
const View = ({ idModal: data, view }) => {
	const [startRatesTime, setStartRatesTime] = useState();
	const [button, setButton] = useState(false);
	const [balance, setBalance] = useState();
	const dispatch = useDispatch();
	const [idModal, setIdModal] = useState();

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
						setIdModal(data);
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
									<div className="viewBox ">
										{idModal ? (
											<Avatar src={get(idModal, "files[0].thumbnails.small.src")} className="avatar--rectangle avatar--h85" />
										) : (
											"-"
										)}
										<UserInfo
											title="Роле"
											style={{ marginTop: "10px" }}
											text={get(idModal, "foreign_user") === 1 ? "foreign_user" : get(idModal, "role")}
										/>
									</div>
									<div className="viewBox ">
										<UserInfo title="Усер ID" text={get(idModal, "id")} />
										<UserInfo
											title="Дата регистрации"
											text={
												get(idModal, "created_at")
													? helpers.formatDate(get(idModal, "created_at") * 1000, "DD.MM.YYYY / HH:mm:ss")
													: "Нет регистрации"
											}
										/>
										<UserInfo title="Дата начала бан" text={"Нет бан"} />
										<UserInfo
											title="Тариф"
											text={get(idModal, "currentTariff") ? get(idModal, "currentTariff.ratesPrice.rate.name_ru") : "Нет тарифы"}
										/>
										<UserInfo
											title="Промокод"
											text={get(idModal, "currentPromocode") ? get(idModal, "currentPromocode.promoCode.title_ru") : "Нет промокод"}
										/>
									</div>

									<div className="viewBox ">
										<UserInfo title="Логин" text={get(idModal, "username") !== null ? get(idModal, "username") : "-"} />
										<UserInfo
											title="Баланс"
											text={
												balance
													? Number(balance).toLocaleString("en-US", {
															style: "currency",
															currency: "UZS",
															minimumFractionDigits: 0
													  })
													: Number(get(idModal, "userBalance")).toLocaleString("en-US", {
															style: "currency",
															currency: "UZS",
															minimumFractionDigits: 0
													  })
											}
										/>
										<UserInfo
											title="Использование"
											text={
												get(idModal, "banned.status") === 1 ? (
													<Tag color={"red"}>Заблокированный</Tag>
												) : (
													<Tag color={"green"}>Разрешено</Tag>
												)
											}
										/>
										<UserInfo
											title="Дата начала тарифы"
											text={
												get(time[0], "created_at")
													? helpers.formatDate(get(time[0], "created_at") * 1000, "DD.MM.YYYY / HH:mm:ss")
													: "Нет даты начала"
											}
										/>
										<UserInfo
											title="Дата начала промокод"
											text={
												get(idModal, "currentPromocode")
													? helpers.formatDate(get(idModal, "currentPromocode.created_at") * 1000, "DD.MM.YYYY / HH:mm:ss")
													: "Нет даты начала"
											}
										/>
									</div>
									<div className="viewBox ">
										<UserInfo title="Полное имя" text={get(idModal, "full_name") !== null ? get(idModal, "full_name") : "-"} />
										<UserInfo
											title="Устройства"
											text={
												<div>
													{get(idModal, "userTokens", []).length > 0
														? get(idModal, "userTokens", []).map(item => (
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
												get(idModal, "banned.status") === 2 ? (
													<Tag color={"red"}>Заблокированный</Tag>
												) : (
													<Tag color={"green"}>Разрешено</Tag>
												)
											}
										/>
										{/* <UserInfo
											title="Завершение тарифа"
											text={
												get(idModal, "subscribe_date")
													? helpers.formatDate(get(idModal, "subscribe_date") * 1000, "DD.MM.YYYY / HH:mm:ss")
													: "Нет тарифы"
											}
										/> */}
										<UserInfo
											title="Завершение тарифа"
											text={
												get(idModal, "endOfPremium") && get(idModal, "currentTariff")
													? helpers.formatDate(get(idModal, "endOfPremium") * 1000, "DD.MM.YYYY / HH:mm:ss")
													: "Нет тарифы"
											}
										/>

										<UserInfo
											title="Завершение промокод"
											text={
												get(idModal, "currentPromocode")
													? helpers.formatDate(get(idModal, "currentPromocode.expires") * 1000, "DD.MM.YYYY / HH:mm:ss")
													: "Нет даты начала"
											}
										/>
									</div>
									<div className="viewBox">
										<UserInfo title="Телефон" text={get(idModal, "phone")} />
										<UserInfo
											title="IP"
											text={
												get(idModal, "userTokens", []).length > 0
													? get(idModal, "userTokens").map((item, idx) => <p key={idx}>{item.user_ip ? item.user_ip : "Нет IP"}</p>)
													: "Нет IP"
											}
										/>
										<UserInfo
											title="Завершение бан"
											text={
												<div>
													{get(idModal, "banned.banned_until")
														? helpers.formatDate(get(idModal, "banned.banned_until") * 1000, "DD.MM.YYYY / HH:mm:ss")
														: "Нет бан"}
												</div>
											}
										/>
										<Button.Default onClick={() => setButton(!button)} loading={button}>
											Обновление баланса
										</Button.Default>
									</div>
								</div>
								<div>
									{get(idModal, "extraTimeToSubscribes") &&
										get(idModal, "extraTimeToSubscribes").map((item, idx) => (
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
							<Spinner position="center" />
						)}
					</>
				);
			}}
		</EntityContainer.One>
	);
};

export default View;
