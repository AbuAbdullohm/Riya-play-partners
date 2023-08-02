import React, { useState } from "react";
import { Avatar, Button, Header, Icon, Modal, Pagination, Table, Tag } from "components";
import EntityContainer from "modules/entity/containers";
import Filter from "./components/filter";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "qs";
import { useNotification, useAccess } from "hooks";
import FilmFilter from "./components/FilmFilter";
import DownloadXls from "./components/downloadXls";

const List = ({ history, location }) => {
	const isAdmin = useAccess({ roles: ["admin"] });
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { page = 1, pageLimit } = params;
	const { notification } = useNotification();
	const [selected, setSelected] = useState();
	const [film, setFilm] = useState();

	// boolean state
	const [filter, setFilter] = useState(false);
	const [modal, setModal] = useState(false);
	const [loadingDelete, setLoadingDelete] = useState(false);
	const [filmFilter, setFilmFilter] = useState(false);

	const visible = {};

	if (params.visible) {
		visible[`visible_${params.visible}`] = 1;
	}

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};

	const deleteAction = id => {
		setLoadingDelete(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "films",
				name: `films`,
				id: id,
				version: "v2",
				url: `/films/${id}`,
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

	const updateAction = (id, type) => {
		const status = type === "activate" ? 1 : 0;
		dispatch(
			Actions.Form.request({
				method: "put",
				entity: "films",
				name: "films",
				id: id,
				version: "v2",
				url: `/films/update-status/${id}`,
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

	const onChange = page => {
		const search = { ...params, page: page + 1 };
		history.push({ search: qs.stringify(search) });
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

			<Modal.Default exitBtn size="xl" header={`Название фильма: ${get(film, "name_ru")}`} toggle={filmFilter} setToggle={setFilmFilter}>
				<FilmFilter {...{ film, filmFilter }} />
			</Modal.Default>

			<EntityContainer.All
				entity="films"
				name={`films`}
				url="/films"
				version="v2"
				primaryKey="id"
				params={{
					sort: params.sort || "-id",
					limit: pageLimit,
					include: "files,company,type,genres,categories,seasons,actors,holder.logo",
					extra: {
						category_id: params.category_id,
						company_id: params.company_id,
						name: params.name,
						start: (params.start || []).length > 0 ? params.start[0] : null,
						end: (params.start || []).length > 0 ? params.start[1] : null,
						actor_id: params.actor_id
					},
					filter: {
						...visible,
						type: params.type,
						year: params.year,
						recommended: params.recommended ? 1 : "",
						enabled_watermark: params.enabled_watermark ? 1 : "",
						id: params.id,
						paid: params.paid,
						foreign_status: params.foreign_status,
						status: params.status,
						kinopoisk_id: params.kinopoisk_id,
						external_type: params.external_type,
						foreign_user_can_view: params.foreign_user_can_view && params.foreign_user_can_view
					},
					page: page || 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header
								title="Список филмы"
								buttonName="Добавить"
								buttonClick={() => history.push(`/films/create`)}
								filter={filter}
								setFilter={setFilter}
								hasFilter={true}
								textLeft={<DownloadXls />}
								meta={meta}>
								<Filter {...{ setFilter }} />
							</Header>

							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								emptyUiText="Список пусто"
								hasDelete={isAdmin}
								deleteAction={value => onDeleteHandler(value.id)}
								editAction={value => history.push(`/films/update/${value.id}${page ? `?page=${page}` : ""}`)}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4 text-center",
										render: value => <>{value}</>
									},
									{
										title: t("Фото"),
										dataIndex: "files",
										className: "w-8 text-center",
										render: value => {
											return <Avatar isRectangle src={get(value, "[0].thumbnails.small.src")} />;
										}
									},
									{
										title: t("Название"),
										dataIndex: "name_ru",
										render: value => <>{value}</>
									},
									{
										title: t("Год"),
										dataIndex: "year",
										render: value => <>{value}</>
									},
									{
										title: t("Жанр"),
										dataIndex: "genres",
										render: genres =>
											genres
												? genres.reduce((prev, genre) => [...prev, genre.name_ru ? genre.name_ru : genre.name_ru], []).join(", ")
												: ""
									},
									{
										title: t("Тип"),
										dataIndex: "type",
										render: type => get(type, "name_ru", "")
									},
									// {
									// 	title: t("Правообладатель"),
									// 	className: "text-center",
									// 	dataIndex: "holder",
									// 	render: value => <>{value && value.id}</>
									// },
									{
										title: t("Смотреть за границей"),
										dataIndex: "foreign_status",
										render: value => {
											return <div>{value === 1 ? <Tag color={"green"}>Видно</Tag> : <Tag color={"red"}>Невидно</Tag>}</div>;
										}
									},
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
									},
									{
										className: "w-5",
										render: (_, row) => {
											return (
												<Button.Outline
													className="status-btn"
													type="success"
													tooltip={t("Статистика фильмов")}
													onClick={() => {
														setFilmFilter(!filmFilter);
														setFilm(row);
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
