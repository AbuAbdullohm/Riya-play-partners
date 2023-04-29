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
			entity="types"
			name={`types`}
			url="/types"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/types`);
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
					name: "sort"
				},
				{
					name: "has_season",
					value: 0,
					type: "boolean",
					onSubmitValue: value => (value ? 1 : 0)
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
							{t("Создать тип")}
						</Typography.Heading>
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting }} />
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
