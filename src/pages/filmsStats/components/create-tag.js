import React from "react";
import EntityForm from "modules/entity/forms";
import Form from "./create-tag-form";
import { useNotification } from "hooks";

const CreateTag = ({ setCreateModal }) => {
	const { notification } = useNotification();
	return (
		<EntityForm.Main
			method="post"
			entity="tags"
			name="tags"
			url="/tags"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
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
					name: "title_ru",
					required: true
				},
				{
					name: "title_uz",
					required: true
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => value ? 1 : 0
				},

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
								setCreateModal
							}}
						/>
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default CreateTag;