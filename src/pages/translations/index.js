import React from "react";
import qs from "query-string";
import get from "lodash/get";
import Actions from "modules/entity/actions";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import EntityContainer from "modules/entity/containers";
import { useNotification } from "hooks";
import { EditableTable, Pagination, Header } from "components";

const List = () => {
	const { notification } = useNotification();
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();
	const { page, pageLimit } = qs.parse(location.search);
	const { t } = useTranslation();

	const params = qs.parse(location.search, { ignoreQueryPrefix: true });

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	const handleSave = ({ newValue }) => {
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: "translation",
				name: "all",
				url: "/translations/list",
				primaryKey: "id",
				id: newValue.id,
				values: newValue,
				updateData: true,
				normalizeData: data => data,
				cb: {
					success: () => {
						notification("Успешно", {
							type: "success",
							duration: 2
						});
					},
					error: () => {
						notification("Что-то пошло не так", {
							type: "danger",
							duration: 2
						});
					}
				}
			})
		);
	};

	return (
		<>
			<div className="page-container">
				<div className="pt-10">
					<EntityContainer.All
						entity="translation"
						name="all"
						url="/main/list/react"
						params={{
							limit: pageLimit,
							sort: "-id",
							page: page || 1,
							extra: { message: params.q }
						}}>
						{({ items, isFetched, meta = {} }) => (
							<>
								<Header
									title="Список переводов"
									buttonName="Добавить"
									buttonClick={() => 2 + 2}
									hasButton={false}
									hasFilter={false}
									hasExport={false}
									meta={meta}
								/>
								<EditableTable
									items={items}
									pagination={true}
									onSave={handleSave}
									className="mt-5"
									columns={[
										{
											title: "ID",
											dataIndex: "id",
											className: "w-5 text-center",
											render: value => <>{value}</>
										},
										{
											title: t("Источник"),
											dataIndex: "message",
											render: value => <>{value}</>
										},
										{
											title: t("на узбекском языке"),
											dataIndex: "uz",
											editable: true,
											render: value => <>{value}</>
										},
										{
											title: t("На русском языке"),
											dataIndex: "ru",
											editable: true,

											render: value => <>{value}</>
										}
									]}
								/>
								{items && items.length < 1 && (
									<div className="intro-y bg-gray-400 w-full p-5 text-center border-radius dark:bg-dark-3">
										{t("Не найдено никакого перевода")}
									</div>
								)}
								{get(meta, "pageCount", 1) > 1 && (
									<Pagination pageCount={get(meta, "pageCount", 1)} currentPage={page ? Number(page) : 1} handlePageClick={onChange} />
								)}
							</>
						)}
					</EntityContainer.All>
				</div>
			</div>
		</>
	);
};

export default List;
