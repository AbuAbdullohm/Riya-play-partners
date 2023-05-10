import React from "react";

import EntityForm from "modules/entity/forms";
import { Field } from "formik";
import { Fields, Button } from "components";
import { useNotification } from "hooks";
import { useTranslation } from "react-i18next";

export default function BanModal({ modal, setModal }) {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const { value } = modal;

	return (
		<EntityForm.Main
			url={value ? `/banned-user-agent/${value.id}` : "/banned-user-agent"}
			method={value ? "put" : "post"}
			entity="banned-user-agent"
			name="banned-user-agent"
			prependData
			version="v3"
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(_, resetForm) => {
				resetForm();
				setModal(false);
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
					name: "user_agent",
					type: "string",
					value: value ? value.user_agent : null,
					required: true
				},
				{
					name: "status",
					value: value ? value.status : true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}>
			{({ values, setFieldValue, isSubmitting }) => {
				return (
					<div className="row">
						<div className="col-12">
							<Field component={Fields.Input} name="user_agent" type="text" placeholder="Введите устройство" label="Устройство" />
						</div>
						<div className="col-12">
							<Field
								component={Fields.Switch}
								name="status"
								label="Статус"
								onChange={() => {
									setFieldValue("status", !values.status);
								}}
							/>
						</div>

						<div className="col-12 flex justify-end">
							<Button.Default type="secondary" buttonType="button" onClick={() => setModal(false)}>
								{t("Отменить")}
							</Button.Default>
							<Button.Default type="primary" buttonType="submit" loading={isSubmitting} className="ml-2">
								{value ? t("Сохранить") : t("Добавить")}
							</Button.Default>
						</div>
					</div>
				);
			}}
		</EntityForm.Main>
	);
}
