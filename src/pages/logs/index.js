import React, { useState } from "react";

import { Table, Pagination, Modal, Header, Icon } from "components";
import EntityContainer from "modules/entity/containers";
import Filter from "./components/filter";

import { useTranslation } from "react-i18next";
import { get, truncate } from "lodash";
import qs from "query-string";

import { helpers } from "services";

import Create from "./create";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const { t } = useTranslation();

	const [updateModal, setUpdateModal] = useState(false);

	const { page, pageLimit } = params;

	const [filter, setFilter] = useState(false);
	const [selected, setSelected] = useState();
	const onEdit = selected => {
		setSelected(selected);
		setUpdateModal(true);
	};

	const onChange = page => {
		const search = { ...params, page: page + 1 };

		history.push({
			search: qs.stringify(search)
		});
	};

	return (
		<>
			<Modal.Default header="Изменить" toggle={updateModal} setToggle={setUpdateModal}>
				<Create {...{ selected, setUpdateModal }} />
			</Modal.Default>
			<EntityContainer.All
				entity="log"
				name={`log`}
				url="/log"
				primaryKey="id"
				params={{
					sort: "-id",
					include: "user",
					limit: pageLimit ? pageLimit : 50,
					page: page ? page : 1
				}}>
				{({ items, isFetched, meta }) => {
					return (
						<>
							<Header title="Логи" hasButton={false} meta={meta} filter={filter} setFilter={setFilter} hasFilter={false}>
								<Filter />
							</Header>

							<Table
								items={items}
								isFetched={isFetched}
								rowKey="id"
								className="mt-5"
								hasEdit={true}
								editAction={value => onEdit(value)}
								editIcon={<Icon name="eye" className="w-5 h-5 mr-1" />}
								emptyUiText="Список пусто"
								columns={[
									{
										title: t("ID"),
										dataIndex: "id",
										className: "w-4 text-center",
										render: value => <>{value}</>
									},
									{
										title: t("Имя пользователя"),
										dataIndex: "user",
										render: value => <>{value ? value.username : ""}</>
									},
									{
										title: t("Роль"),
										dataIndex: "user",
										render: value => <>{value ? value.role : ""}</>
									},
									{
										title: t("IP"),
										dataIndex: "text",
										render: value => <>{value}</>
									},

									{
										title: t("Дата"),
										dataIndex: "created_at",
										className: "w-14",
										render: value => <>{helpers.formatDate(value * 1000, "DD.MM.YYYY / HH:mm:ss")}</>
									},
									{
										title: t("Страницы"),
										dataIndex: "modelName",
										render: value => <>{truncate(value, { length: "80", separator: "" })}</>
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
