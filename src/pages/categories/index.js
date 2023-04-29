import React, { useState } from "react";
import { Button, Header, Icon, Modal, Pagination, Table, Tag } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "query-string";
import { useNotification } from "hooks";
import Create from "./create";
import Update from "./update";
import Filter from "./components/filter";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page, pageLimit } = params;
	const [updateCount, setUpdateCount] = useState(1);
	const { notification } = useNotification();
	const [selected, setSelected] = useState();
	// boolean state
	const [modal, setModal] = useState(false);
	const [filter, setFilter] = useState(false);
	const [updateModal, setUpdateModal] = useState(false);
	const [createModal, setCreateModal] = useState(false);

	const onEdit = selected => {
		setSelected(selected);
		setUpdateModal(true);
	};

	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "categories",
				name: `categories`,
				id: id,
				url: `/categories/${id}`,
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
				entity: "categories",
				name: "categories",
				id: id,
				url: `/categories/${id}`,
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

			<Modal.Default header="Добавить категорию" toggle={createModal} setToggle={setCreateModal}>
				<Create {...{ setCreateModal }} onSuccess={() => setUpdateCount(updateCount + 1)} />
			</Modal.Default>

			<Modal.Default header="Изменить" toggle={updateModal} setToggle={setUpdateModal}>
				<Update {...{ selected, setUpdateModal }} onSuccess={() => setUpdateCount(updateCount + 1)} />
			</Modal.Default>

			<EntityContainer.All
				entity="categories"
				name={`categories`}
				url="/categories"
				primaryKey="id"
				params={{
					sort: "sort",
					limit: pageLimit,
					extra: {
						title: params.title ? params.title : ""
					},
					page: page || 1,
					updateCount
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header
								title="Категории"
								buttonName="Добавить"
								buttonClick={() => setCreateModal(true)}
								filter={filter}
								setFilter={setFilter}
								hasFilter={true}
								meta={meta}>
								<Filter {...{ setFilter }} />
							</Header>

							<Table
								isFetched={isFetched}
								items={items}
								rowKey="id"
								className="mt-5"
								editAction={value => onEdit(value)}
								dataSource={items}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4 text-center",
										render: value => <>{value}</>
									},
									{
										title: t("Название"),
										dataIndex: "title_ru",
										render: value => <>{value}</>
									},
									{
										title: t("Видно на главной"),
										className: "w-4 text-center",
										dataIndex: "show_in_home",
										render: value => {
											return <>{value === 1 ? <Tag color={"green"}>Видно</Tag> : <Tag color={"red"}>Не видно</Tag>}</>;
										}
									},
									{
										title: t("Сортировать"),
										className: "w-4 text-center",
										dataIndex: "sort",
										render: value => <>{value ? value : "-"}</>
									},
									{
										title: t("Статус"),
										dataIndex: "status",
										className: "w-8 text-center",
										render: value => {
											return <div>{value === 1 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Не активный</Tag>}</div>;
										}
									},
									{
										className: "w-4",
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
