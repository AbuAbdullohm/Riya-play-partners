import React, { useState } from "react";
import { Button, Header, Icon, Modal, Pagination, Table, Tag } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "query-string";
import { useNotification } from "hooks";

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
				entity: "types",
				name: `types`,
				id: id,
				url: `/types/${id}`,
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
				entity: "types",
				name: "types",
				id: id,
				url: `/types/${id}`,
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
				entity="types"
				name={`types`}
				url="/types"
				primaryKey="id"
				params={{
					sort: "-id",
					extra: {
						name: params.name ? params.name : ""
					},
					limit: pageLimit,
					page: page
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header
								title="Типы"
								buttonName="Добавить"
								buttonClick={() => history.push("/types/create")}
								filter={filter}
								setFilter={setFilter}
								hasFilter={false}
								meta={meta}></Header>
							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								emptyUiText="Список пусто"
								deleteAction={value => onDeleteHandler(value.id)}
								editAction={value => history.push(`/types/update/${value.id}?page=${page}`)}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-50",
										render: value => <>{value}</>
									},
									{
										title: t("Название"),
										dataIndex: "name_ru",
										render: value => <>{value}</>
									},
									{
										title: `Сортировать`,
										dataIndex: "sort",
										render: value => <>{value}</>
									},
									{
										title: `Сезон`,
										dataIndex: "has_season",
										render: value => {
											return value === 1 ? <Tag bg={"blue"}>{t("Сезон")}</Tag> : <Tag bg={"orange"}>{t("Нет сезона")}</Tag>;
										}
									},
									{
										title: t("Статус"),
										dataIndex: "status",
										className: "text-center",
										render: value => {
											return value === 1 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>;
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
