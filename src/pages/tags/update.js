import React from "react";
import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import { get } from "lodash";
import Form from "./components/form";

const Update = ({ selected, setUpdateModal }) => {
	const { notification } = useNotification();

	return (
		<>
			{selected && (
				<EntityForm.Main
					name="all"
					entity="tags"
					url={`/tags/${get(selected, "id")}`}
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
					}}
					onError={() => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
					}}
					fields={[
						{
							name: "title_uz",
							value: get(selected, "title_uz"),
							required: true
						},
						{
							name: "title_ru",
							value: get(selected, "title_ru"),
							required: true
						},
						{
							name: "status",
							value: get(selected, "status"),
							onSubmitValue: value => (value ? 1 : 0)
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
