import React, { useState } from "react";
import { Table, Pagination, Modal, Header, Tag, Button, Icon } from "components";
import EntityContainer from "modules/entity/containers";
import Filter from "./components/filter";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "query-string";
import { useNotification, useAccess } from "hooks";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page = 1 } = qs.parse(location.search);
	const bookkeeping = useAccess({ roles: ["bookkeeping"] });
	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [selected, setSelected] = useState();
	const [loadingDelete, setLoadingDelete] = useState(false);

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const deleteAction = id => {
		setLoadingDelete(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "rates",
				name: `rates`,
				id: id,
				url: `/rates/${id}`,
				deleteData: true,
				primaryKey: "id",
				cb: {
					success: () => {
						notification("Успешно удалена", {
							type: "success"
						});
						setModal(false);
					},
					error: () => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
						setModal(false);
					},
					finally: () => {
						setLoadingDelete(false);
					}
				}
			})
		);
	};

	const onChange = page => {
		const search = { ...params, page: page + 1 };
		history.push({ search: qs.stringify(search) });
	};

	const updateAction = (id, type) => {
		const status = type === "activate" ? 1 : 0;
		dispatch(
			Actions.Form.request({
				method: "put",
				entity: "rates",
				name: "rates",
				id: id,
				url: `/rates/${id}`,
				updateData: true,
				primaryKey: "id",
				normalizeData: data => data,
				cb: {
					success: () => {
						notification(type === "activate" ? t("Успешно активирован") : t("Успешно деактивирован"), {
							type: "success"
						});
					},
					error: () => {
						notification(t("Успешно удалена"), {
							type: "success"
						});
					},
					finally: () => {}
				},
				values: { status }
			})
		);
	};

	return (
		<>
			<Modal.Confirm
				isSubmitting={loadingDelete}
				title="Вы действительно хотите удалить?"
				toggle={modal}
				setToggle={setModal}
				closable
				cancelText="нет"
				okText="да"
				onOk={() => deleteAction(selected)}
			/>
			<EntityContainer.All
				entity="rates"
				name={`rates`}
				url="/rates"
				primaryKey="id"
				params={{
					sort: "sort",
					extra: { name: params.name ? params.name : "", sort: "-id" },
					filter: {
						status: params.status,
						rates: params.rates ? params.rates.split("/")[0] : null
					},
					limit: 10,
					include: "translations,files,ratesPrices",
					page: page ? page : 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header title="Тарифы" buttonName="Добавить" hasButton={!bookkeeping} buttonClick={() => history.push(`/rates/create`)} meta={meta}>
								<Filter />
							</Header>

							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								hasDelete={!bookkeeping}
								hasEdit={!bookkeeping}
								emptyUiText="Список пусто"
								deleteAction={value => onDeleteHandler(value.id)}
								editAction={value => history.push(`/rates/update/${value.id}?page=${page}`)}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4",
										render: value => <>{value}</>
									},
									{
										title: t("Загаловок"),
										dataIndex: "name_ru",
										render: value => <>{value}</>
									},
									{
										title: t("Цена"),
										dataIndex: "ratesPrices",
										render: value => (
											<>
												{Number(get(value, "price")).toLocaleString("en-US", {
													style: "currency",
													currency: "UZS",
													minimumFractionDigits: 0
												})}
											</>
										)
									},
									{
										title: t("Дней"),
										className: "w-4",
										dataIndex: "ratesPrices",
										render: value => <>{get(value, "days")}</>
									},
									{
										title: t("Сорт"),
										className: "w-4",
										dataIndex: "sort",
										render: value => <>{value ? value : "-"}</>
									},
									{
										title: t("Статус"),
										className: "w-8",
										dataIndex: "status",
										render: value => {
											return <>{value === 1 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>}</>;
										}
									},
									{
										className: "w-5",
										render: (_, row) => {
											const status = get(row, "status");
											if (!bookkeeping) {
												return status === 0 ? (
													<Button.Outline
														className="status-btn"
														type="success"
														tooltip={t("Активный")}
														onClick={() => {
															setSelected(row);
															updateAction(get(row, "id"), "activate");
														}}>
														<Icon name="power" />
													</Button.Outline>
												) : (
													<Button.Outline
														className="status-btn"
														type="danger"
														tooltip={t("Неактивный")}
														onClick={() => updateAction(get(row, "id"), "deactivate")}>
														<Icon name="power" />
													</Button.Outline>
												);
											}
										}
									}
								]}
							/>
							{get(meta, "pageCount", 1) > 1 && (
								<Pagination pageCount={get(meta, "pageCount", 1)} currentPage={page ? Number(page) : 1} handlePageClick={onChange} />
							)}
						</>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
