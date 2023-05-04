import React from "react";

import EntityForm from "modules/entity/forms";
import { Field } from "formik";
import { Fields, Button } from "components";
import { useNotification } from "hooks";
import { useTranslation } from "react-i18next";

export default function TasIxCreateModal({ modal, setModal }) {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const { value } = modal;

	return (
		<EntityForm.Main
			url={value ? `/tasix/${value.id}` : "/tasix"}
			method={value ? "put" : "post"}
			entity="tasix"
			name="tasix"
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
					name: "range",
					type: "string",
					value: value ? value.range : null,
					required: true
				},
				{
					name: "mask",
					max: 24,
					value: value ? value.mask : null,
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
							<Field label={t("Диапазон")} component={Fields.Input} type="string" name="range" />
						</div>

						<div className="col-12">
							<Field label={t("Маска")} component={Fields.Input} type="number" name="mask" max="24" />
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
