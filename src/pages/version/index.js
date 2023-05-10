import React from "react";
import { Table, Pagination, Header } from "components";
import EntityContainer from "modules/entity/containers";
// import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
// import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "query-string";
// import { useNotification } from "hooks";
import { helpers } from "services";
import "./style.scss";
import Android from "assets/images/icons/android.svg";
import AndroidTv from "assets/images/icons/tv-monitor.svg";
import Apple from "assets/images/icons/apple.svg";
import AppleTv from "assets/images/icons/apple-tv.svg";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const { page = 1, pageLimit } = qs.parse(location.search);

	const onChange = page => {
		const search = { ...params, page: page + 1 };
		history.push({ search: qs.stringify(search) });
	};
	return (
		<>
			<EntityContainer.All
				entity="versions"
				name={`versions`}
				url="/versions"
				version="v2"
				primaryKey="id"
				params={{
					sort: "-status",
					extra: { name: params.name ? params.name : "" },
					limit: pageLimit ? pageLimit : 10,
					page: page || 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header title="Список версий" buttonClick={() => history.push("/version/create")} buttonName="Добавить" meta={meta} />

							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								hasEdit={false}
								hasDelete={false}
								editAction={value => history.push(`/version/update/${value.id}`)}
								emptyUiText="Список пусто"
								// deleteAction={value => onDeleteHandler(value.notification_id)}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4",
										render: value => <>{value}</>
									},
									{
										title: t("Загаловок"),
										dataIndex: "type",
										render: value => (
											<>
												{value === 1 ? (
													<div className="d-flex align-center ">
														<img className="box-none" style={{ width: "30px", marginRight: "10px" }} src={Android} alt="" /> ANDROID
													</div>
												) : value === 2 ? (
													<div className="d-flex align-center">
														<img className="box-none" style={{ width: "30px", marginRight: "10px" }} src={Apple} alt="" /> IOS
													</div>
												) : value === 3 ? (
													<div className="d-flex align-center">
														<img className="box-none" style={{ width: "30px", marginRight: "10px" }} src={AndroidTv} alt="" />{" "}
														ANDROID TV
													</div>
												) : value === 4 ? (
													<div className="d-flex align-center">
														<img className="box-none" style={{ width: "30px", marginRight: "10px" }} src={AppleTv} alt="" /> IOS TV
													</div>
												) : (
													""
												)}
											</>
										)
									},
									{
										title: "Дата создания",
										dataIndex: "created_at",
										render: value => <>{helpers.formatDate(value * 1000, "DD.MM.YYYY / HH:mm:ss")}</>
									},
									{
										title: "Версии",
										dataIndex: "version",
										render: value => <>{value && value}</>
									},
									{
										title: "Обновленное дата",
										dataIndex: "updated_at",
										render: value => (
											<>{value !== null ? helpers.formatDate(value * 1000, "DD.MM.YYYY / HH:mm:ss") : "Обновленное дата нет"}</>
										)
									},
									{
										title: t("Статус"),
										className: "w-8 text-center",
										dataIndex: "status",
										render: value => {
											if (value === 1) {
												return (
													<div className="spinner-version">
														<div className="double-bounce1" />
														<div className="double-bounce2 green" />
													</div>
												);
											} else {
												return (
													<div className="spinner-version">
														<div className="double-bounce1-red" />
														<div className="double-bounce2-red" />
													</div>
												);
											}
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
