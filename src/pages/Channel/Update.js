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
			entity="channel"
			name={`channel-${id}`}
			url={`/channel/${id}`}
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
							{t("Изменить телеканал")}
						</Typography.Heading>
						<EntityForm.Main
							method={"put"}
							entity="channel"
							name={`channel`}
							url={`/channel/${get(item, "id")}`}
							updateData={true}
							primaryKey="id"
							version="v3"
							normalizeData={data => data}
							onSuccess={(data, resetForm) => {
								resetForm();
								notification("Успешно обновлено", {
									type: "success"
								});
								history.push(`/channel${location.search}`);
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
									name: "logo_id",
									required: true,
									value: get(item, "logo") ? [get(item, "logo", [])] : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "stream",
									required: true,
									value: get(item, "stream")
								},
								{
									name: "category_id",
									required: true,
									value: get(item, "category_id")
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
