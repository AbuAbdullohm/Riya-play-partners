import React from "react";
import EntityForm from "modules/entity/forms";
import { Typography, Grid } from "components";
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
					name: "rates_id",
					required: true,
					type: "array",
					onSubmitValue: value => (value ? value.map(v => v.id) : null)
				},
				{
					name: "expire_at",
					type: "number",
					required: true,
					onSubmitValue: value => (value ? value : null)
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "start_at",
					type: "number",
					onSubmitValue: value => (value[0] ? value[0] : null)
				},
				{
					name: "end_at",
					type: "number",
					onSubmitValue: value => (value[1] ? value[1] : null)
				}
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							<Grid.Row>
								<Grid.Column xs={12} xl={8}>
									{t("Создать промокод")}
								</Grid.Column>
								<Grid.Column xs={12} xl={4}>
									<h1>Сортировка группы пользователей</h1>
								</Grid.Column>
							</Grid.Row>
						</Typography.Heading>
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting }} />
					</>
				);
			}}
		</EntityForm.Default>
	);
};

export default Create;
