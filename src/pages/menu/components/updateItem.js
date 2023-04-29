import React from "react";
import { get } from "lodash";

import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import Form from "./formItem";

const Update = ({ menuId, selected, setUpdateModal, setCanUpdate, canUpdate }) => {
	const { notification } = useNotification();
	return (
		<>
			{selected && (
				<EntityForm.Main
					method="put"
					entity="menuItems"
					name={`menuItems-${menuId}`}
					url={`/menu-items/${selected.menu_item_id}`}
					primaryKey="menu_item_id"
					updateData={true}
					normalizeData={data => data}
					id={get(selected, "menu_item_id")}
					onSuccess={(data, resetForm) => {
						resetForm();
						setUpdateModal(false);
						notification("Успешно обновлено", {
							type: "success"
						});
						setCanUpdate(!canUpdate);
					}}
					onError={() => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
					}}
					fields={[
						{
							name: "title",
							value: get(selected, "title")
						},
						{
							name: "icon",
							type: "array",
							required: "true",
							value: get(selected, "files", []),
							onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
						},
						{
							name: "url",
							required: true,
							value: get(selected, "url")
						}
					]}>
					{({ isSubmitting, values, setFieldValue }) => {
						return (
							<>
								<Form
									{...{
										isUpdate: true,
										values,
										isSubmitting,
										setFieldValue,
										setUpdateModal
									}}
								/>
							</>
						);
					}}
				</EntityForm.Main>
			)}
		</>
	);
};

export default Update;
