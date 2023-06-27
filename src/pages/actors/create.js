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
			entity="actors"
			name={`actors`}
			url="/actors"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/actors`);
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
					name: "bio_uz",
					value: ""
				},
				{
					name: "bio_ru",
					value: ""
				},
				{
					name: "instagram",
					value: ""
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
				},
				{
					name: "type",
					value: false,
					onSubmitValue: value => (value ? 1 : null)
				}
			]}
			params={{
				include: "translations, files"
			}}>
			{({ isSubmitting, values, setFieldValue, setErrors, errors }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Добавить актера")}
						</Typography.Heading>
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting, setErrors, errors }} />
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
