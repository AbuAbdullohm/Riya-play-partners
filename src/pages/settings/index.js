import React from "react";
import { Table, Pagination, Avatar, Header, Tag, Tabs, Button, Icon } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";
import qs from "query-string";
import { useNotification } from "hooks";
import Filter from "./components/filter";
import config from "config";

const List = ({ history, location }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const langCode = useSelector(state => state.system.currentLangCode);
	const { notification } = useNotification();
	const { lang, page, pageLimit } = params;
	const tabLang = lang || langCode;

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
				entity: "settings",
				name: "settings",
				id: id,
				url: `/settings/${id}`,
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
				entity="settings"
				name={`all-${tabLang}`}
				url="/settings"
				primaryKey="id"
				params={{
					sort: "-id",
					limit: pageLimit,
					page: page || 1,
					include: "translations,files,photo",
					extra: { _l: tabLang, title: params.name || "", publish_time: params.publish_time },
					filter: {
						category_id: params.category_id && params.category_id.split("/")[0]
					}
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header title="Настройки" buttonName="Добавить" buttonClick={() => history.push(`/settings/create?lang=${tabLang}`)} meta={meta}>
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
								editAction={value => history.push(`/settings/update/${value.id}?lang=${tabLang}`)}
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
											return <Avatar isProduct src={get(value, "[0].thumbnails.small.src")} />;
										}
									},
									{
										title: t("Названия"),
										dataIndex: "name",
										render: value => <>{value}</>
									},
									{
										title: t("Слуг"),
										dataIndex: "slug",
										render: value => <>{value}</>
									},
									{
										title: t("Линк"),
										dataIndex: "link",
										render: value => <i>{value}</i>
									},
									{
										title: t("Статус"),
										className: "w-8",
										dataIndex: "status",
										render: value => {
											return value === 1 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>;
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
								params={{
									include: "translations,files,photo"
								}}
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
