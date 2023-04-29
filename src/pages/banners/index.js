import React, { useState } from "react";
import { Table, Pagination, Avatar, Modal, Header, Tabs, Tag, Button, Icon } from "components";
import EntityContainer from "modules/entity/containers";
import Filter from "./components/filter";
import Actions from "modules/entity/actions";
import config from "config";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";
import qs from "query-string";
import { useNotification } from "hooks";
import { helpers } from "services";

const List = ({ history, location }) => {
	const langCode = useSelector(state => state.system.currentLangCode);
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { lang, page, pageLimit } = params;
	const tabLang = lang || langCode;
	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [selected, setSelected] = useState();
	const [loadingDelete, setLoadingDelete] = useState(false);
	const deleteAction = id => {
		setLoadingDelete(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "banners",
				name: `banners`,
				id: id,
				url: `/banners/${id}`,
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

	const updateAction = (id, type) => {
		const status = type === "activate" ? 1 : 0;
		dispatch(
			Actions.Form.request({
				method: "put",
				entity: "banners",
				name: "banners",
				id: id,
				url: `/banners/${id}`,
				updateData: true,
				primaryKey: "id",
				normalizeData: data => data,
				params: {
					extra: { _l: tabLang }
				},
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
				entity="banners"
				name={`banners`}
				url="/banners"
				version="v1"
				primaryKey="id"
				params={{
					sort: "-id",
					limit: pageLimit,
					extra: { _l: tabLang },
					include: "files,translations,film",
					page: page ? page : 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header title="Баннеры" buttonName="Добавить" buttonClick={() => history.push(`/banners/create?lang=${tabLang}`)} meta={meta}>
								<Filter />
							</Header>

							<Tabs
								items={config.API_LANGUAGES}
								onTabChange={value => {
									const search = { ...params, lang: value };
									history.push({ search: qs.stringify(search) });
								}}
								activeItem={tabLang}
								className={"mt-5 intro-y"}
							/>

							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								emptyUiText="Список пусто"
								editAction={value => history.push(`/banners/update/${value.id}?lang=${tabLang}`)}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4",
										render: value => <>{value}</>
									},
									{
										title: t("Фото"),
										dataIndex: "files",
										className: "w-8",
										render: value => <Avatar isProduct isRectangle src={get(value, "[0].thumbnails.small.src")} />
									},
									{
										title: t("Загаловок"),
										dataIndex: "title",
										render: value => <>{value}</>
									},
									{
										title: t("Линк/Фильм"),
										dataIndex: "type",
										render: (value, row) => (value === 1 ? <i>{get(row, "link")}</i> : value === 2 ? <>{get(row, "film.name_ru")}</> : "")
									},
									{
										title: t("Дата публикации"),
										className: "w-4",
										dataIndex: "created_at",
										render: value => <>{helpers.formatDate(value * 1000, "DD.MM.YYYY")}</>
									},

									{
										title: t("Количество просмотров"),
										className: "w-4 text-center",
										dataIndex: "viewed",
										render: value => <>{value}</>
									},
									{
										title: t("Количество кликов"),
										className: "w-4 text-center",
										dataIndex: "clicked",
										render: value => <>{value === null ? 0 : value}</>
									},
									{
										title: t("Окончание"),
										className: "w-14",
										dataIndex: "start_date",
										render: (value, row) => {
											const end_date = get(row, "end_date");
											const expected_view_count = get(row, "expected_view_count");
											if (expected_view_count) {
												return <>{expected_view_count}</>;
											} else {
												return <>{helpers.formatDate(end_date * 1000, "DD.MM.YYYY")}</>;
											}
										}
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
