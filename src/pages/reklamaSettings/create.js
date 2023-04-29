import React from "react";

import EntityForm from "modules/entity/forms";
import { Typography } from "components";
import Form from "./components/form";

import { useTranslation } from "react-i18next";
import { useNotification } from "hooks";
import qs from "query-string";

const Create = ({ history, location }) => {
	const { t } = useTranslation();

	const query = qs.parse(location.search);
	const { lang } = query;

	const { notification } = useNotification();
	return (
		<EntityForm.Main
			method="post"
			entity="ads"
			name={`ads`}
			url="/ads"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			fields={[
				{
					name: "type",
					required: true,
					onSubmitValue: value => value && value
				},
				{
					name: "advertising",
					type: "array",
					onSubmitValue: value => (value ? value.reduce((prev, curr) => [...prev, curr.id], []) : "")
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/reklamaSettings`);
				notification("Успешно добавлено", {
					type: "success"
				});
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			params={{}}>
			{({ isSubmitting, values, setFieldValue, errors }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Создание рекламы")}
						</Typography.Heading>
						<Form
							{...{
								isFetched: true,
								values,
								setFieldValue,
								isSubmitting
							}}
							lang={lang}
						/>
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
