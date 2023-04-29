import React, { useState } from "react";
import { Table, Pagination, Modal, Header, Tag, Button, Icon } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { get } from "lodash";
import qs from "qs";
import { useNotification, useAccess } from "hooks";
import View from "./components/view";
import Filter from "./components/filter";
import Ban from "./components/ban";
import { helpers } from "services";
const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page, pageLimit } = params;
	const { notification } = useNotification();
	const redactor = useAccess({ roles: ["redactor"] });
	const [filter, setFilter] = useState(false);
	const [modal, setModal] = useState(false);
	const [viewModal, setViewModal] = useState(false);
	const [selected, setSelected] = useState();

	const [modalBan, setModalBan] = useState(false);
	const [selectedBan, setSelectedBan] = useState();
	const [canUpdate, setCanUpdate] = useState();
	const onDeleteHandler = id => {
		setSelected(id);
		setModal(true);
	};
	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "reviews",
				version: "v2",
				name: `reviews`,
				id: id,
				url: `/reviews/${id}`,
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

	const banHandler = id => {
		setModalBan(true);
		setSelectedBan(id);
	};

	const updateAction = (id, type) => {
		const status = type === "activate" ? 1 : 0;
		dispatch(
			Actions.Form.request({
				method: "put",
				entity: "reviews",
				name: "reviews",
				version: "v2",
				id: id,
				url: `/reviews/${id}`,
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
			<Modal.Default toggle={viewModal} size="lg" setToggle={setViewModal}>
				{viewModal && <View {...{ selected, setViewModal, setCanUpdate, canUpdate }} />}
			</Modal.Default>
			<Modal.Default toggle={modalBan} size="lg" setToggle={setModalBan}>
				{modalBan && <Ban {...{ selectedBan, setModalBan, setCanUpdate, canUpdate }} />}
			</Modal.Default>
			<EntityContainer.All
				entity="reviews"
				name={`reviews`}
				url="/reviews"
				version="v2"
				primaryKey="id"
				canUpdate={canUpdate}
				params={{
					sort: "-id",
					limit: pageLimit,
					include: "user,film,replies,user.banned.reason",
					extra: {
						created_end: (params.created_start || []).length > 0 ? params.created_start[1] : null,
						created_start: (params.created_start || []).length > 0 ? params.created_start[0] : null
					},
					filter: {
						user_id: params.user_id ? params.user_id : "",
						film_id: params.film_id ? params.film_id : "",
						status: params.status ? params.status : ""
					},
					page: page || 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header title="Отзывы" hasButton={false} meta={meta} filter={filter} setFilter={setFilter} hasFilter={true}>
								<Filter {...{ setFilter }} />
							</Header>
							<Table
								isFetched={isFetched}
								items={items}
								rowKey="id"
								className="mt-5"
								hasEdit={false}
								hasDelete={!redactor && true}
								deleteAction={value => onDeleteHandler(value.id)}
								dataSource={items}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4 text-center",
										render: value => <>{value}</>
									},
									{
										title: t("Ползователь - User ID"),
										dataIndex: "user",
										render: (value, row) => {
											const userId = get(row, "user_id");

											return (
												<>
													{value && value.username} - {userId}
												</>
											);
										}
									},
									{
										title: t("Отзыв"),
										dataIndex: "message",
										render: value => <>{value}</>
									},
									{
										title: t("Филм"),
										dataIndex: "film",
										render: value => <>{get(value, "name_ru", "-")}</>
									},
									{
										title: t("Дата"),
										dataIndex: "created_at",
										render: value => <>{helpers.formatDate(value * 1000, "DD.MM.YYYY / HH:mm:ss")}</>
									},
									{
										title: t("Статус"),
										dataIndex: "status",
										className: "w-8 text-center",
										render: value => {
											return value === 1 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>;
										}
									},

									{
										title: t("Статус бан"),
										dataIndex: "user",
										className: "w-8 text-center",
										render: value => {
											const banStatusUser = get(value, "banned.status");
											return banStatusUser === 2 ? <Tag color={"red"}>Неактивный</Tag> : <Tag color={"green"}>Активный</Tag>;
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
														updateAction(get(row, "id"), "activate");
													}}>
													<Icon name="power" />
												</Button.Outline>
											) : (
												<Button.Outline
													className="status-btn"
													type="danger"
													tooltip={t("Деактивировать этот комментарий")}
													onClick={() => updateAction(get(row, "id"), "deactivate")}>
													<Icon name="power" />
												</Button.Outline>
											);
										}
									},
									{
										className: "w-5",
										render: (_, row) => {
											if (!redactor) {
												return (
													<Button.Outline
														className="status-btn"
														type="red"
														tooltip={t("Активировать Бан")}
														onClick={() => {
															banHandler(row);
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
												<Button.Outline
													className="status-btn"
													type="primary"
													onClick={() => {
														setSelected(row);
														setViewModal(true);
													}}>
													<Icon name="eye" />
												</Button.Outline>
											);
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
