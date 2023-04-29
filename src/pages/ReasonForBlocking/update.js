import React from "react";
import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import { get } from "lodash";
import Form from "./components/form";

const Update = ({ selected, setUpdateModal, onSuccess }) => {
	const { notification } = useNotification();

	return (
		<>
			{selected && (
				<EntityForm.Main
					name="reason-for-blocking"
					entity="reason-for-blocking"
					url={`/reason/${get(selected, "id")}`}
					method="put"
					primaryKey="id"
					updateData={true}
					normalizeData={data => data}
					id={get(selected, "id")}
					onSuccess={(data, resetForm) => {
						resetForm();
						setUpdateModal(false);
						notification("Успешно добавлено", {
							type: "success"
						});
						onSuccess(data);
					}}
					onError={() => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
					}}
					fields={[
						{
							name: "title_uz",
							value: get(selected, "title_uz")
						},
						{
							name: "title_ru",
							value: get(selected, "title_ru")
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
