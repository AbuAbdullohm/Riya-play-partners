import React from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Typography } from "components";
import { useNotification } from "hooks";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import Form from "./components/form";

const Update = ({ location, history, match }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const { id } = match.params;

	return (
		<EntityContainer.One
			entity="story-trailer"
			name={`story-trailer-${id}`}
			url={`/story-trailer/${id}`}
			primaryKey="id"
			id={id}
			version="v3"
			params={{
				include: "poster,video"
			}}>
			{({ item, isFetched }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить трейлер историй")}
						</Typography.Heading>
						<EntityForm.Main
							method={"put"}
							entity="story-trailer"
							name={`story-trailer`}
							url={`/story-trailer/${get(item, "id")}`}
							updateData={true}
							primaryKey="id"
							version="v3"
							normalizeData={data => data}
							onSuccess={(data, resetForm) => {
								resetForm();
								notification("Успешно обновлено", {
									type: "success"
								});
								history.push(`/story-trailer${location.search}`);
							}}
							onError={() => {
								notification("Что-то пошло не так", {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "name_uz",
									required: true,
									value: get(item, "name_uz")
								},
								{
									name: "name_ru",
									required: true,
									value: get(item, "name_ru")
								},
								{
									name: "name_en",
									required: true,
									value: get(item, "name_en")
								},
								{
									name: "description_uz",
									required: true,
									value: get(item, "description_uz")
								},
								{
									name: "description_ru",
									required: true,
									value: get(item, "description_ru")
								},
								{
									name: "description_en",
									required: true,
									value: get(item, "description_en")
								},
								{
									name: "poster_id",
									required: true,
									value: get(item, "poster") ? [get(item, "poster", [])] : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "video_id",
									required: true,
									value: get(item, "video") ? [get(item, "video", [])] : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "status",
									value: get(item, "status") === 1,
									onSubmitValue: value => (value ? 1 : 0)
								}
							]}>
							{({ isSubmitting, values, setFieldValue, setErrors, errors }) => {
								return (
									<>
										<Form
											{...{
												isFetched,
												values,
												setFieldValue,
												isSubmitting,
												isUpdate: true,
												setErrors,
												errors
											}}
										/>
									</>
								);
							}}
						</EntityForm.Main>
					</>
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
