import React from "react";
import EntityForm from "modules/entity/forms";
import { Typography } from "components";
import Form from "./components/form";
import { useTranslation } from "react-i18next";
import { useNotification } from "hooks";

const Create = ({ history }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();

	return (
		<EntityForm.Main
			method="post"
			entity="versions"
			name={`versions`}
			url="/versions"
			version="v2"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/version`);
				notification("Успешно добавлено", {
					type: "success"
				});
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			params={{
				include: "translations"
			}}
			fields={[
				{
					name: "comment_app",
					required: true
				},
				{
					name: "dev_report",
					required: true
				},
				{
					name: "version",
					required: true
				},
				{
					name: "type",
					required: true
				}
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Создание версии")}
						</Typography.Heading>
						<Form
							{...{
								values,
								setFieldValue,
								isSubmitting
							}}
						/>
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
