import React, { useState } from "react";
import { Table, Pagination, Header, Modal, Button, Icon } from "components";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import qs from "qs";
import UnLock from "./components/unLock";
import View from "./view";
import EntityContainer from "modules/entity/containers";
import Filter from "./components/filter";
import BanModal from "./banModal";
import ViewTransaction from "./viewTransaction";
import DownloadXls from "./downloadXls";
import AddDay from "./components/AddDay";
import { useSelector } from "react-redux";
import DevicesModal from "./components/devicesModal";
import { Link } from "react-router-dom";
import "./style.scss";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { addDay: day, downloadFile } = useSelector(state => state.system);
	const { t } = useTranslation();
	const { page, pageLimit } = params;
	// data state

	const [transactionData, setTransactionData] = useState();
	const [idModal, setIdModal] = useState();
	const [viewDataModal, setViewDataModal] = useState();
	const [blockButtonData, setBlockButtonData] = useState();
	// boolean state
	const [createModal, setCreateModal] = useState(false);
	const [filter, setFilter] = useState(false);
	const [canUpdate, setCanUpdate] = useState(false);
	const [unLock, setUnLock] = useState(false);
	const [view, setView] = useState(false);
	const [addDay, setAddDay] = useState(false);
	const [viewTransaction, setViewTransaction] = useState(false);
	const [devicesModal, setDevicesModal] = useState(false);

	const [infoModal, setInfoModal] = useState(false);
	const onChange = page => {
		const search = { ...params, page: page + 1 };
		history.push({
			search: qs.stringify(search)
		});
	};

	const blockButton = id => {
		setBlockButtonData(id);
		setCreateModal(true);
	};

	const onView = value => {
		setViewDataModal(value);
		setTimeout(() => {
			setView(true);
		}, 100);
	};
	const onViewTransaction = value => {
		setViewTransaction(true);
		setTransactionData(value);
	};

	return (
		<>
			<Modal.Default header="Блокировка исползования" toggle={createModal} setToggle={setCreateModal}>
				{createModal && <BanModal {...{ setCreateModal, setCanUpdate, blockButtonData }} />}
			</Modal.Default>
			<Modal.Default header="Разблокировать" toggle={unLock} setToggle={setUnLock}>
				{unLock && <UnLock {...{ setUnLock, setCanUpdate, canUpdate, idModal }} />}
			</Modal.Default>
			<Modal.Default exitBtn size="xl" header="Информация о пользователе" toggle={view} setToggle={setView}>
				{view && <View {...{ view, viewDataModal }} />}
			</Modal.Default>
			<Modal.Default
				exitBtn
				size="xl"
				header={`История платежей и покупок пользователя ID: ${get(transactionData, "id")} Телефон: ${get(transactionData, "phone")}`}
				toggle={viewTransaction}
				setToggle={setViewTransaction}>
				{viewTransaction && <ViewTransaction {...{ viewTransaction, setCanUpdate, canUpdate, transactionData }} />}
			</Modal.Default>
			<Modal.Default exitBtn size="xl" header={`Продление подписки для пользователей`} toggle={addDay} setToggle={setAddDay}>
				{addDay && <AddDay {...{ setAddDay, setCanUpdate, canUpdate, addDay }} />}
			</Modal.Default>
			<Modal.Default size="md" toggle={infoModal} setToggle={setInfoModal}>
				{infoModal && (
					<div className="font-bold text-center">
						Это действие сделано, теперь можно будет использовать его снова после завершения процесса в этом процессе
					</div>
				)}
			</Modal.Default>
			<Modal.Default size="md" toggle={devicesModal} setToggle={setDevicesModal}>
				<DevicesModal modal={devicesModal} setModal={setDevicesModal} />
			</Modal.Default>
			<EntityContainer.All
				entity="user"
				name="user"
				url="/user"
				version="v2"
				dataKey={"items"}
				canUpdate={canUpdate}
				params={{
					sort: "-id",
					limit: pageLimit ? pageLimit : 50,
					include: "files,userBalance,banned.reason,currentTariff.ratesPrice.rate,currentPromocode,currentPromocode.promoCode",
					// "files,subscribe,userBalance,banned.reason,lastSubscribe,promoSubscribe,userTokens,extraTimeToSubscribes,currentTariff.ratesPrice.rate,currentPromocode,currentPromocode.promoCode,endOfPremium",
					page: page || 1,
					extra: {
						role: "user",
						phone: params.phone ? params.phone : "",
						name: params.name ? params.name : "",
						balance: params.balance || "",
						promoCode: params.promoCode ? params.promoCode : "",
						tariff_id: params.ratesId && params.ratesId,
						last_subscribe: params.last_subscribe ? params.last_subscribe : "",
						balance_filter: params.balance_filter || "",
						subscribe_finish_date_start: (params.rates_finish || []).length > 0 ? params.rates_finish[0] : null,
						subscribe_finish_date_end: (params.rates_finish || []).length > 0 ? params.rates_finish[1] : null,
						sort: "-id",
						subscribe_got_date_end: (params.rates_start || []).length > 0 ? params.rates_start[1] : null,
						subscribe_got_date_start: (params.rates_start || []).length > 0 ? params.rates_start[0] : null,
						user_created_start: (params.user_created || []).length > 0 ? params.user_created[0] : null,
						user_created_end: (params.user_created || []).length > 0 ? params.user_created[1] : null,
						status: params.status ? params.status : "",
						id: params.id ? params.id : "",
						subscribe_type: params.subscribe_type ? params.subscribe_type : "",
						is_active: params.subscribe_type ? params.is_active || "" : null,
						is_active1: params.tariff_id ? params.is_active1 || "" : null,
						is_active2: params.promoCode ? params.is_active2 || "" : null
					}
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="page-container">
							<div className="pt-10">
								<Header
									title="Список пользователей"
									buttonName="Добавить день"
									buttonClick={() => {
										if (day.length > 0) {
											setInfoModal(!infoModal);
										} else setAddDay(!addDay);
									}}
									hasButton={true}
									hasFilter={isFetched && true}
									meta={meta}
									btnClassName={day.length > 0 && "events-none"}
									textLeft={
										<div
											onClick={() => {
												if (downloadFile.length > 0) {
													setInfoModal(!infoModal);
												}
											}}>
											<DownloadXls />
										</div>
									}
									setFilter={setFilter}
									filter={filter}>
									<Filter {...{ setFilter, filter }} />
								</Header>

								<Table
									// items={items.filter(item => item.id !== 32677)}
									items={items}
									rowKey="id"
									hasEdit={true}
									className="mt-5"
									hasDelete={false}
									editAction={value => history.push(`/users/update/${value.id}`)}
									isFetched={isFetched}
									columns={[
										{
											title: t("ID"),
											dataIndex: "id",
											className: "w-1",
											render: value => <>{value}</>
										},
										{
											title: t("Полное имя"),
											dataIndex: "full_name",
											render: value => <>{value && value}</>
										},

										{
											title: t("Телефон"),
											dataIndex: "phone",
											render: value => <>{value && value}</>
										},

										{
											title: t("Баланс"),
											dataIndex: "userBalance",
											render: value => (
												<>
													{value &&
														Number(value).toLocaleString("en-US", {
															style: "currency",
															currency: "UZS",
															minimumFractionDigits: 0
														})}
												</>
											)
										},
										{
											title: t("Тариф"),
											dataIndex: "currentTariff",
											render: value => {
												const currRatesName = get(value, "ratesPrice.rate");
												return <>{currRatesName ? get(currRatesName, "name_ru") : "Не активирован"}</>;
											}
										},
										{
											title: t("Промокод"),
											dataIndex: "currentPromocode",
											render: value => {
												const currPromocodeName = get(value, "promoCode");
												return <>{currPromocodeName ? get(currPromocodeName, "code") : "Не активирован"}</>;
											}
										},
										// {
										// 	title: t("Дата регистрации"),
										// 	dataIndex: "created_at",
										// 	render: value => {
										// 		return <>{value ? helpers.formatDate(value * 1000, "DD.MM.YYYY / HH:mm:ss") : "-"}</>;
										// 	}
										// },
										{
											className: "w-5",
											render: (_, row) => {
												const status = get(row, "status");
												const banStatus = get(row, "banned.status");
												if (status === 3) {
													return (
														<Button.Outline
															className="status-btn"
															type="success"
															tooltip={t("Активный")}
															onClick={() => {
																setIdModal(row);
																setUnLock(!unLock);
															}}>
															<Icon name="power" />
														</Button.Outline>
													);
												} else if (status === 10) {
													if (banStatus === 2) {
														return (
															<Button.Outline
																className="status-btn"
																type="success"
																tooltip={t("Активный")}
																onClick={() => {
																	setIdModal(row);
																	setUnLock(!unLock);
																}}>
																<Icon name="power" />
															</Button.Outline>
														);
													} else if (banStatus === 1) {
														return (
															<Button.Outline
																className="status-btn"
																type="danger"
																tooltip={t("Бан")}
																onClick={() => {
																	setIdModal(row);
																	setUnLock(!unLock);
																}}>
																<Icon name="power" />
															</Button.Outline>
														);
													} else {
														return (
															<Button.Outline
																className="status-btn"
																type="danger"
																tooltip={t("Бан")}
																onClick={() => {
																	blockButton(row.id);
																}}>
																<Icon name="power" />
															</Button.Outline>
														);
													}
												} else if (status === 1) {
													return (
														<Button.Outline
															className="status-btn"
															type="success"
															tooltip={t("Активный")}
															onClick={() => {
																setIdModal(row);
																setUnLock(!unLock);
															}}>
															<Icon name="power" />
														</Button.Outline>
													);
												}
											}
										},
										{
											className: "w-5",
											render: (_, row) => {
												return (
													<Button.Outline className="status-btn" type="success" onClick={() => onViewTransaction(row)}>
														<Icon name="dollar-sign" />
													</Button.Outline>
												);
											}
										},
										{
											className: "w-5",
											render: (_, row) => {
												return (
													<Link to={`/users/${get(row, "id")}`}>
														<Button.Outline
															className="status-btn"
															type="success"
															//  onClick={() => onView(row)}
														>
															<Icon name="eye" />
														</Button.Outline>
													</Link>
												);
											}
										}
										// {
										// 	className: "w-5",
										// 	render: (_, row) => {
										// 		return (
										// 			<Button.Outline
										// 				onClick={() => setDevicesModal(row)}
										// 				className="status-btn"
										// 				type="success"
										// 				tooltip={t("Устройства")}>
										// 				<Icon name="smartphone" />
										// 			</Button.Outline>
										// 		);
										// 	}
										// }
									]}
									dataSource={items}
								/>

								{get(meta, "pageCount", 1) > 1 && (
									<Pagination
										pageCount={get(meta, "pageCount", 1)}
										perPage={get(meta, "perPage")}
										currentPage={page ? Number(page) : 1}
										handlePageClick={onChange}
									/>
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
