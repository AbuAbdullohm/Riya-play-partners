import React, { useState } from "react";
import { Table, Pagination, Modal, Header, Tag } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "query-string";
import { useNotification } from "hooks";
import { helpers } from "services";
import BanModal from "./components/BanModal";

const Banned = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page, pageLimit } = params;

	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [banModal, setBanModal] = useState(false);
	const [selected, setSelected] = useState();
	const [loadingDelete, setLoadingDelete] = useState(false);

	const onDeleteHandler = id => {
		setSelected(id);
		setModal(true);
	};

	const deleteAction = id => {
		setLoadingDelete(true);
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "banned-user-agent",
				name: `banned-user-agent`,
				id: id,
				version: "v3",
				url: `/banned-user-agent/${id}`,
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

		history.push({
			search: qs.stringify(search)
		});
	};

	return (
		<>
			<Modal.Default key={"banned-user-agent-modal"} toggle={banModal} setToggle={() => setBanModal(false)}>
				<BanModal modal={banModal} setModal={setBanModal} />
			</Modal.Default>

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
			<EntityContainer.All
				entity="banned-user-agent"
				name={`banned-user-agent`}
				url="/banned-user-agent"
				version="v3"
				primaryKey="id"
				params={{
					sort: "-id",
					limit: pageLimit,
					page: page ? page : 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="mt-5">
							<Header
								title={t("Запрещенные устройства")}
								buttonName="Добавить"
								buttonClick={() => setBanModal({ open: true, create: true })}
								meta={meta}
							/>
							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								emptyUiText="Список пусто"
								deleteAction={value => onDeleteHandler(value.id)}
								editAction={value => setBanModal({ value })}
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4",
										render: value => value
									},
									{
										title: t("Устройство"),
										dataIndex: "user_agent",
										render: value => value
									},
									{
										title: t("Дата"),
										dataIndex: "created_at",
										render: value => <>{helpers.formatDate(value * 1000, "DD.MM.YYYY")}</>
									},
									{
										title: t("Статус"),
										className: "w-8",
										dataIndex: "status",
										render: value => {
											return <div>{value === 1 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>}</div>;
										}
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

export default Banned;
