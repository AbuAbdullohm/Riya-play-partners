import React from "react";
import EntityForm from "modules/entity/forms";
import { Typography } from "components";
import { useTranslation } from "react-i18next";
import Form from "./components/form";
import { useNotification } from "hooks";

const Create = ({ history }) => {
	const { t } = useTranslation();
	const { notification } = useNotification();
	return (
		<EntityForm.Default
			method="post"
			entity="promo-code"
			name={`promo-code`}
			url="/promo-code"
			prependData
			primaryKey="id"
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/promo-code`);
				notification("Успешно добавлено", {
					type: "success"
				});
			}}
			onError={error => {
				if (error.errorData) {
					notification(error.errorData.message, {
						type: "danger"
					});
				} else {
					notification("Что-то пошло не так", {
						type: "danger"
					});
				}
			}}
			fields={[
				{
					name: "title_uz",
					required: true
				},
				{
					name: "title_ru",
					required: true
				},
				{
					name: "type",
					value: 1,
					required: true
				},
				{
					name: "copy",
					value: 1,
					onSubmitValue: value => value * 1,
					required: true
				},
				{
					name: "users_count",
					value: null,
					onSubmitValue: value => (value ? value * 1 : null),
					required: false
				},
				{
					name: "code",
					required: true
				},
				{
					name: "expire_of",
					value: 1,
					required: true,
					onSubmitValue: value => value && value
				},
				{
					type: "string",
					name: "expire_at",
					onSubmitValue: value => (value ? value : null)
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Создать промокод")}
						</Typography.Heading>
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting }} />
					</>
				);
			}}
		</EntityForm.Default>
	);
};

export default Create;
