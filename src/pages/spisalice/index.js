import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import qs from "query-string";
import { useAccess } from "hooks";
import Actions from "modules/entity/actions";
import EntityContainer from "modules/entity/containers";
import { useNotification } from "hooks";
import { Table, Pagination, Header, Tag, Avatar, Button, Icon, Modal } from "components";
import Filter from "./components/filter";
import DownloadXls from "./downloadXls";
import DevicesModal from "./components/devicesModal";
const List = ({ history, location }) => {
	const { downloadFile } = useSelector(state => state.system);

	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const dispatch = useDispatch();
	const isModerator = useAccess({ roles: ["moderator"] });
	const isAdmin = useAccess({ roles: ["admin"] });
	const { t } = useTranslation();
	const { page, pageLimit } = params;
	const { notification } = useNotification();
	const [filter, setFilter] = useState(false);
	const [canUpdate, setCanUpdate] = useState(false);
	const [infoModal, setInfoModal] = useState(false);
	const [devicesModal, setDevicesModal] = useState(false);

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	const unBanHandler = (id, type) => {
		const status = type === "activate" ? 10 : 0;
		dispatch(
			Actions.Form.request({
				method: "post",
				entity: "/user",
				version: "v2",
				name: `all`,
				id: id,
				url: `user/update-status/${id}`,
				deleteData: true,
				primaryKey: "id",
				cb: {
					success: () => {
						notification(type === "activate" ? t("Успешно активирован") : t("Успешно деактивирован"), {
							type: "success"
						});
						setCanUpdate(!canUpdate);
					},
					error: () => {
						notification("Что-то пошло не так", {
							type: "danger"
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
			<Modal.Default size="md" toggle={devicesModal} setToggle={setDevicesModal}>
				<DevicesModal modal={devicesModal} setModal={setDevicesModal} />
			</Modal.Default>

			<Modal.Default size="md" toggle={infoModal} setToggle={setInfoModal}>
				{infoModal && (
					<div className="font-bold text-center">
						Это действие сделано, теперь можно будет использовать его снова после завершения процесса в этом процессе
					</div>
				)}
			</Modal.Default>

			<EntityContainer.All
				entity="user"
				name="user"
				url="/user"
				version="v2"
				dataKey={"items"}
				canUpdate={canUpdate}
				params={{
					sort: "-id",
					limit: pageLimit,
					include: "organization,files,subscribe,userBalance",
					page: page || 1,
					extra: {
						name: params.username ? params.username : "",
						role: isAdmin
							? params.role
								? params.role
								: "moderator,redactor"
							: params.role
							? params.role
							: "admin,moderator,redactor,super_admin,bookkeeping"
					}
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="page-container">
							<div className="pt-10">
								<Header
									title="Список специалистов"
									buttonName="Добавить"
									buttonClick={() => history.push("/spisalice/create")}
									hasButton={isModerator ? false : true}
									hasFilter={true}
									meta={meta}
									textLeft={
										<div
											onClick={() => {
												if (downloadFile.length > 0) {
													setInfoModal(!infoModal);
												}
											}}>
											<DownloadXls />
										</div>
									}
									setFilter={setFilter}
									filter={filter}>
									<Filter {...{ setFilter }} />
								</Header>
								<Table
									items={items}
									rowKey="id"
									className="mt-5"
									hasEdit={true}
									hasDelete={false}
									editAction={value => history.push(`/spisalice/update/${value.id}`)}
									isFetched={isFetched}
									columns={[
										{
											title: t("ID"),
											dataIndex: "id",
											className: "w-1",
											render: value => <>{value}</>
										},
										{
											title: t("Фото"),
											dataIndex: "files",
											className: "w-1 text-center",
											render: value => (
												<div className="flex justify-center">
													<Avatar src={get(value, "[0].thumbnails.small.src")} />
												</div>
											)
										},
										{
											title: t("Логин"),
											dataIndex: "username",
											render: (value, row) => (
												<>
													{value}
													{row.is_provider === 1 && (
														<Tag color={"blue"} className={"ml-10"}>
															{get(row, "organization.title", "-")}
														</Tag>
													)}
												</>
											)
										},

										{
											title: t("Полное имя"),
											dataIndex: "full_name",
											render: value => <>{value}</>
										},

										{
											title: t("Телефон"),
											dataIndex: "phone",
											render: value => <>{value}</>
										},

										{
											title: t("Роле"),
											dataIndex: "role",
											render: value => <>{value}</>
										},

										{
											title: t("Статус"),
											dataIndex: "status",
											className: "w-100",
											render: value => {
												return <>{value === 10 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>}</>;
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
															unBanHandler(get(row, "id"), "activate");
														}}>
														<Icon name="power" />
													</Button.Outline>
												) : (
													<Button.Outline
														className="status-btn"
														type="danger"
														tooltip={t("Неактивный")}
														onClick={() => unBanHandler(get(row, "id"), "deactivate")}>
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
														onClick={() => setDevicesModal(row)}
														className="status-btn"
														type="success"
														tooltip={t("Устройства")}>
														<Icon name="smartphone" />
													</Button.Outline>
												);
											}
										}
									]}
									dataSource={items}
								/>
								{get(meta, "pageCount", 1) > 1 && (
									<Pagination pageCount={get(meta, "pageCount", 1)} currentPage={page ? Number(page) : 1} handlePageClick={onChange} />
								)}
							</div>
						</div>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
