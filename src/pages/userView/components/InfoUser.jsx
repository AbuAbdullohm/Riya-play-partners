import React, { useState } from "react";
import { get } from "lodash";
import { Grid, Panel, Icon } from "components";
import { time } from "services";

export default function InfoUser({ user, deviceList, setUpdatePhoneModal, setUser, balance, button, setButton, setBanModal }) {
	const [device] = deviceList;
	const userStatus = get(user, "status");

	const userStatusLabel = {
		10: "Активный",
		1: "Не полное регистрации",
		3: "Заблокирован"
	};

	return (
		<Panel>
			<Grid.Row>
				<Grid.Column md={4}>
					<div className="info">
						<label>ID пользователя:</label>
						<span>{get(user, "id")}</span>
					</div>
				</Grid.Column>
				<Grid.Column md={4}>
					<div className="info">
						<label>Статус:</label>
						<span className={`color-${userStatus === 10 ? "green" : "red"}`}>{userStatusLabel[userStatus]}</span>
					</div>
				</Grid.Column>
			</Grid.Row>
			{/* id username fullname */}
			<Grid.Row>
				<Grid.Column md={4}>
					<div className="info">
						<label>Полное имя:</label>
						<span>{get(user, "full_name")}</span>
					</div>
				</Grid.Column>
				<Grid.Column md={4}>
					<div className="info">
						<label>День рождения</label>
						<span>{get(user, "birth_date") ? time.to(get(user, "birth_date")) : "-"}</span>
					</div>
				</Grid.Column>
				<Grid.Column md={4}>
					<div className="info">
						<label>Пол</label>
						<span>{get(user, "sex", "-")}</span>
					</div>
				</Grid.Column>
			</Grid.Row>

			{/* phone-number, register balance */}
			<Grid.Row>
				<Grid.Column md={4}>
					<div className="info">
						<label>Номер телефона:</label>
						<div className="edit">
							<span>{get(user, "phone")}</span>
							<span
								className={`update-btn`}
								onClick={() => {
									setUser(user);
									setUpdatePhoneModal(true);
								}}>
								<Icon name="edit-2" />
							</span>
						</div>
					</div>
				</Grid.Column>
				<Grid.Column md={4}>
					<div className="info">
						<label>Дата регистрации:</label>
						<span>{time.to(get(user, "created_at"))}</span>
					</div>
				</Grid.Column>
				<Grid.Column md={4}>
					<div className="info">
						<label>Баланс:</label>
						{/* <span>{"UZS " + formatCurrency(get(user, "userBalance"))}</span> */}
						<div className="balance">
							<span>
								{balance
									? Number(balance).toLocaleString("en-US", {
											style: "currency",
											currency: "UZS",
											minimumFractionDigits: 0
									  })
									: Number(get(user, "userBalance")).toLocaleString("en-US", {
											style: "currency",
											currency: "UZS",
											minimumFractionDigits: 0
									  })}
							</span>
							<span className={`update-btn ${button ? "rotated" : ""}`} onClick={() => setButton(!button)}>
								<Icon name="rotate-ccw" />
							</span>
						</div>
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
						<label>Последний регистрация:</label>
						<span>{time.to(get(device, "created_at"), "DD.MM.YYYY / HH:MM:SS")}</span>
					</div>
				</Grid.Column>
			</Grid.Row>

			{/* banned ban-end comment  */}
			{userStatus === 3 && (
				<Grid.Row>
					<Grid.Column md={4}>
						<div className="info">
							<label>Дата бана:</label>
							<span>{get(user, "banned.created_at") ? time.to(get(user, "banned.created_at"), "DD.MM.YYYY / HH:MM:SS") : "-"}</span>
						</div>
					</Grid.Column>
					<Grid.Column md={4}>
						<div className="info">
							<label>Дата окончания бана:</label>
							<span>{get(user, "banned.banned_until") ? time.to(get(user, "banned.banned_until"), "DD.MM.YYYY / HH:MM:SS") : "-"}</span>
						</div>
					</Grid.Column>
					<Grid.Column md={4}>
						<div className="info">
							<label>Комментарий:</label>
							<div className="d-flex align-items-center">
								<span className={`color-red comment`}>{get(user, "banned.reason.title_ru")}</span>
								<span
									className="eye"
									onClick={() => {
										setUser(user);
										setBanModal(true);
									}}>
									<Icon name="eye" />
								</span>
							</div>
						</div>
					</Grid.Column>
				</Grid.Row>
			)}

			{/* subscription date enddate  */}
			{get(user, "currentTariff") && (
				<Grid.Row>
					<Grid.Column md={4}>
						<div className="info">
							<label>Подписка:</label>
							<span>{get(user, "currentTariff.ratesPrice.rate.name_ru") || "-"}</span>
						</div>
					</Grid.Column>
					<Grid.Column md={4}>
						<div className="info">
							<label>Дата подписки:</label>
							<span className="color-green">
								{get(user, "currentTariff.created_at") ? time.to(get(user, "currentTariff.created_at"), "DD.MM.YYYY / HH:MM:SS") : "-"}
							</span>
						</div>
					</Grid.Column>
					<Grid.Column md={4}>
						<div className="info">
							<label>Дата окончания подписки:</label>
							<span className="color-red">
								{get(user, "currentTariff.expires") ? time.to(get(user, "currentTariff.expires"), "DD.MM.YYYY / HH:MM:SS") : "-"}
							</span>
						</div>
					</Grid.Column>
				</Grid.Row>
			)}

			{/* promocode date enddate  */}
			{get(user, "currentPromocode") && (
				<Grid.Row>
					<Grid.Column md={4}>
						<div className="info">
							<label>Промо-код:</label>
							<span>{get(user, "currentPromocode.promoCode.title_ru") || "-"}</span>
						</div>
					</Grid.Column>
					<Grid.Column md={4}>
						<div className="info">
							<label>Дата промокода:</label>
							<span className="color-green">
								{get(user, "currentPromocode.created_at") ? time.to(get(user, "currentPromocode.created_at"), "DD.MM.YYYY / HH:MM:SS") : "-"}
							</span>
						</div>
					</Grid.Column>
					<Grid.Column md={4}>
						<div className="info">
							<label>Дата окончания промокода:</label>
							<span className="color-red">
								{get(user, "currentPromocode.expires") ? time.to(get(user, "currentPromocode.expires"), "DD.MM.YYYY / HH:MM:SS") : "-"}
							</span>
						</div>
					</Grid.Column>
				</Grid.Row>
			)}
		</Panel>
	);
}
