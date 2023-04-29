import React from "react";
import { get } from "lodash";

import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import Form from "./components/form";

const Update = ({ selected, setUpdateModal, tabLang }) => {
	const { notification } = useNotification();
	return (
		<>
			{selected && (
				<EntityForm.Main
					method="put"
					entity="menu"
					name={`all`}
					url={`/menu/${get(selected, "id")}`}
					primaryKey="menu_id"
					updateData={true}
					normalizeData={data => data}
					id={get(selected, "menu_id")}
					onSuccess={(data, resetForm) => {
						resetForm();
						setUpdateModal(false);
						notification("Успешно обновлено", {
							type: "success"
						});
					}}
					onError={() => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
					}}
					fields={[
						{ name: "title", value: get(selected, "title"), required: true },
						{ name: "alias", value: get(selected, "alias"), required: true }
					]}
					params={{
						extra: { _l: tabLang }
					}}>
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
