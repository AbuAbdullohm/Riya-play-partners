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
			entity="genres"
			name={`genres-${id}`}
			url={`/genres/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "photo,icon,types,type"
			}}>
			{({ item, isFetched }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10">
							{t("Изменить Жанры")}
						</Typography.Heading>
						<EntityForm.Main
							method={"put"}
							entity="genres"
							name={`genres`}
							url={`/genres/${get(item, "id")}`}
							updateData={true}
							primaryKey="id"
							normalizeData={data => data}
							onSuccess={(data, resetForm) => {
								resetForm();
								notification("Успешно обновлено", {
									type: "success"
								});
								history.push(`/genres${location.search}`);
							}}
							onError={() => {
								notification("Что-то пошло не так", {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "name_uz",
									value: get(item, "name_uz"),
									required: true
								},
								{
									name: "name_ru",
									value: get(item, "name_ru"),
									required: true
								},
								{
									name: "file_id",
									value: get(item, "photo") ? [get(item, "photo")] : "",
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "sort",
									value: get(item, "sort")
								},
								{
									name: "type_id",
									value: get(item, "type_id"),
									required: true
								},
								{
									name: "icon_id",
									value: get(item, "icon") ? [get(item, "icon")] : "",
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "status",
									value: !!get(item, "status"),
									type: "boolean",
									onSubmitValue: value => (value ? 1 : 0)
								}
							]}
							params={{
								include: "photo,icon"
							}}>
							{({ isSubmitting, values, setFieldValue }) => {
								return (
									<Form
										{...{
											isFetched,
											values,
											setFieldValue,
											isSubmitting,
											isUpdate: true
										}}
									/>
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
