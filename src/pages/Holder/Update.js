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
			entity="holder"
			name={`holder-${id}`}
			url={`/holder/${id}`}
			primaryKey="id"
			id={id}
			version="v3"
			params={{
				include: "logo"
			}}>
			{({ item, isFetched }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить правообладатель")}
						</Typography.Heading>
						<EntityForm.Main
							method={"put"}
							entity="holder"
							name={`holder`}
							url={`/holder/${get(item, "id")}`}
							updateData={true}
							primaryKey="id"
							version="v3"
							normalizeData={data => data}
							onSuccess={(data, resetForm) => {
								resetForm();
								notification("Успешно обновлено", {
									type: "success"
								});
								history.push(`/holder${location.search}`);
							}}
							onError={() => {
								notification("Что-то пошло не так", {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "title_uz",
									required: true,
									value: get(item, "title_uz")
								},
								{
									name: "title_ru",
									required: true,
									value: get(item, "title_ru")
								},
								{
									name: "title_en",
									required: true,
									value: get(item, "title_en")
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
									name: "logo_id",
									required: true,
									value: get(item, "logo") ? [get(item, "logo", [])] : [],
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
