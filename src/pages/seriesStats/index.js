import React, { useState } from "react";
import { Avatar, Header, Pagination, Table, Modal } from "components";
import EntityContainer from "modules/entity/containers";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import qs from "qs";
import Filter from "./components/filter";
import FilmFilter from "./components/SeriesFilter";

const List = ({ history, location }) => {
	const { t } = useTranslation();
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { page, pageLimit } = params;
	const [film] = useState();
	// boolean state
	const [filter, setFilter] = useState(false);
	const [seriesFilter, setSeriesFilter] = useState(false);

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	return (
		<>
			<Modal.Default exitBtn size="xl" header={`Название фильма: ${get(film, "name_ru")}`} toggle={seriesFilter} setToggle={setSeriesFilter}>
				<FilmFilter {...{ film, seriesFilter }} />
			</Modal.Default>
			<EntityContainer.All
				entity="series"
				name={`series`}
				url="/series"
				version="v2"
				primaryKey="id"
				params={{
					sort: params.sort || "-id",
					extra: {
						name: params.name || "",
						film_name: params.film_name || "",
						start: (params.start || []).length > 0 ? params.start[0] : null,
						end: (params.start || []).length > 0 ? params.start[1] : null
					},
					limit: pageLimit,
					include: "translations,files,film,season",
					page: page || 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header title="Серии" hasButton={false} meta={meta} sort={"viewed"} filter={filter} setFilter={setFilter} hasFilter={true}>
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
										className: "w-4",
										render: value => <>{value}</>
									},
									{
										title: t("Фото"),
										dataIndex: "files",
										className: "w-8 text-center",
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
										render: value => <>{get(value, "name_ru", "Кинофильм")}</>
									},
									{
										title: t("Количество просмотров"),
										className: "text-center",
										dataIndex: "viewed",
										render: value => <>{value ? value : 0}</>
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
