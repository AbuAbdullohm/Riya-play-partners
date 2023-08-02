import React, { useEffect, useState } from "react";
import EntityContainer from "modules/entity/containers";
import { useParams } from "react-router";
import { get } from "lodash";
import Actions from "modules/entity/actions";
import { Grid, Panel, Loader, Tabs } from "components";
import { time, helpers, constants } from "services";
import api from "services/api";
import queryBuilder from "services/queryBuilder";
import { useNotification } from "hooks";
import "./style.scss";
import UserTransaction from "./components/userTransaction";
import { useDispatch } from "react-redux";

const { formatCurrency } = helpers;

export default function User() {
	const { id } = useParams();
	const [activeTab, setActiveTab] = useState("device");
	const { notification } = useNotification();
	const [button, setButton] = useState(false);
	const [balance, setBalance] = useState();
	const dispatch = useDispatch();

	function kickDevice(item) {
		api["requestv1"]
			.delete(
				queryBuilder("/user/kick-device", {
					extra: {
						token_id: item.id
					}
				})
			)
			.then(() => {
				notification("Успешно", {
					type: "success"
				});
			})
			.catch(() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			});
	}

	useEffect(() => {
		if (!id) setBalance(null);

		if (button) {
			dispatch(
				Actions.LoadDefault.request({
					url: `/user/balance/${id}`,
					cb: {
						success: data => {
							setButton(!button);
							setBalance(data);
						},
						error: error => console.log(error)
					}
				})
			);
		}
	}, [button, id]);

	return (
		<EntityContainer.One
			key={"user"}
			entity="user"
			name="user"
			url={`/user/${id}`}
			version="v2"
			dataKey={"item"}
			params={{
				include:
					"files,userBalance,banned.reason,currentTariff.ratesPrice.rate,currentPromocode,extraTimeToSubscribes,currentPromocode.promoCode,userDevices"
			}}>
			{({ item, isFetched }) => {
				if (!isFetched) return <Loader />;

				return (
					<EntityContainer.All
						entity="/user/devices"
						name="/user/devices"
						url="/user/devices"
						version="v1"
						dataKey={"items"}
						params={{
							sort: "-id",
							extra: {
								page: 1,
								limit: 50,
								user_id: id
							}
						}}>
						{({ isFetched, items }) => {
							if (!isFetched) return <Loader />;

							const [device] = items;
							const status = constants.deviceStatus.find(({ value }) => value === get(device, "status"));

							return (
								<Grid.Row gutter={10} gutterX={4} className={"mt-10 user_view"}>
									<Grid.Column xl={8}>
										<Panel>
											{/* id username fullname */}
											<Grid.Row gutter={10}>
												<Grid.Column md={4}>
													<div className="info">
														<label>ID пользователя:</label>
														<span>{get(item, "id")}</span>
													</div>
												</Grid.Column>
												<Grid.Column md={4}>
													<div className="info">
														<label>Имя пользователя:</label>
														<span>{get(item, "username")}</span>
													</div>
												</Grid.Column>
												<Grid.Column md={4}>
													<div className="info">
														<label>Полное имя:</label>
														<span>{get(item, "full_name")}</span>
													</div>
												</Grid.Column>
											</Grid.Row>

											{/* phone-number, register balance */}
											<Grid.Row>
												<Grid.Column md={4}>
													<div className="info">
														<label>Номер телефона:</label>
														<span>{get(item, "phone")}</span>
													</div>
												</Grid.Column>
												<Grid.Column md={4}>
													<div className="info">
														<label>Дата регистрации:</label>
														<span>{time.to(get(item, "created_at"))}</span>
													</div>
												</Grid.Column>
												<Grid.Column md={4}>
													<div className="info">
														<label>Баланс:</label>
														{/* <span>{"UZS " + formatCurrency(get(item, "userBalance"))}</span> */}
														{balance
															? Number(balance).toLocaleString("en-US", {
																	style: "currency",
																	currency: "UZS",
																	minimumFractionDigits: 0
															  })
															: Number(get(item, "userBalance")).toLocaleString("en-US", {
																	style: "currency",
																	currency: "UZS",
																	minimumFractionDigits: 0
															  })}
													</div>
												</Grid.Column>
											</Grid.Row>

											{/* device */}
											<Grid.Row>
												<Grid.Column md={4}>
													<div className="info">
														<label>Устройство:</label>
														<span>{get(device, "device_name") || "-"}</span>
													</div>
												</Grid.Column>
												<Grid.Column md={4}>
													<div className="info">
														<label>IP-адреса:</label>
														<span>{get(device, "user_ip") || "-"}</span>
													</div>
												</Grid.Column>
												<Grid.Column md={4}>
													<div className="info">
														<label>Статус:</label>
														<span className={`color-${get(status, "value") === 10 ? "green" : "red"}`}>{get(status, "label")}</span>
													</div>
												</Grid.Column>
											</Grid.Row>

											{/* banned ban-end comment  */}
											<Grid.Row>
												<Grid.Column md={4}>
													<div className="info">
														<label>Дата бана:</label>
														<span>{get(item, "banned.created_at") ? time.to(get(item, "banned.created_at")) : "-"}</span>
													</div>
												</Grid.Column>
												<Grid.Column md={4}>
													<div className="info">
														<label>Дата окончания бана:</label>
														<span>{get(item, "banned.banned_until") ? time.to(get(item, "banned.banned_until")) : "-"}</span>
													</div>
												</Grid.Column>
												<Grid.Column md={4}>
													<div className="info">
														<label>Комментарий:</label>
														<span className={`color-${item.can_comment ? "green" : "red"}`}>
															{get(item, "can_comment") === 1 ? "Не запрещен" : "Запрещено"}
														</span>
													</div>
												</Grid.Column>
											</Grid.Row>

											{/* subscription date enddate  */}
											<Grid.Row>
												<Grid.Column md={4}>
													<div className="info">
														<label>Подписка:</label>
														<span>{get(item, "currentTariff.ratesPrice.rate.name_ru") || "-"}</span>
													</div>
												</Grid.Column>
												<Grid.Column md={4}>
													<div className="info">
														<label>Дата подписки:</label>
														<span className="color-green">
															{get(item, "currentTariff.created_at")
																? time.to(get(item, "currentTariff.created_at"), "DD.MM.YYYY / HH:MM:SS")
																: "-"}
														</span>
													</div>
												</Grid.Column>
												<Grid.Column md={4}>
													<div className="info">
														<label>Дата окончания подписки:</label>
														<span className="color-red">
															{get(item, "currentTariff.expires")
																? time.to(get(item, "currentTariff.expires"), "DD.MM.YYYY / HH:MM:SS")
																: "-"}
														</span>
													</div>
												</Grid.Column>
											</Grid.Row>

											{/* promocode date enddate  */}
											<Grid.Row>
												<Grid.Column md={4}>
													<div className="info">
														<label>Промо-код:</label>
														<span>{get(item, "currentPromocode.promoCode.title_ru") || "-"}</span>
													</div>
												</Grid.Column>
												<Grid.Column md={4}>
													<div className="info">
														<label>Дата промокода:</label>
														<span className="color-green">
															{get(item, "currentPromocode.created_at")
																? time.to(get(item, "currentPromocode.created_at"), "DD.MM.YYYY / HH:MM:SS")
																: "-"}
														</span>
													</div>
												</Grid.Column>
												<Grid.Column md={4}>
													<div className="info">
														<label>Дата окончания промокода:</label>
														<span className="color-red">
															{get(item, "currentPromocode.expires")
																? time.to(get(item, "currentPromocode.expires"), "DD.MM.YYYY / HH:MM:SS")
																: "-"}
														</span>
													</div>
												</Grid.Column>
											</Grid.Row>

											{/* Update data */}
											<Grid.Row>
												<Grid.Column>
													<button className="update-btn btn btn-primary" onClick={() => setButton(!button)}>
														Обновить данные
													</button>
												</Grid.Column>
											</Grid.Row>
										</Panel>

										<Panel className="mt-10">
											<div className="total">
												<div className="replenishment">
													<span>Пополнение</span>
													<span>+ UZS 0</span>
												</div>
												<div className="buying">
													<span>Покупка тарифов</span>
													<span>- UZS 0</span>
												</div>
											</div>
										</Panel>
									</Grid.Column>

									<Grid.Column xl={4}>
										<Panel className="tabs-panel">
											<Tabs
												activeItem={activeTab}
												items={[
													{ code: "device", title: "Устройства" },
													{ code: "days", title: "Добавлено время" },
													{ code: "transaction", title: "Транзакции" }
												]}
												onTabChange={code => setActiveTab(code)}
											/>
											{/*  */}
											{/*  */}
											<div className="tab-content">
												{activeTab === "device" &&
													items.map(item => {
														return (
															<div className="device-item" key={item.id}>
																<p>{item.device_name}</p>
																<p>{time.to(item.created_at, "DD.MM.YYYY / HH:mm:ss")}</p>
																<p onClick={() => kickDevice(item)}>x</p>
															</div>
														);
													})}
												{activeTab === "days" && (
													<div className="extra-day_box" id="extra-day_box">
														{get(item, "extraTimeToSubscribes") &&
															get(item, "extraTimeToSubscribes").map((item, idx) => (
																<div className="d-flex extra-day" key={idx}>
																	<p className="font-bold">
																		Добавлено время: {helpers.formatDate(item.created_at * 1000, "DD.MM.YYYY / HH:mm")}
																	</p>{" "}
																	<p className="ml-3 font-medium">
																		День добавления: {Number(item.extra_time) / 24 / 60 / 60}
																	</p>
																</div>
															))}
													</div>
												)}

												{activeTab === "transaction" && <UserTransaction user={item} />}
											</div>
										</Panel>
									</Grid.Column>
								</Grid.Row>
							);
						}}
					</EntityContainer.All>
				);
			}}
		</EntityContainer.One>
	);
}
