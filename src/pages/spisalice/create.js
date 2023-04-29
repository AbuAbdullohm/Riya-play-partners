import React from "react";
import EntityForm from "modules/entity/forms";
import Form from "./components/form";
import { useNotification } from "hooks";
import { get } from "lodash";
import { Spinner, Typography } from "components";

const Create = ({ history }) => {
	const { notification } = useNotification();

	return (
		<EntityForm.Main
			method="post"
			entity="user"
			name="user"
			url="/user"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			version="v2"
			onSuccess={(data, resetForm) => {
				resetForm();
				notification("Успешно обновлено", {
					type: "success"
				});
				history.push(`/spisalice`);
			}}
			onError={error => {
				let message = get(error, "message");

				let errorPhone = get(error, "phone");

				if (errorPhone) {
					notification(errorPhone, {
						type: "danger"
					});
				} else
					notification(message, {
						type: "danger"
					});
			}}
			params={{
				include: "organization"
			}}
			fields={[
				{
					name: "username",
					required: true
				},
				{
					name: "password",
					required: true
				},
				{
					name: "full_name",
					required: true
				},
				{
					name: "phone",
					min: 12,
					required: true,
					onSubmitValue: value => value && value
				},
				{
					name: "email",
					required: true,
					onSubmitValue: value => value && value
				},

				{
					name: "photo",
					value: [],
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "status",
					required: true,
					onSubmitValue: value => (value ? 10 : 1)
				},
				{
					name: "role",
					required: true,
					value: "admin"
				},

				{
					name: "is_provider",
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "organization_id",
					onSubmitValue: value => (value ? value.id : null)
				}
			]}>
			{({ values, setFieldValue, isSubmitting }) => {
				return (
					<>
						{isSubmitting && (
							<div className="spinner-overlay">
								<Spinner tips="Загрузка..." />
							</div>
						)}
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							Создать пользователей
						</Typography.Heading>
						<Form
							{...{
								values,
								setFieldValue,
								isSubmitting
							}}
						/>
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
