import React from "react";

import EntityForm from "modules/entity/forms";
import { Typography } from "components";
import Form from "./components/form";
import "./style.scss";
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
			entity="adsTrack"
			name={`adsTrack`}
			url="/ads-track"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			fields={[
				{
					name: "name",
					required: true
				},
				{
					name: "link",
					value: "",
					required: true
				},
				{
					name: "video_id",
					value: [],
					required: true,
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "second",
					onSubmitValue: value => Number(value),
					required: true
				},
				{
					name: "expected_view_count",
					type: "number",
					onSubmitValue: value => Number(value)
				},
				{
					name: "view_type",
					required: true,
					value: 1
				},
				{
					name: "start_date",
					type: "string",
					onSubmitValue: value => value && value
				},
				{
					name: "end_date",
					type: "string",
					onSubmitValue: value => value && value
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/reklama`);
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
				}
			}}>
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
