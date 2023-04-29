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
			entity="banners"
			name={`banners`}
			url="/banners"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			fields={[
				{
					name: "title",
					required: true
				},
				{
					name: "link",
					value: ""
				},
				{
					name: "type",
					required: true,
					value: 1
				},
				{
					name: "file_id",
					value: [],
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "film_id",
					type: "object",
					onSubmitValue: field => (field ? field.id : null)
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				},

				{
					name: "expected_view_count",
					type: "number",
					onSubmitValue: value => Number(value)
				},
				{
					name: "view_type",
					value: 1
				},
				// {
				// 	name: "start_date",
				// 	type: "string"
				// },
				{
					name: "end_date",
					type: "string"
				}
			]}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/banners?lang=${lang}`);
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
				extra: {
					_l: lang
				},
				include: "categories,translations,files,film"
			}}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Создать баннер")}
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
