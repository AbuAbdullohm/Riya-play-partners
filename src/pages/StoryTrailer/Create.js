import React from "react";
import EntityForm from "modules/entity/forms";
import { Typography } from "components";
import { useTranslation } from "react-i18next";
import Form from "./components/form";
import { useNotification } from "hooks";
import { get } from "lodash";

const Create = ({ history }) => {
	const { t } = useTranslation();
	const { notification } = useNotification();

	return (
		<EntityForm.Main
			method="post"
			entity="story-trailer"
			name={`story-trailer`}
			url="/story-trailer"
			version="v3"
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/story-trailer`);
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
					required: true
				},
				{
					name: "description_uz",
					required: true
				},
				{
					name: "description_ru",
					required: true
				},
				{
					name: "description_en",
					required: true
				},
				{
					name: "poster_id",
					value: [],
					required: true,
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "video_id",
					value: [],
					required: true,
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
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
							{t("Добавить трейлер историй")}
						</Typography.Heading>
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting, setErrors, errors }} />
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
