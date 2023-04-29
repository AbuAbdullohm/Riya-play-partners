import React, { useState } from "react";

import { Table, Pagination, Modal, Header } from "components";
import EntityContainer from "modules/entity/containers";
import Filter from "./components/filter";

import Actions from "modules/entity/actions";
import Create from "./create";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";
import qs from "query-string";
import { useNotification } from "hooks";
import Update from "./update";
const List = ({ history, location }) => {
	const langCode = useSelector(state => state.system.currentLangCode);
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [createModal, setCreateModal] = useState(false);
	const [updateCount, setUpdateCount] = useState(1);
	const { lang, page, pageLimit } = params;
	const tabLang = lang || langCode;
	const [canUpdate, setCanUpdate] = useState(false);
	const { notification } = useNotification();
	const [updateModal, setUpdateModal] = useState(false);
	const [modal, setModal] = useState(false);
	const [filter, setFilter] = useState(false);
	const [selected, setSelected] = useState();
	const [loadingDelete, setLoadingDelete] = useState(false);

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};
	const onEdit = selected => {
		setSelected(selected);
		setUpdateModal(true);
	};

	const deleteAction = id => {
		setLoadingDelete(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "reason-for-blocking",
				name: `reason-for-blocking`,
				id: id,
				url: `/reason/${id}`,
				deleteData: true,
				primaryKey: "id",
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
			<Modal.Default header="Показать причину" toggle={createModal} setToggle={setCreateModal}>
				<Create {...{ setCreateModal, tabLang }} />
			</Modal.Default>

			<Modal.Default header="Изменить" toggle={updateModal} setToggle={setUpdateModal}>
				<Update {...{ selected, setUpdateModal }} onSuccess={() => setUpdateCount(updateCount + 1)} />
			</Modal.Default>

			<EntityContainer.All
				entity="reason-for-blocking"
				name={`reason-for-blocking`}
				url="/reason"
				canUpdate={canUpdate}
				primaryKey="id"
				params={{
					sort: "-id",
					limit: pageLimit,
					page: page ? page : 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header
								title="Причины блокировка"
								buttonName="Добавить"
								buttonClick={() => setCreateModal(true)}
								meta={meta}
								filter={filter}
								setFilter={setFilter}
								hasFilter={false}>
								<Filter />
							</Header>

							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								emptyUiText="Список пусто"
								hasDelete={true}
								deleteAction={value => onDeleteHandler(value.id)}
								editAction={value => onEdit(value)}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4 text-center",
										render: value => <>{value}</>
									},
									{
										title: t("Причины"),
										dataIndex: `title_ru`,
										render: value => <div className="divider-wrapper">{value}</div>
									},
									{
										title: t("Sabab"),
										dataIndex: `title_uz`,
										render: value => <div className="divider-wrapper">{value}</div>
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
