import React from "react";

import EntityForm from "modules/entity/forms";
import { Typography } from "components";
import Form from "./components/form";

import { useTranslation } from "react-i18next";
import { useNotification } from "hooks";
import qs from "query-string";
import moment from "moment";

const Create = ({ history, location }) => {
	const { t } = useTranslation();

	const query = qs.parse(location.search);
	const { lang } = query;

	const { notification } = useNotification();
	return (
		<EntityForm.Main
			method="post"
			entity="posts"
			name={`posts`}
			url="/posts"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/posts?lang=${lang}`);
				notification("Успешно обновлено", {
					type: "success"
				});
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			params={{
				extra: { _l: lang },
				include: "categories,translations,files,description"
			}}
			fields={[
				{
					name: "title",
					required: true,
					onSubmitValue: value => value
				},
				{
					name: "description",
					required: true,
					max: 500,
					onSubmitValue: value => value
				},
				{
					name: "content",
					value: "",
					onSubmitValue: value => value
				},
				{
					name: "top"
				},
				{
					name: "category_id",
					required: true,
					onSubmitValue: value => value && value.id
				},
				{
					name: "publish_time",
					onSubmitValue: value => (!!value ? moment(value).unix() : ""),
					value: moment(),
					required: true
				},
				{
					name: "photo",
					value: [],
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
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
						<Typography.Heading type={5} className="intro-y mt-10">
							{t("Создать новость")}
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
