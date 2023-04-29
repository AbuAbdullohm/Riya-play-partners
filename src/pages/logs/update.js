import React from "react";
import { get } from "lodash";

import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import Form from "./components/form";

const Update = ({ selected, setUpdateModal }) => {
	const { notification } = useNotification();
	return (
		<>
			{selected && (
				<EntityForm.Main
					method="put"
					entity="log"
					name="all"
					url={`/log/${get(selected, "id")}`}
					primaryKey="id"
					updateData={true}
					normalizeData={data => data}
					id={get(selected, "id")}
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
						{
							name: "data",
							value: JSON.stringify(get(selected, "data", "")),
							required: true
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
