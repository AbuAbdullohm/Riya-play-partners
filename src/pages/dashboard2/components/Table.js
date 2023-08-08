import React from "react";
import ContactUser from "assets/images/icons/icons-dashboard/contact.svg";
import payme from "assets/images/payme.svg";
import paynet from "assets/images/paynet.svg";
import apelsin from "assets/images/uzum.svg";
import click from "assets/images/icons/icons-dashboard/click.svg";
import upay from "assets/images/icons/icons-dashboard/upay.svg";
import { Icon } from "components";
import { ReactComponent as Top } from "assets/images/icons/top.svg";

export default function Table({
	index,
	rates,
	span,
	spanColor,
	procent,
	transaction,
	summ,
	contact,
	contactId,
	contactPhone,
	time,
	paymentProcent,
	paymentLogo,
	transactionDownIcon
}) {
	return (
		<tr>
			<td>
				{span && <div className={`${spanColor} span`}></div>}
				{rates}
				{paymentLogo && paymentLogo === "payme" ? (
					<img src={payme} alt="" />
				) : paymentLogo === "apelsin" ? (
					<img src={apelsin} alt="apelsin" style={{ minWidth: "70px", maxWidth: "80px" }} />
				) : paymentLogo === "paynet" ? (
					<img src={paynet} alt="paynet" style={{ minWidth: "80px", maxWidth: "80px" }} />
				) : paymentLogo === "click" ? (
					<img src={click} alt="click" style={{ minWidth: "65px", height: "25px", maxWidth: "80px" }} />
				) : paymentLogo === "upay" ? (
					<img src={upay} alt="upay" style={{ minWidth: "55px", height: "35px", maxWidth: "80px" }} />
				) : paymentLogo === "apelsin_frame" ? (
					<div className="d-flex align-center">
						<img src={apelsin} alt="apelsin_frame" style={{ minWidth: "70px", maxWidth: "80px", marginRight: "5px" }} /> frame
					</div>
				) : (
					""
				)}
				{contact && (
					<div className="contact">
						<img src={ContactUser} alt="" />
						<div className="contact_inner">
							<div className="contact_inner_id">ID: {contactId}</div>
							<div className="dashboard_title">{contactPhone}</div>
						</div>
					</div>
				)}
			</td>
			{paymentProcent && (
				<td>
					<div className="d-flex align-items-center">
						{paymentProcent}
						{index === 0 ? (
							<span className="ml-1">
								<Top />
							</span>
						) : null}
					</div>
				</td>
			)}
			{time && <td className="dashboard_time">{time}</td>}
			{procent && (
				<td>
					<div className="d-flex align-items-center">
						{procent}
						{index === 0 ? (
							<span className="ml-1">
								<Top />
							</span>
						) : null}
					</div>
				</td>
			)}
			{transactionDownIcon ? (
				<td className="d-flex align-center text-green">
					<Icon name="arrow-down" size={17} strokeColor="#83bf6e" /> {transaction}
				</td>
			) : (
				transaction && <td>{transaction}</td>
			)}
			<td>
				{Number(summ).toLocaleString("en-US", {
					style: "currency",
					currency: "UZS",
					minimumFractionDigits: 0
				})}
			</td>
		</tr>
	);
}
