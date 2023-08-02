import React from "react";
import * as yup from "yup";

import EntityForm from "modules/entity/forms";
import { Typography } from "components";
import Form from "./components/form";
import { useTranslation } from "react-i18next";
import { useNotification } from "hooks";

const Create = ({ history }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();

	return (
		<EntityForm.Main
			method="post"
			entity="rates"
			name={`rates`}
			url="/rates"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/rates`);
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
				include: "translations,files"
			}}
			fields={[
				{
					name: "logo",
					required: true,
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "sort",
					required: false,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "name_uz",
					required: true
				},
				{
					name: "description_uz",
					value: "",
					required: true
				},
				{
					name: "name_ru",
					required: true
				},
				{
					name: "description_ru",
					value: "",
					required: true
				},
				{
					name: "holders",
					required: true,
					type: "array",
					onSubmitValue: value => (value ? value.map(v => v.id) : null)
				},
				{
					name: "is_foreign",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "ratesPrices",
					required: true,
					type: "array",
					value: [
						{
							days: 0,
							price: 0,
							device_count: 0,
							top: 0
						}
					],
					onSubmitValue: values =>
						values.map(value => ({
							days: value.days,
							price: value.price,
							device_count: value.device_count,
							top: value.top ? 1 : 0
						})),

					lazy: (validator, yup) =>
						validator.of(
							yup.object().shape({
								days: yup.string().required("Обязательное поле"),
								price: yup.string().required("Обязательное поле"),
								device_count: yup.string().required("Обязательное поле")
							})
						)
				}
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Создать тариф")}
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
