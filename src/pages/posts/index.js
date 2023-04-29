import React, { useState } from "react";

import { Table, Pagination, Avatar, Header, Tabs, Tag, Button, Icon } from "components";
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
	const [filter, setFilter] = useState(false);

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
				entity: "posts",
				name: `all-${tabLang}`,
				id: id,
				url: `/posts/${id}`,
				updateData: true,
				primaryKey: "id",
				normalizeData: data => data,
				cb: {
					success: value => {
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
				params: { extra: { _l: tabLang } },
				values: { status }
			})
		);
	};

	return (
		<>
			<EntityContainer.All
				entity="posts"
				name={`all-${tabLang}`}
				url="/posts"
				primaryKey="id"
				params={{
					sort: "-id",
					include: "category,translations,files",
					limit: pageLimit,
					extra: { _l: tabLang, title: params.title || "" },
					filter: {
						category_id: params.category_id && params.category_id.split("/")[0]
					},
					page: page ? page : 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header
								title="Список новостей"
								buttonName="Добавить"
								buttonClick={() => history.push(`/posts/create?lang=${tabLang}`)}
								meta={meta}
								filter={filter}
								filterLang={true}
								setFilter={setFilter}
								hasFilter={true}>
								<Filter {...{ setFilter, lang }} />
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
								editAction={value => history.push(`/posts/update/${value.id}?lang=${tabLang}`)}
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
											return <Avatar isRectangle isProduct src={get(value, "thumbnails.small.src")} />;
										}
									},
									{
										title: t("Загаловок"),
										dataIndex: "title",
										render: value => <>{value}</>
									},
									{
										title: t("Категория"),
										dataIndex: "category",
										render: value => <>{get(value, `title_${tabLang}`)}</>
									},
									{
										title: t("Дата публикации"),
										dataIndex: "publish_time",
										className: "w-4",
										render: value => <>{helpers.formatDate(value * 1000, "DD.MM.YYYY")}</>
									},
									{
										title: t("Статус"),
										className: "w-4 text-center",
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
