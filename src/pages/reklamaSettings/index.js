import React, { useState } from "react";
import { Table, Pagination, Modal, Header, Tag, Button, Icon } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "query-string";
import { useNotification } from "hooks";
import { helpers } from "services";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page, pageLimit } = params;

	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [selected, setSelected] = useState();
	const [loadingDelete, setLoadingDelete] = useState(false);
	// const onDeleteHandler = id => {
	// 	setSelected(id);
	// 	setModal(true);
	// };

	const deleteAction = id => {
		setLoadingDelete(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "ads",
				name: `ads`,
				id: id,
				url: `/ads/${id}`,
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

		history.push({
			search: qs.stringify(search)
		});
	};

	const updateAction = (row, type) => {
		const status = type === "activate" ? 1 : 0;
		dispatch(
			Actions.Form.request({
				method: "put",
				entity: "ads",
				name: "ads",
				id: row.id,
				url: `/ads/${row.id}`,
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
						notification(t("Что-то пошло не так"), {
							type: "danger"
						});
					},
					finally: () => {}
				},
				values: { status, type: row.type }
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
				entity="ads"
				name={`ads`}
				url="/ads"
				primaryKey="id"
				params={{
					sort: "-id",
					limit: pageLimit,
					page: page ? page : 1,
					include: "advertising"
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="mt-5">
							<Header
								buttonName="Добавить"
								title="Пакет рекламы"
								hasButton={false}
								buttonClick={() => history.push(`/reklamaSettings/create`)}
								meta={meta}
							/>
							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								emptyUiText="Список пусто"
								// deleteAction={value => onDeleteHandler(value.id)}
								editAction={value => history.push(`/reklamaSettings/update/${value.id}`)}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4",
										render: value => <>{value}</>
									},

									{
										title: t("Название"),
										dataIndex: "type",
										render: value => {
											if (value === 1) {
												return "Пакет FF (Free user - Free film)";
											} else if (value === 2) {
												return "Пакет PF (Premium user - Free film)";
											} else if (value === 3) {
												return "Пакет PP (Premium user - Premium film)";
											}
										}
									},
									{
										title: t("Типы пользователь"),
										dataIndex: "type_users",
										render: value => {
											if (value === 0) {
												return <>Простой</>;
											} else if (value === 1) {
												return <>Премиум</>;
											}
										}
									},
									{
										title: t("Типы фильмов"),
										dataIndex: "paid",
										render: value => {
											if (value === 0) {
												return <>Бесплатные</>;
											} else if (value === 1) {
												return <>Платные</>;
											}
										}
									},
									{
										title: t("Количество рекламы"),
										dataIndex: "advertising",
										className: "text-center",
										render: value => <>{value && value.length}</>
									},
									{
										title: t("Последнее изменение"),
										className: "text-center",
										dataIndex: "last_updated_at",
										render: value => <>{helpers.formatDate(value * 1000, "DD.MM.YYYY")}</>
									},
									{
										title: t("Статус"),
										className: "w-8",
										dataIndex: "status",
										render: value => {
											return <div>{value === 1 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>}</div>;
										}
									},
									{
										className: "w-5",
										render: (_, row) => {
											const status = get(row, "status");

											return status === 0 ? (
												<Button.Outline
													className="status-btn"
													type="success"
													tooltip={t("Активный")}
													onClick={() => {
														setSelected(row);
														updateAction(row, "activate");
													}}>
													<Icon name="power" />
												</Button.Outline>
											) : (
												<Button.Outline
													className="status-btn"
													type="danger"
													tooltip={t("Неактивный")}
													onClick={() => updateAction(row, "deactivate")}>
													<Icon name="power" />
												</Button.Outline>
											);
										}
									}
								]}
							/>
							{get(meta, "pageCount", 1) > 1 && (
								<Pagination pageCount={get(meta, "pageCount", 1)} currentPage={page ? Number(page) : 1} handlePageClick={onChange} />
							)}
						</div>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
