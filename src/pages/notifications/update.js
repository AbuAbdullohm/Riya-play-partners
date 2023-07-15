import React, { useState } from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Typography } from "components";
import Form from "./components/form";
import { useNotification } from "hooks";
import { get } from "lodash";
import { useTranslation } from "react-i18next";

const Update = ({ location, history, match }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const [dataRequired, setDataRequired] = useState(false);
	const { notification_id } = match.params;

	return (
		<EntityContainer.One
			entity="notifications"
			name={`notifications`}
			url={`/notifications/${notification_id}`}
			primaryKey="notification_id"
			version="v2"
			id={notification_id}
			params={{
				include: "translations,model,image"
			}}>
			{({ item, isFetched }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить уведомление")}
						</Typography.Heading>

						<EntityForm.Main
							method={"put"}
							entity="notifications"
							name={`notifications`}
							url={`/notifications/${get(item, "notification_id")}`}
							primaryKey="notification_id"
							normalizeData={data => data}
							version="v2"
							id={notification_id}
							onSuccess={() => {
								notification("Успешно обновлено", {
									type: "success"
								});
								history.goBack();
							}}
							onError={() => {
								notification("Что-то пошло не так", {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "title",
									value: get(item, "title"),
									required: true
								},
								{
									name: "message",
									value: get(item, "message"),
									required: true
								},
								{
									name: "type",
									value: get(item, "type"),
									onSubmitValue: value => Number(value),
									required: false
								},
								{
									name: "image_id",
									required: true,
									value: get(item, "image") ? [get(item, "image", [])] : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "model_id",
									type: dataRequired.type === 4 || dataRequired.type === 3 ? "string" : false,
									value: get(item, "model"),
									onSubmitValue: value => value && value.id
								},
								{
									name: "balance_filter",
									type: "string",
									value: get(item, "balance_filter") && get(item, "balance_filter"),
									required: dataRequired.type === 4 ? true : false,
									onSubmitValue: value => value && value
								},
								{
									name: "date",
									type: "string",
									// required: true,
									value: get(item, "date") && get(item, "date"),
									onSubmitValue: value => value && value
								},
								{
									name: "status",
									value: get(item, "status"),
									onSubmitValue: value => (value ? 1 : 0)
								}
							]}
							params={{
								include: "translations,model,image"
							}}>
							{({ isSubmitting, values, setFieldValue, errors }) => {
								setDataRequired(values);
								return (
									<>
										<Form
											{...{
												values,
												setFieldValue,
												isSubmitting,
												isUpdate: true
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
