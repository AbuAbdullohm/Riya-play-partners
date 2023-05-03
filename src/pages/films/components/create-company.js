import React from "react";
import EntityForm from "modules/entity/forms";
import Form from "./create-company-form";
import { useNotification } from "hooks";

const CreateCompany = ({ setModal }) => {
	const { notification } = useNotification();
	return (
		<EntityForm.Main
			method="post"
			entity="company"
			name="company"
			url="/company"
			version="v1"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				setModal(false);
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
					name: "slug",
					required: true
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}>
			{({ isSubmitting, values, setFieldValue, handleSubmit }) => {
				return (
					<>
						<Form
							{...{
								isFetched: true,
								values,
								handleSubmit,
								isSubmitting,
								setFieldValue,
								setModal
							}}
						/>
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default CreateCompany;
