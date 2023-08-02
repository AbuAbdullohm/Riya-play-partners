import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNotification } from "hooks";
import { get } from "lodash";
import qs from "query-string";
import moment from "moment";
// import config from "config";
import Actions from "modules/entity/actions";
import StoreEntities from "store/actions/entities";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Avatar, Header, Modal, Pagination, Table, Tag, Typography, Button, Icon, Loader } from "components";

import CreateSeriesModal from "./components/createSeriesModal";
import UpdateSeriesModal from "./components/updateSeriesModal";
import Form from "./components/form";

import { useParams } from "react-router";

const Update = ({ location, history }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { notification } = useNotification();
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { id } = useParams();
	const { page, pageLimit } = params;
	const [selected, setSelected] = useState(null);
	const [modal, setModal] = useState(false);
	const [seriesValue, setSeriesValue] = useState();
	const [createModal, showCreateModal] = useState(false);
	const [updateModal, showUpdateModal] = useState(false);
	const [canUpdate, setCanUpdate] = useState(false);
	const onChange = page => {
		const search = { ...params, page: page + 1 };
		history.push({ search: qs.stringify(search) });
	};

	const updateAction = (id, type) => {
		const status = type === "activate" ? 1 : 0;
		dispatch(
			Actions.Form.request({
				method: "put",
				entity: "series",
				name: "series",
				version: "v2",
				id: id,
				url: `/series/${id}`,
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

	const onEditModal = value => {
		setSelected(value);
		showUpdateModal(true);
	};

	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "series",
				version: "v2",
				name: `series`,
				id: id,
				url: `/series/${id}`,
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

	const updateFilms = data => {
		dispatch(
			StoreEntities.Update.success({
				entity: "films",
				entityId: id,
				data
			})
		);
	};

	const updateSeries = (data, id) => {
		dispatch(
			StoreEntities.Update.success({
				entity: "series",
				entityId: id,
				data: data
			})
		);
	};

	return (
		<EntityContainer.One
			entity="films"
			name={`films`}
			url={`/films/${id}`}
			version="v2"
			primaryKey="id"
			id={id}
			params={{ include: "translations,files,actors,thriller,tags,categories,paid,country,maker,date,type,gallery,genres,season,screenshots" }}>
			{({ item, isFetched }) => {
				return isFetched ? (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить фильм")}
						</Typography.Heading>

						<EntityForm.Main
							method="put"
							name={`films`}
							entity="films"
							url={`films/${get(item, "id")}`}
							updateData={true}
							version="v2"
							primaryKey="id"
							id={id}
							normalizeData={data => data}
							onSuccess={data => {
								updateFilms(data);
								notification("Успешно обновлено", {
									type: "success"
								});
								history.goBack();
							}}
							onError={() => {
								notification("Что-то пошло не так", {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "name_uz",
									required: true,
									value: get(item, "name_uz")
								},
								{
									name: "name_ru",
									required: true,
									value: get(item, "name_ru")
								},
								{
									name: "description_uz",
									required: true,
									value: get(item, "description_uz")
								},
								{
									name: "description_ru",
									required: true,
									value: get(item, "description_ru")
								},
								{
									name: "publish_time",
									value: moment.unix(get(item, "publish_time", null)),
									required: true,
									onSubmitValue: value => (!!value ? moment(value).unix() : "")
								},
								{
									name: "year",
									required: true,
									value: get(item, "year", ""),
									onSubmitValue: value => `${value}`
								},
								{
									name: "playback_time",
									required: true,
									value: get(item, "playback_time", ""),
									onSubmitValue: value => Number(value)
								},
								{
									name: "photo",
									required: true,
									value: Array.isArray(get(item, "files")) ? get(item, "files") : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "screenshots",
									required: true,
									value: Array.isArray(get(item, "screenshots")) ? get(item, "screenshots") : [],
									onSubmitValue: value => (value ? value.reduce((prev, curr) => [...prev, curr.id + ""], []) : [])
								},
								{
									name: "country_id",
									type: "object",
									required: true,
									value: get(item, "country"),
									onSubmitValue: value => (value ? value.id : null)
								},
								{
									name: "company_id",
									required: true,
									type: "object",
									value: get(item, "company"),
									onSubmitValue: value => (value ? value.id : null)
								},
								{
									name: "holder_id",
									required: true,
									type: "object",
									value: get(item, "holder"),
									onSubmitValue: value => (value ? value.id : null)
								},
								{
									name: "maker_id",
									type: "object",
									required: false,
									value: get(item, "maker"),
									onSubmitValue: value => (value ? value.id : null)
								},
								{
									name: "kinopoisk_id",
									type: "string",
									required: true,
									value: get(item, "kinopoisk_id"),
									onSubmitValue: value => value
								},
								{
									name: "external_type",
									type: "number",
									required: true,
									value: get(item, "external_type"),
									onSubmitValue: value => value
								},
								{
									name: "gallery",
									required: false,
									value: Array.isArray(get(item, "gallery")) ? get(item, "gallery") : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "thriller_id",
									required: false,
									value: get(item, "thriller"),
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "actors",
									required: false,
									value: get(item, "actors") ? get(item, "actors") : [],
									onSubmitValue: value => value && value.length > 0 && value.reduce((prev, curr) => [...prev, curr.id], [])
								},
								{
									name: "paid",
									required: true,
									value: get(item, "paid") === 1 ? 1 : 0,
									onSubmitValue: value => (value ? 1 : 0)
								},
								{
									name: "recommended",
									required: true,
									value: get(item, "recommended") === 1 ? 1 : 0,
									onSubmitValue: value => (value ? 1 : 0)
								},
								{
									name: "foreign_user_can_view",
									type: "string",
									// required: true,
									value: get(item, "foreign_user_can_view") === 1 ? 1 : null,
									onSubmitValue: value => (value ? 1 : null)
								},
								{
									name: "enabled_watermark",
									value: get(item, "enabled_watermark") === 1 ? 1 : 0,
									onSubmitValue: value => (value ? 1 : 0)
								},
								{
									name: "status",
									required: true,
									value: get(item, "status") === 1 ? 1 : 0,
									onSubmitValue: value => (value ? 1 : 0)
								},
								{
									name: "foreign_status",
									value: get(item, "foreign_status") === 1 ? 1 : 0,
									onSubmitValue: value => (value ? 1 : 0)
								},
								{
									name: "categories",
									required: true,
									value: get(item, "categories") ? get(item, "categories") : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id ? curr.id : curr.id], [])
								},
								{
									name: "tags",
									required: true,
									value: get(item, "tags") ? get(item, "tags") : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id ? curr.id : curr.id], [])
								},
								{
									name: "type",
									required: true,
									value: get(item, "type"),
									onSubmitValue: value => Number(value.id)
								},
								{
									name: "visible_web",
									value: get(item, "visible_web") ? 1 : 0,
									onSubmitValue: value => value
								},
								{
									name: "visible_tv",
									value: get(item, "visible_tv") ? 1 : 0,
									onSubmitValue: value => value
								},
								{
									name: "visible_mobile",
									value: get(item, "visible_mobile") ? 1 : 0,
									onSubmitValue: value => value
								},

								{
									name: "genres",
									required: true,
									value: get(item, "genres") ? get(item, "genres") : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id ? curr.id : curr.id], [])
								},
								{
									name: "lang_hash",
									value: get(item, "lang_hash")
								}
							]}
							params={{
								// extra: {_l: tabLang},
								include: "translations,files,categories,year,actors,tags,genres,types,gallery,season,holder"
							}}>
							{({ isSubmitting, values, setFieldValue, handleSubmit, setFieldError, errors, setErrors }) => {
								setSeriesValue(values);
								return (
									<>
										<Form
											{...{
												id,
												setFieldError,
												isFetched,
												values,
												setFieldValue,
												isSubmitting,
												isUpdate: true,
												handleSubmit,
												errors,
												setErrors
											}}
										/>
									</>
								);
							}}
						</EntityForm.Main>

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

							<Modal.Default header="Добавить" size="xl" toggle={createModal} setToggle={showCreateModal}>
								{createModal && <CreateSeriesModal {...{ item: seriesValue, showCreateModal, id, updateSeries, setCanUpdate, canUpdate }} />}
							</Modal.Default>

							<Modal.Default header="Изменить" toggle={updateModal} size="xl" setToggle={showUpdateModal}>
								{updateModal && (
									<UpdateSeriesModal {...{ item: seriesValue, selected, showUpdateModal, id, updateSeries, canUpdate, setCanUpdate }} />
								)}
							</Modal.Default>

							<EntityContainer.All
								entity="series"
								name={`series`}
								url="/series"
								version="v2"
								canUpdate={canUpdate}
								primaryKey="id"
								params={{
									sort: "-id",
									extra: {
										name: params.name ? params.name : ""
									},
									filter: {
										film_id: id
									},
									limit: pageLimit,
									include: "translations,files,film,season,track",
									page: page || 1
								}}>
								{({ items, isFetched, meta }) => (
									<>
										<Header title="Серии" buttonName="Добавить" buttonClick={() => showCreateModal(true)} meta={meta}></Header>
										<Table
											items={items}
											isFetched={isFetched}
											rowKey="id"
											className="mt-5"
											emptyUiText="Список пусто"
											editAction={value => onEditModal(value)}
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
													render: value => <Avatar isRectangle isProduct src={get(value, "[0].thumbnails.small.src")} />
												},
												{
													title: t("Серия"),
													dataIndex: "name_ru",
													render: value => <>{value}</>
												},
												{
													title: t("Фильм"),
													dataIndex: "film",
													render: value => <>{get(value, "name_ru")}</>
												},
												{
													title: t("Сезон"),
													dataIndex: "season",
													render: value => <>{get(value, "name_ru")}</>
												},
												{
													title: t("Статус"),
													dataIndex: "status",
													className: "w-8",
													render: value => {
														return (
															<div>{value === 1 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>}</div>
														);
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
											<Pagination
												pageCount={get(meta, "pageCount", 1)}
												currentPage={page ? Number(page) : 1}
												handlePageClick={onChange}
											/>
										)}
									</>
								)}
							</EntityContainer.All>
						</>
					</>
				) : (
					<Loader />
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
