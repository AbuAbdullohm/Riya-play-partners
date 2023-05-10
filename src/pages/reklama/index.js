import React, { useState } from "react";
import { Table, Pagination, Modal, Header, Tag, Button, Icon, Spinner } from "components";
import EntityContainer from "modules/entity/containers";
import "./style.scss";
import Actions from "modules/entity/actions";
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

	const onDeleteHandler = id => {
		setSelected(id);
		setModal(true);
	};

	const deleteAction = id => {
		setLoadingDelete(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "adsTrack",
				name: `adsTrack`,
				id: id,
				url: `/ads-track/${id}`,
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
				entity: "adsTrack",
				name: "adsTrack",
				id: id,
				url: `/ads-track/${id}`,
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
				entity="adsTrack"
				name={`adsTrack`}
				url="/ads-track"
				primaryKey="id"
				params={{
					sort: "-id",
					limit: pageLimit,
					extra: { _l: tabLang },
					include: "video,ads",
					page: page ? page : 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="mt-5">
							<Header buttonName="Добавить" buttonClick={() => history.push(`/reklama/create`)} meta={meta} />
							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								emptyUiText="Список пусто"
								deleteAction={value => onDeleteHandler(value.id)}
								editAction={value => history.push(`/reklama/update/${value.id}`)}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4",
										render: value => <>{value && value}</>
									},
									{
										title: t("Загаловок"),
										dataIndex: "name",
										render: value => <>{value && value}</>
									},
									{
										title: t("Обязательно"),
										className: "text-center",
										dataIndex: "second",
										render: value => <>{value && value} секунт</>
									},
									{
										title: t("Дата создания"),
										dataIndex: "created_at",
										render: value => <>{value && helpers.formatDate(value * 1000, "DD.MM.YYYY / HH:mm:ss")}</>
									},

									{
										title: t("Дата начала"),
										dataIndex: "start_date",
										render: value => <>{value && helpers.formatDate(value * 1000, "DD.MM.YYYY / HH:mm:ss")}</>
									},
									{
										title: t("Количество просмотров"),
										className: "text-center",
										dataIndex: "viewed",
										render: value => <>{value && value}</>
									},
									{
										title: t("Завершение"),
										className: "text-center",
										dataIndex: "expected_view_count",
										render: (value, row) => {
											const end_date = get(row, "end_date");
											if (value) {
												return <>{value && String(value).replace(/(.)(?=(\d{3})+$)/g, "$1,")}</>;
											}

											if (end_date) {
												return <>{end_date && helpers.formatDate(end_date * 1000, "DD.MM.YYYY / HH:mm:ss")}</>;
											}
										}
									},

									{
										title: t("Количество кликов"),
										className: "text-center",
										dataIndex: "clicked",
										render: value => <>{value && value}</>
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
						</div>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
