import React from "react";

import EntityForm from "modules/entity/forms";
import { Typography } from "../../components";
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
			entity="pages"
			name={`pages-${lang}`}
			url="/pages"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/pages?lang=${lang}`);
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
					name: "title",
					required: true
				},
				{
					name: "slug",
					onSubmitValue: value => (value ? value : null)
				},
				{
					name: "description",
					value: ""
				},
				{
					name: "photo",
					value: [],
					onSubmitValue: value =>
						value.length ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : ""
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}
			params={{
				extra: { _l: lang },
				include: "files,description"
			}}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Создать страницу")}
						</Typography.Heading>
						<Form
							{...{
								isFetched: true,
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
