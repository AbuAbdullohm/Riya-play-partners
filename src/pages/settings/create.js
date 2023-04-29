import React from "react";
import qs from "query-string";
import { useTranslation } from "react-i18next";
import EntityForm from "modules/entity/forms";
import { Typography } from "components";
import Form from "./components/form";
import { useNotification } from "hooks";

const Create = ({ history, location }) => {
	const { t } = useTranslation();
	const { notification } = useNotification();
	const query = qs.parse(location.search);
	const { lang } = query;

	return (
		<EntityForm.Main
			method="post"
			entity="settings"
			name="settings"
			url="/settings"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/settings?lang=${lang}`);
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
				extra: { _l: lang }
			}}
			fields={[
				{
					name: "name",
					required: true
				},
				{
					name: "value",
					value: ""
				},
				{
					name: "link",
					value: ""
				},
				{
					name: "slug",
					value: "",
					onSubmitValue: value => (value ? value : null)
				},
				{
					name: "alias",
					onSubmitValue: value => (value ? value : null)
				},
				{
					name: "photo",
					value: [],
					onSubmitValue: value => (value.length ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : "")
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
							{t("Создать настройку")}
						</Typography.Heading>
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting, lang: { lang } }} />
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
