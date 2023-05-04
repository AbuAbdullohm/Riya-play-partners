import React, { useState } from "react";
import { Table, Pagination, Modal, Header, Tag, Spinner } from "components";
import EntityContainer from "modules/entity/containers";
import "./style.scss";
import Actions from "modules/entity/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import qs from "query-string";
import { useNotification } from "hooks";
import TasIxCreateModal from "./components/TasIxCreateModal";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page, pageLimit } = params;

	const { notification } = useNotification();
	const [modal, setModal] = useState(false);
	const [tasIxModal, setTasIxModal] = useState(false);
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
				entity: "tasix",
				name: `tasix`,
				id: id,
				version: "v3",
				url: `/tasix/${id}`,
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
			<Modal.Default key={"tasix-modal"} toggle={tasIxModal} setToggle={setTasIxModal}>
				<TasIxCreateModal modal={tasIxModal} setModal={setTasIxModal} />
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
				entity="tasix"
				name={`tasix`}
				url="/tasix"
				version="v3"
				primaryKey="id"
				params={{
					limit: pageLimit,
					page: page ? page : 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							{isFetched ? (
								<div className="mt-5">
									<Header
										title={"Tas-ix"}
										buttonName="Добавить"
										buttonClick={() => setTasIxModal({ open: true, create: true })}
										meta={meta}
									/>
									<Table
										items={items}
										isFetched={isFetched}
										rowKey="id"
										className="mt-5"
										emptyUiText="Список пусто"
										deleteAction={value => onDeleteHandler(value.id)}
										editAction={value => setTasIxModal({ value })}
										columns={[
											{
												title: t("ID"),
												dataIndex: "id",
												className: "w-4",
												render: value => value
											},
											{
												title: t("Диапазон"),
												dataIndex: "range",
												render: value => value
											},
											{
												title: t("Маска"),
												dataIndex: "mask",
												render: value => value
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
							) : (
								<Spinner position="center" />
							)}
						</>
					);
				}}
			</EntityContainer.All>
		</>
	);
};

export default List;
