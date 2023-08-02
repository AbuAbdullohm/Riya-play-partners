import React, { useState } from "react";
import { Avatar, Button, Header, Icon, Pagination, Table, Tag, Modal } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "qs";
import { useNotification } from "hooks";
import Filter from "./components/filter";

const List = ({ history, location }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { notification } = useNotification();
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { page, pageLimit } = params;
	const [film, setFilm] = useState();
	// boolean state
	const [filter, setFilter] = useState(false);
	const [seriesFilter, setSeriesFilter] = useState(false);

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
				entity: "payment-method",
				name: "payment-method",
				version: "v2",
				id: id,
				url: `/payment-method/${id}`,
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
			<EntityContainer.All
				entity="payment-method"
				name={`payment-method`}
				url="/payment-method"
				version="v3"
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
					include: "logo",
					page: page || 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header
								title="Серии"
								buttonName="Добавить"
								buttonClick={() => history.push(`/payment-method/create`)}
								meta={meta}
								sort={"viewed"}
								filter={filter}
								setFilter={setFilter}
								hasFilter={true}>
								<Filter {...{ setFilter }} />
							</Header>
							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								emptyUiText="Список пусто"
								editAction={value => history.push(`/payment-method/update/${value.id}${page ? `?page=${page}` : ""}`)}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4",
										render: value => <>{value}</>
									},
									{
										title: t("Фото"),
										dataIndex: "logo",
										className: "w-8 text-center",
										render: value => <Avatar isRectangle isProduct src={get(value, "thumbnails.small.src")} />
									},
									{
										title: t("Заголовок (uz)"),
										dataIndex: "name_uz",
										render: value => <>{value}</>
									},
									{
										title: t("Заголовок (ru)"),
										dataIndex: "name_ru",
										render: value => <>{value}</>
									},
									{
										title: t("Заголовок (en)"),
										dataIndex: "name_en",
										render: value => <>{value}</>
									},
									{
										title: t("Описание (uz)"),
										dataIndex: "name_uz",
										render: value => <>{value}</>
									},
									{
										title: t("Описание (ru)"),
										dataIndex: "name_ru",
										render: value => <>{value}</>
									},
									{
										title: t("Описание (en)"),
										dataIndex: "name_en",
										render: value => <>{value}</>
									},
									{
										title: t("Статус"),
										dataIndex: "status",
										className: "w-8",
										render: value => {
											return <div>{value === 1 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>}</div>;
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
