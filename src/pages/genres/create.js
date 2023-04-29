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
			entity="genres"
			name={`genres`}
			url="/genres"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/genres`);
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
					name: "file_id",
					type: "object",
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "type_id",
					required: true
				},
				{
					name: "sort"
				},
				{
					name: "icon_id",
					type: "object",
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "status",
					value: true,
					type: "boolean",
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10">
							{t("Создать жанр")}
						</Typography.Heading>
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting }} />
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
