import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";
import qs from "query-string";

import { Table, Pagination, Modal, Header, Tabs } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useNotification } from "hooks";
import config from "config";
import { useAccess } from "hooks";
import Create from "./create";
import Update from "./update";

const List = ({ history, location }) => {
	const langCode = useSelector(state => state.system.currentLangCode);
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const isModerator = useAccess({ roles: ["moderator"] });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { lang, page } = params;
	const { notification } = useNotification();
	const [canUpdate, setCanUpdate] = useState(false);
	const tabLang = lang || langCode;
	const [modal, setModal] = useState(false);
	const [updateModal, setUpdateModal] = useState(false);
	const [createModal, setCreateModal] = useState(false);
	const [selected] = useState();

	const deleteAction = id => {
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "menu",
				name: `all`,
				id: id,
				url: `/menu/${id}`,
				deleteData: true,
				primaryKey: "menu_id",
				cb: {
					success: () => {
						notification("Успешно удалена", {
							type: "success"
						});
						setModal(false);
						setCanUpdate(!canUpdate);
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

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};
	return (
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

			<Modal.Default header="Добавить меню" toggle={createModal} setToggle={setCreateModal}>
				<Create {...{ setCreateModal, tabLang }} />
			</Modal.Default>
			<Modal.Default header="Изменить меню" toggle={updateModal} setToggle={setUpdateModal}>
				<Update {...{ selected, setUpdateModal, tabLang }} />
			</Modal.Default>
			<EntityContainer.All
				entity="menu"
				name={`all`}
				url="/menu"
				primaryKey="menu_id"
				params={{
					limit: params["page-limit"] ? params["page-limit"] : 30,
					page,
					extra: { _l: tabLang }
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header
								buttonName={t("Добавить")}
								buttonClick={() => setCreateModal(true)}
								meta={meta}
								title="Menu"
								hasSearch={false}
								hasFilter={false}
							/>
							<Tabs
								items={config.API_LANGUAGES}
								onTabChange={value => {
									const search = { ...params, lang: value };
									history.push({ search: qs.stringify(search) });
								}}
								activeItem={tabLang}
								className={"mt-5 mb-5 intro-y"}
							/>

							<Table
								isFetched={isFetched}
								items={items}
								rowKey="menu_id"
								hasSave={isModerator}
								className="mt-5"
								hasDelete={false}
								hasEdit={false}
								columns={[
									{
										title: t("ID"),
										dataIndex: "menu_id",
										className: "w-4 text-center",
										render: value => <>{value}</>
									},
									{
										title: t("Название"),
										dataIndex: "title",
										render: (value, row) => (
											<div>
												<Link to={`/menu/view/${row.menu_id}?alias=${row.title}`}>{value}</Link>
											</div>
										)
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
