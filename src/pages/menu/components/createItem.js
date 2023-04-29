import React from "react";
import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import Form from "./formItem";

const Create = ({ setCreateModal, menuId, setCanUpdate, canUpdate }) => {
	const { notification } = useNotification();
	return (
		<EntityForm.Main
			method="post"
			entity="menuItems"
			name={`menuItems-${menuId}`}
			url="/menu-items"
			prependData={true}
			primaryKey="menu_item_id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				setCanUpdate(!canUpdate);
				resetForm();
				setCreateModal(false);
				notification("Успешно добавлено", {
					type: "success"
				});
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			fields={[
				{
					name: "title",
					required: true
				},
				{
					name: "icon",
					value: [],
					required: "true",
					type: "object",
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "url",
					required: true
				},
				{
					name: "menu_item_id",
					value: Number(menuId)
				},
				{
					name: "menu_id",
					value: Number(menuId)
				}
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<>
						<Form
							{...{
								isFetched: true,
								values,
								isSubmitting,
								setFieldValue,
								setCreateModal
							}}
						/>
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
