import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import qs from "qs";
import { helpers } from "services";
import EntityContainer from "modules/entity/containers";
import { Table, Pagination, Header } from "components";
import Filter from "./components/filter";
import "./components/style.scss";
import DownloadXls from "./downloadXls";
import BugalterComponent from "./components/BugalterComponent";
import { useSelector } from "react-redux";

import Payme from "assets/images/payme.svg";
import Paynet from "assets/images/paynet.svg";
import Apelsin from "assets/images/uzum.svg";
import Bektv from "assets/images/bektv.svg";
import click from "assets/images/icons/icons-dashboard/click.svg";
import upay from "assets/images/icons/icons-dashboard/upay.svg";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const ratesData = useSelector(state => state.system.rates);
	const { t } = useTranslation();
	const { page, pageLimit } = params;
	const [filter, setFilter] = useState(false);

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	return (
		<>
			<EntityContainer.All
				entity="transactions"
				name="all"
				url="/transactions"
				primaryKey="transaction_id"
				params={{
					limit: pageLimit ? pageLimit : 50,
					page: page || 1,
					extra: {
						phone: params.phone ? params.phone : "",
						invoice_id: params.invoice_id,
						type: params.type,
						user_id: params.user_id,
						payment_method: params.payment_method,
						start: (params.start || []).length > 0 ? params.start[0] : null,
						end: (params.start || []).length > 0 ? params.start[1] : null,
						page: page || 1
					}
				}}>
				{({ items, isFetched, meta }) => {
					let amount = items.reduce((total, curr) => (total += Number(curr.amount)), 0);

					return (
						<div className="page-container">
							<div className="pt-10">
								<div className="bugalterExcel w-60"></div>
								<BugalterComponent {...{ items, amount, params }} />
								<Header
									buttonName="Добавить"
									textLeft={<DownloadXls />}
									buttonClick={() => history.push("/users/create")}
									hasButton={false}
									hasFilter={true}
									meta={meta}
									setFilter={setFilter}
									filter={filter}>
									<Filter {...{ setFilter }} />
								</Header>

								<Table
									items={items}
									rowKey="transaction_id"
									className="mt-5"
									hasEdit={false}
									hasDelete={false}
									isFetched={isFetched}
									columns={[
										{
											title: t("ID"),
											dataIndex: "transaction_id",
											className: "w-1",
											render: value => <>{value}</>
										},
										{
											title: t("Телефон"),
											dataIndex: "user",
											render: value => <>{value}</>
										},
										{
											title: t("Тип транзакции"),
											dataIndex: "type",
											render: value => {
												if (value === 1) {
													return <div>Кирим (Hisob to'ldirish)</div>;
												} else if (value === 2) {
													return <>Чиким (Obuna olish)</>;
												}
											}
										},
										{
											title: t("Оплата и продажа"),
											dataIndex: "payment_method",
											render: value => {
												if (value === "payme") {
													return <img src={Payme} className="box-none" alt="" />;
												} else if (value === "paynet") {
													return <img src={Paynet} className="w-20 box-none" alt="" />;
												} else if (value === "apelsin") {
													return <img src={Apelsin} className="box-none" alt="" style={{ width: "4.2rem" }} />;
												} else if (value === "From Api") {
													return <img src={Bektv} className="w-20 box-none" alt="" />;
												} else if (value === "click") {
													return <img src={click} className="box-none" style={{ width: "55px" }} alt="" />;
												} else if (value === "upay") {
													return <img src={upay} className="box-none" style={{ width: "75px" }} alt="" />;
												} else if (value === "apelsin_frame") {
													return (
														<div className="d-flex align-center">
															<img src={Apelsin} className="box-none w-20" style={{ marginRight: "10px" }} alt="" /> frame
														</div>
													);
												}
											}
										},
										{
											title: t("Цена"),
											dataIndex: "amount",
											render: value => (
												<>
													{value
														? Number(value).toLocaleString("en-US", {
																style: "currency",
																currency: "UZS",
																minimumFractionDigits: 0
														  })
														: "Нет"}
												</>
											)
										},

										{
											title: t("Дата и времия"),
											dataIndex: "created_at",
											render: value => <>{helpers.formatDate(value * 1000, "DD.MM.YYYY / HH:mm:ss")}</>
										},
										{
											title: t("Тарифы"),
											dataIndex: "invoice_id",
											render: value => {
												const foundTariff = value ? ratesData.find(item => item.id === value.trip_id) : null;
												return <>{foundTariff ? get(foundTariff, "name_ru") : "Пополнение счета"}</>;
											}
										}
									]}
									dataSource={items}
								/>
								{get(meta, "pageCount", 1) > 1 && (
									<Pagination pageCount={get(meta, "pageCount", 1)} currentPage={page ? Number(page) : 1} handlePageClick={onChange} />
								)}
							</div>
						</div>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
