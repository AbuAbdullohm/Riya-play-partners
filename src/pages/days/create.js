import React, { useState } from "react";

import EntityForm from "modules/entity/forms";
import { Typography } from "components";
import Form from "./components/form";
import { useTranslation } from "react-i18next";
import { useNotification } from "hooks";
import DaysForm from "./components/daysForm";

const Create = ({ history }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const [data, setData] = useState(null);

	return (
		<>
			<EntityForm.Main
				method="post"
				entity="user/add-extra-time"
				name={`user/add-extra-time`}
				url="/user/add-extra-time"
				prependData
				primaryKey="id"
				normalizeData={data => data}
				onSuccess={(data, resetForm) => {
					resetForm();
					history.push(`/user/add-extra-time`);
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
					include: "translations,files"
				}}
				fields={[
					{
						name: "days",
						required: true
					}
				]}>
				{({ isSubmitting, values, setFieldValue }) => {
					return (
						<>
							<Typography.Heading type={5} className="intro-y mt-10 mb-5">
								{t("Создать дни")}
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

			{!data ? <DaysForm data={data} /> : null}
		</>
	);
};

export default Create;
