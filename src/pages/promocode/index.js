import React, { useState } from "react";
import { Button, Header, Icon, Modal, Pagination, Table, Tag } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "query-string";
import { useNotification, useAccess } from "hooks";
import Filter from "./components/filter";
import { helpers } from "services";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page, pageLimit } = params;
	const { notification } = useNotification();
	const [filter, setFilter] = useState(false);
	const [modal, setModal] = useState(false);
	const [selected, setSelected] = useState();
	const bookkeeping = useAccess({ roles: ["bookkeeping"] });

	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "promo-code",
				name: `promo-code`,
				id: id,
				url: `/promo-code/${id}`,
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
					finally: () => {}
				}
			})
		);
	};

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	const updateAction = (id, type) => {
		const status = type === "activate" ? 1 : 0;
		dispatch(
			Actions.Form.request({
				method: "put",
				entity: "promo-code",
				name: "promo-code",
				id: id,
				url: `/promo-code/${id}`,
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
				title="Вы действительно хотите удалить?"
				toggle={modal}
				setToggle={setModal}
				closable
				cancelText="нет"
				okText="да"
				onOk={() => deleteAction(selected)}
			/>
			<EntityContainer.All
				entity="promo-code"
				name={`promo-code`}
				url="/promo-code"
				primaryKey="id"
				params={{
					sort: "-id",
					extra: {
						title: params.title_ru ? params.title_ru : "",
						date_to: params.date_to ? params.date_to : ""
					},
					filter: {
						status: params.status ? params.status : ""
					},
					limit: pageLimit,
					include: "translations,usedUsersCount",
					page: page ? page : 1
				}}>
				{({ items, isFetched, meta }) => {
					// let a = items.find(item => item.id === 344);
					return (
						<>
							<Header
								title="Промокоды"
								buttonName="Добавить"
								buttonClick={() => history.push("/promo-code/create")}
								filter={filter}
								setFilter={setFilter}
								hasButton={!bookkeeping}
								hasFilter={true}
								meta={meta}>
								<Filter {...{ setFilter }} />
							</Header>
							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								hasDelete={false}
								emptyUiText="Список пусто"
								// editIcon={<Icon name="eye" className="w-5 h-5 mr-1" />}
								// deleteAction={value => deleteAction(value.id)}
								editAction={value => history.push(`/promo-code/update/${value.id}`)}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4",
										render: value => <>{value}</>
									},
									{
										title: t("Имя"),
										dataIndex: "title_ru",
										render: value => <>{value}</>
									},
									{
										title: t("Код"),
										dataIndex: "code",
										render: value => <>{value}</>
									},
									{
										className: "word-wrap",
										dataIndex: "users_count",
										title: t("Число пользователей \n общ/исп/остаток"),
										render: (value, row) => <>{`${value}/${row.usedUsersCount}/${value - row.usedUsersCount}`}</>
									},
									{
										title: t("Дата создания"),
										dataIndex: "created_at",
										render: value => <>{helpers.formatDate(value * 1000, "DD.MM.YYYY / HH:mm:ss")}</>
									},
									{
										title: t("Дата окончания"),
										dataIndex: "expire_at",
										render: value => <>{value ? helpers.formatDate(value * 1000, "DD.MM.YYYY / HH:mm:ss") : "-"}</>
									},
									{
										title: t("Срок"),
										dataIndex: "expire_of",
										render: (value, row) => <>{row.type === 1 ? value + " (День)" : value + " (месяц)"}</>
									},
									{
										title: t("Статус"),
										dataIndex: "status",
										className: "w-8",
										render: value => {
											return value === 1 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>;
										}
									},
									{
										className: "w-8 ",
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
								dataSource={items}
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
