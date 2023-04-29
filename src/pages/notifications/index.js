import React, { useState } from "react";
import { Table, Pagination, Modal, Header, Tag, Button, Icon, Spinner } from "components";
import EntityContainer from "modules/entity/containers";
import Filter from "./components/filter";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "qs";
import { useNotification } from "hooks";
import View from "./components/view";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page = 1, pageLimit } = params;

	const { notification } = useNotification();
	const [selected, setSelected] = useState();
	const [modal, setModal] = useState(false);
	const [loadingDelete, setLoadingDelete] = useState(false);
	const [view, setView] = useState(false);
	const [viewData, setViewData] = useState();
	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const deleteAction = notification_id => {
		setLoadingDelete(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "notifications",
				name: `notifications`,
				id: notification_id,
				version: "v2",
				url: `/notifications/${notification_id}`,
				deleteData: true,
				primaryKey: "notification_id",
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

	const updateAction = (notification_id, type) => {
		const status = type === "activate" ? 1 : 0;
		dispatch(
			Actions.Form.request({
				method: "put",
				entity: "notifications",
				name: "notifications",
				id: notification_id,
				version: "v2",
				url: `/notifications/${notification_id}`,
				updateData: true,
				primaryKey: "notification_id",
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

			<Modal.Default exitBtn size="xl" header={`Продление подписки для пользователей`} toggle={view} setToggle={setView}>
				<View {...{ view, viewData }} />
			</Modal.Default>
			<EntityContainer.All
				entity="notifications"
				name={`notifications`}
				url="/notifications"
				version="v2"
				primaryKey="notification_id"
				params={{
					sort: "-notification_id",
					extra: { name: params.name ? params.name : "" },
					filter: {
						status: params.status,
						rates: params.rates ? params.rates.split("/")[0] : null
					},
					limit: pageLimit ? pageLimit : 10,
					include: "translations,model",
					page: page || 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header title="Уведомления" buttonName="Добавить" buttonClick={() => history.push(`/notifications/create`)} meta={meta}>
								<Filter />
							</Header>

							{isFetched ? (
								<Table
									items={items}
									isFetched={isFetched}
									rowKey="notification_id"
									className="mt-5"
									hasEdit={true}
									editAction={value => history.push(`/notifications/update/${value.id}`)}
									emptyUiText="Список пусто"
									deleteAction={value => onDeleteHandler(value.notification_id)}
									columns={[
										{
											title: t("ID"),
											dataIndex: "notification_id",
											className: "w-4",
											render: value => <>{value}</>
										},
										{
											title: t("Загаловок"),
											dataIndex: "title",
											render: value => {
												return <>{value}</>;
											}
										},
										{
											title: t("Тип"),
											dataIndex: "type",
											render: value => (
												<>{value === 1 ? t("Новости") : value === 2 ? t("Фильмы") : value === 4 ? t("По тарифу") : t("Уведомление")}</>
											)
										},
										{
											title: t("Перенаправление"),
											dataIndex: "model",
											render: (value, row) => (
												<>
													{get(row, "type") === 1
														? get(row, "model.title")
														: get(row, "type") === 2
														? get(row, "model.name_ru")
														: "-"}
												</>
											)
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
												return status === 0 ? (
													<Button.Outline
														className="status-btn"
														type="success"
														tooltip={t("Активный")}
														onClick={() => {
															setSelected(row);
															updateAction(get(row, "notification_id"), "activate");
														}}>
														<Icon name="power" />
													</Button.Outline>
												) : (
													<Button.Outline
														className="status-btn"
														type="danger"
														tooltip={t("Неактивный")}
														onClick={() => updateAction(get(row, "notification_id"), "deactivate")}>
														<Icon name="power" />
													</Button.Outline>
												);
											}
										},
										{
											className: "w-5",
											render: (_, row) => {
												return (
													<Button.Outline
														className="status-btn"
														type="success"
														onClick={() => {
															setView(!view);
															setViewData(row);
														}}>
														<Icon name="eye" />
													</Button.Outline>
												);
											}
										}
									]}
								/>
							) : (
								<Spinner position="center" className="mt-5" />
							)}

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
