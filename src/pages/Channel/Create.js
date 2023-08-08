import React from "react";
import EntityForm from "modules/entity/forms";
import { Typography } from "components";
import { useTranslation } from "react-i18next";
import Form from "./components/form";
import { useNotification } from "hooks";

const Create = ({ history }) => {
	const { t } = useTranslation();
	const { notification } = useNotification();

	return (
		<EntityForm.Main
			method="post"
			entity="channel"
			name={`channel`}
			url="/channel"
			version="v3"
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/channel`);
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
					value: "",
					required: true
				},
				{
					name: "logo_id",
					required: true,
					value: [],
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "stream",
					value: "",
					required: true
				},
				{
					name: "category_id",
					value: "",
					required: true
				},
				{
					name: "tags",
					value: [],
					required: true,
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], [])
				},
				{
					name: "paid",
					value: 0,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}>
			{({ isSubmitting, values, setFieldValue, setErrors, errors }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Добавить телеканал")}
						</Typography.Heading>
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting, setErrors, errors }} />
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
