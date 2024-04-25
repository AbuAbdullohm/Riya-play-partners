import React, { useState } from "react";
import { useSelector } from "react-redux";
import EntityForm from "modules/entity/forms";
import { Typography } from "components";
import Form from "./components/form";
import { useTranslation } from "react-i18next";
import { useNotification } from "hooks";
import { get } from "lodash";

const Create = ({ history }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const userId = useSelector(state => get(state, "auth.data.id"));
	const [dataRequired, setDataRequired] = useState({});
	const [notificationType, setNotificationType] = useState(1);

	return (
		<EntityForm.Main
			method="post"
			entity="notifications"
			name={`notifications`}
			url="/notifications"
			prependData
			version="v2"
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/notifications`);
				notification("Успешно добавлено", {
					type: "success"
				});
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			params={{
				include: "translations,image"
			}}
			fields={[
				{
					name: "title",
					required: notificationType === 1
				},
				{
					name: "notification_type",
					value: 1,
					required: true
				},
				{
					name: "type",
					value: 4,
					onSubmitValue: value => Number(value),
					required: false
				},
				{
					name: "message",
					required: notificationType === 2
				},
				{
					name: "filter",
					value: {
						user_category: "",
						phone: userId,
						phone: "",
						fullname: "",
						gender: "",
						subscribe_type: "",
						device_count: "",
						account_status: "",
						ban_status: "",
						subscription_ids: "",
						subscription_start_at: "",
						subscription_end_at: "",
						promocode_ids: "",
						promocode_activation_date: [],
						promocode_end_date: [],
						user_register_at: [],
						user_last_action_at: []
					},
					onSubmitValue: filter => {
						return {
							...filter,
							user_id: get(filter, "user_id.id"),
							phone: get(filter, "phone.phone"),
							fullname: get(filter, "fullname.fullname"),
							subscription_ids: [get(filter, "subscription_ids.id")].filter(i => i),
							promocode_ids: [get(filter, "promocode_ids.id")].filter(i => i)
						};
					}
				},
				{
					name: "subscription_start_at"
				},
				{
					name: "promocode_activation_date"
				},
				{
					name: "user_register_at"
				},
				{
					name: "user_last_action_at"
				},
				{
					name: "image_id",
					value: [],
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "content",
					required: notificationType === 1
				},
				{
					name: "model_id",
					// disabled: dataRequired.type === 3 || dataRequired.type === 4,
					type: "object",
					required: dataRequired.type === 2 || dataRequired.type === 1,
					onSubmitValue: value => (value ? get(value, "id") : null)
				},
				// {
				// 	name: "balance_filter",
				// 	type: "string",
				// 	disabled: dataRequired.type === 1,
				// 	required: dataRequired.type === 4 ? true : false,
				// 	onSubmitValue: value => value && value
				// },
				{
					name: "date",
					type: "string",

					disabled: dataRequired.type === 1,
					onSubmitValue: value => value && value
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}>
			{({ isSubmitting, values, setFieldValue, handleSubmit, errors }) => {
				setDataRequired(values);
				console.log(values);

				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Создать уведомление")}
						</Typography.Heading>
						<Form
							{...{
								values,
								notificationType,
								setNotificationType,
								setFieldValue,
								isSubmitting,
								handleSubmit
							}}
						/>
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
