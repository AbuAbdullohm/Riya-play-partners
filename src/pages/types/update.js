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
			entity="types"
			name={`types-${id}`}
			url={`/types/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "files"
			}}>
			{({ item, isFetched }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10">
							{t("Изменить тип")}
						</Typography.Heading>
						<EntityForm.Main
							method={"put"}
							entity="types"
							name={`types`}
							url={`/types/${get(item, "id")}`}
							updateData={true}
							primaryKey="id"
							normalizeData={data => data}
							onSuccess={(data, resetForm) => {
								resetForm();
								notification("Успешно обновлено", {
									type: "success"
								});
								history.push(`/types${location.search}`);
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
									name: "sort",
									value: get(item, "sort")
								},
								{
									name: "has_season",
									value: !!get(item, "has_season", 0),
									type: "boolean",
									onSubmitValue: value => (value ? 1 : 0)
								},
								{
									name: "status",
									value: !!get(item, "status"),
									type: "boolean",
									onSubmitValue: value => (value ? 1 : 0)
								}
							]}>
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
