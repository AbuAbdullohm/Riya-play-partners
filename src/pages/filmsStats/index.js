import React, { useState } from "react";
import { Avatar, Header, Modal, Pagination, Table } from "components";
import EntityContainer from "modules/entity/containers";
import Filter from "./components/filter";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "qs";
import { useNotification } from "hooks";
import FilmFilter from "./components/FilmFilter";
import DownloadXls from "./components/downloadXls";

const List = ({ history, location }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { page = 1, pageLimit } = params;
	const { notification } = useNotification();
	const [selected] = useState();
	const [film] = useState();

	// boolean state
	const [filter, setFilter] = useState(false);
	const [modal, setModal] = useState(false);
	const [loadingDelete, setLoadingDelete] = useState(false);
	const [filmFilter, setFilmFilter] = useState(false);

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
								hasButton={false}
								filter={filter}
								sort={{
									title: "По просмотрам",
									value: "viewed"
								}}
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
									{
										title: t("Количество просмотров"),
										className: "text-center",
										dataIndex: "viewed",
										render: value => <>{value && value}</>
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
