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
				include: "translations"
			}}
			fields={[
				{
					name: "title",
					required: true
				},
				{
					name: "message",
					required: true
				},
				{
					name: "user_id",
					value: userId,
					required: false
				},
				{
					name: "type",
					value: 3,
					onSubmitValue: value => Number(value),
					required: false
				},
				{
					name: "model_id",
					// disabled: dataRequired.type === 3 || dataRequired.type === 4,
					type: "object",
					required: dataRequired.type === 2 || dataRequired.type === 1,
					onSubmitValue: value => (value ? get(value, "id") : null)
				},
				{
					name: "balance_filter",
					type: "string",
					disabled: dataRequired.type === 1,
					required: dataRequired.type === 4 ? true : false,
					onSubmitValue: value => value && value
				},
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
			{({ isSubmitting, values, setFieldValue, errors }) => {
				setDataRequired(values);

				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Создать уведомление")}
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
