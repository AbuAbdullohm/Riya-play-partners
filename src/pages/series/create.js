import React from "react";
import EntityForm from "modules/entity/forms";
import { Typography } from "components";
import { useTranslation } from "react-i18next";
import Form from "./components/form";
import { useNotification } from "hooks";
import { get } from "lodash";

const Create = ({ history, location }) => {
	const { t } = useTranslation();
	const { notification } = useNotification();

	return (
		<EntityForm.Main
			method="post"
			entity="series"
			name={`series`}
			url="/series"
			version="v2"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/series`);
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
					name: "tracks",
					required: true,
					type: "array",
					onSubmitValue: value =>
						value.reduce(
							(prev, curr) => [
								...prev,
								{
									name: get(curr, "name"),
									name_select: get(curr, "name_select"),
									path: get(curr, "path")
								}
							],
							[]
						)
				},

				{
					name: "sort",
					required: false,
					onSubmitValue: field => Number(field)
				},
				{
					name: "photo",
					value: [],
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "film_id",
					required: true,
					onSubmitValue: field => (field ? field.id : null)
				},
				{
					name: "season_id",
					required: false,
					type: "object",
					onSubmitValue: field => (field ? field.id : null)
				},
				{
					name: "sort",
					required: false
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}
			params={{
				include: "translations,files,tracks"
			}}>
			{({ isSubmitting, values, setFieldValue, setFieldTouched, validateForm }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Создать серию")}
						</Typography.Heading>
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting, setFieldTouched, validateForm }} />
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
