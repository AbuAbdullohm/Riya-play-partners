import React from "react";
import EntityForm from "modules/entity/forms";
import { Typography } from "components";
import { useTranslation } from "react-i18next";
import Form from "./components/form";
import { useNotification } from "hooks";

const Create = ({ history, location }) => {
	const { t } = useTranslation();
	const { notification } = useNotification();

	return (
		<EntityForm.Main
			method="post"
			entity="payment-method"
			name={`payment-method`}
			url="/payment-method"
			version="v3"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/payment-method`);
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
					name: "name_uz",
					required: true
				},
				{
					name: "name_ru",
					required: true
				},
				{
					name: "name_en",
					required: true
				},

				{
					name: "description_uz",
					required: true
				},

				{
					name: "description_ru",
					required: true
				},

				{
					name: "description_en",
					required: true
				},
				{
					name: "logo_id",
					required: true,
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "is_redirectable",
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "status",
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}
			params={{
				include: "files"
			}}>
			{({ isSubmitting, values, setFieldValue, setFieldTouched, validateForm }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Создать способ оплата")}
						</Typography.Heading>
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting, setFieldTouched, validateForm }} />
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
