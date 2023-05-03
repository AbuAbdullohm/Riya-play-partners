import React from "react";

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
					name: "sort",
					required: false
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
					name: "price",
					onSubmitValue: value => Number(value),
					required: true
				},
				{
					name: "days",
					onSubmitValue: value => Number(value),
					required: true
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