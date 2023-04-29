import React, { useState } from "react";
import { Table, Pagination, Modal, Header, Tag, Button, Icon } from "../../components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";
import qs from "query-string";
import { useNotification } from "hooks";
import Filter from "./components/filter";
import { helpers } from "../../services";
// import config from "config";

const List = ({ history, location }) => {
	const [selected, setSelected] = useState();
	const [modal, setModal] = useState(false);
	const [filter, setFilter] = useState(false);

	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { notification } = useNotification();

	const langCode = useSelector(state => state.system.currentLangCode);
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { page, pageLimit, lang } = params;
	const tabLang = lang || langCode;

	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "advertising",
				name: `advertising-${tabLang}`,
				id: id,
				url: `/advertising/${id}`,
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
				entity: "advertising",
				name: "advertising",
				id: id,
				url: `/advertising/${id}`,
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
				entity="advertising"
				name={`advertising`}
				url="/advertising"
				primaryKey="id"
				params={{
					sort: "-id",
					extra: {
						// _l: tabLang,
						name: params.name || "",
						film_name: params.film_name || ""
					},
					limit: pageLimit,
					// include: "translations,files",
					page: page || 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header
								title="Рекламы"
								buttonName="Добавить"
								buttonClick={
									() => history.push(`/advertising/create`)
									// history.push(`/series/create?lang=${lang}`)
								}
								meta={meta}
								filter={filter}
								setFilter={setFilter}
								hasFilter={false}>
								<Filter />
							</Header>
							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								emptyUiText="Список пусто"
								// deleteAction={value =>
								// 	onDeleteHandler(value.id)
								// }
								editAction={value => history.push(`/advertising/update/${value.id}${page ? `?page=${page}` : ""}`)}
								dataSource={items}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4",
										render: value => <>{value}</>
									},
									{
										title: t("Название"),
										dataIndex: "title_ru",
										render: value => <>{value}</>
									},
									{
										title: t("Линк"),
										dataIndex: "link",
										render: value => <i>{value}</i>
									},
									{
										title: t("Просмотры"),
										dataIndex: "views",
										render: value => <>{value}</>
									},
									{
										title: t("Cрок"),
										dataIndex: "type",
										render: (value, row) =>
											value === 1 ? get(row, "max_views_count") : helpers.momentUtf(get(row, "expire_at"), "DD.MM.YYYY / HH:mm:ss")
									},

									// {
									// 	title: t("Сумма просмотра"),
									// 	dataIndex: "max_views_count",
									// 	render: (value, row) => get(row, "type", null) == 1 ? <>{value}</> : null
									// },
									// {
									// 	title: t("Cрок"),
									// 	dataIndex: "expire_at",
									// 	render: (value, row) => get(row, "type", null) == 2 ? <>{helpers.formatDate(value * 1000, "DD.MM.YYYY / HH:mm:ss")}</> : null
									// },
									{
										title: t("Статус"),
										dataIndex: "status",
										className: "w-8",
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
