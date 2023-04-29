import React from "react";
import EntityForm from "modules/entity/forms";
import Form from "./components/form";
import { useNotification } from "hooks";
import { get } from "lodash";
import { Spinner, Typography } from "../../components";

const Create = ({ history }) => {
	const { notification } = useNotification();

	return (
		<EntityForm.Main
			method="post"
			entity="user"
			name="user"
			url="/user"
			version="v2"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				notification("Успешно обновлено", {
					type: "success"
				});
				history.push(`/foreign-user`);
			}}
			onError={error => {
				let message = get(error, "message");
				let messagePhone = get(error, "phone");

				messagePhone
					? notification(messagePhone, {
							type: "danger"
					  })
					: notification(message, {
							type: "danger"
					  });
			}}
			params={{}}
			fields={[
				{
					name: "username",
					required: true
				},
				{
					name: "password",
					min: 4,
					max: 4,
					required: true,
					onSubmitValue: value => value && value
				},
				{
					name: "full_name",
					required: true
				},
				{
					name: "foreign_user",
					value: 1
				},
				{
					name: "phone",
					required: true,
					min: 12
				},
				{
					name: "photo",
					value: [],
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "status",
					value: 1,
					onSubmitValue: value => (value ? 10 : 1)
				},
				{
					name: "role",
					value: "user"
				}
			]}>
			{({ values, setFieldValue, isSubmitting, errors }) => {
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
