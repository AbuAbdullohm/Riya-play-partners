import React, { useState } from "react";
import { useDispatch } from "react-redux";
import qs from "query-string";
import "./style.scss";
import { Modal, Header, Table } from "components";
import EntityContainer from "modules/entity/containers";
import Actions from "modules/entity/actions";
import { useNotification } from "hooks";
import CreateItem from "./components/createItem";
import UpdateItem from "./components/updateItem";

const List = ({ location, match }) => {
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [updateModal, setUpdateModal] = useState(false);
	const [createModal, setCreateModal] = useState(false);
	const [selected, setSelected] = useState();
	const [canUpdate, setCanUpdate] = useState(false);
	const { id } = match.params;
	const query = qs.parse(location.search);
	const { alias } = query;

	const onEdit = value => {
		setUpdateModal(true);
		setSelected(value);
	};

	const onDeleteHandler = menuId => {
		setModal(true);
		setSelected(menuId);
	};
	const deleteAction = () => {
		const menuId = selected.menu_item_id;
		dispatch(
			Actions.Form.request({
				method: "delete",
				entity: "menuItems",
				name: `menuItems-${id}`,
				id: menuId,
				url: `/menu-item/${menuId}`,
				deleteData: true,
				primaryKey: "menu_item_id",
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
				<CreateItem menuId={id} {...{ setCreateModal, canUpdate, setCanUpdate }} />
			</Modal.Default>
			<Modal.Default header="Изменить меню" toggle={updateModal} setToggle={setUpdateModal}>
				<UpdateItem menuId={id} {...{ selected, setUpdateModal, canUpdate, setCanUpdate }} />
			</Modal.Default>
			<EntityContainer.All
				entity="menuItems"
				name={`menuItems-${id}`}
				url="/menu-item"
				primaryKey="menu_item_id"
				canUpdate={canUpdate}
				params={{
					limit: 50,
					sort: "sort",
					include: "files",
					filter: { menu_id: id }
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<div className="pageContainer">
							<Header
								buttonName="Добавить"
								buttonClick={() => setCreateModal(true)}
								hasButton={true}
								title={alias}
								hasSearch={false}
								hasFilter={false}
								meta={meta}
							/>
							<div className="viewTab">
								<Table
									items={items}
									isFetched={isFetched}
									rowKey="menu_item_id"
									className="mt-5"
									emptyUiText="Список пусто"
									deleteAction={value => onDeleteHandler(value)}
									editAction={value => onEdit(value)}
									columns={[
										{
											title: "Загаловок",
											dataIndex: "title",
											render: value => <>{value}</>
										},
										{
											dataIndex: "url",
											render: value => <>{value}</>
										}
									]}
								/>
							</div>
						</div>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
