import React, { useState } from "react";
import { Avatar, Button, Header, Icon, Modal, Pagination, Table, Tag } from "components";
import { get } from "lodash";
import { useDispatch } from "react-redux";
import qs from "query-string";
import { useTranslation } from "react-i18next";
import Actions from "modules/entity/actions";
import { useNotification } from "hooks";
import EntityContainer from "modules/entity/containers";
import Filter from "./components/filter";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page = 1, pageLimit } = params;
	const { notification } = useNotification();
	const [filter, setFilter] = useState(false);
	const [modal, setModal] = useState(false);
	const [selected, setSelected] = useState();

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "genres",
				name: `genres`,
				id: id,
				url: `/genres/${id}`,
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
				entity: "genres",
				name: "genres",
				id: id,
				url: `/genres/${id}`,
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
				entity="genres"
				name={`genres`}
				url="/genres"
				primaryKey="id"
				params={{
					sort: "-id",
					extra: {
						name: params.name ? params.name : ""
					},
					limit: pageLimit,
					include: "photo,icon,types,type",
					page: page
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header
								title="Жанры"
								buttonName="Добавить"
								buttonClick={() => history.push("/genres/create")}
								filter={filter}
								setFilter={setFilter}
								hasFilter={true}
								meta={meta}>
								<Filter {...{ setFilter }} />
							</Header>
							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								emptyUiText="Список пусто"
								deleteAction={value => onDeleteHandler(value.id)}
								editAction={value => history.push(`/genres/update/${value.id}?page=${page}`)}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-50",
										render: value => <>{value}</>
									},
									{
										title: t("Фото"),
										dataIndex: "photo",
										className: "w-82",
										render: value => {
											return <Avatar isRectangle isProduct src={get(value, "thumbnails.small.src")} />;
										}
									},
									{
										title: t("Название"),
										dataIndex: "name_ru",
										render: value => <>{value}</>
									},
									{
										title: t(`Сортировка`),
										className: "text-center",
										dataIndex: "sort",
										render: value => <>{value}</>
									},
									{
										title: t("Статус"),
										dataIndex: "status",
										className: "text-center",
										render: value => {
											return value === 1 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}> Неактивный</Tag>;
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
													tooltip={t("Неактивный")}
													onClick={() => updateAction(get(row, "id"), "deactivate")}>
													<Icon name="power" />
												</Button.Outline>
											);
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
