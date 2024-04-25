import React from "react";

import EntityForm from "modules/entity/forms";
import { Field } from "formik";
import { Fields, Button } from "components";
import { useNotification } from "hooks";
import { useTranslation } from "react-i18next";
import { get } from "lodash";

export default function CompanyCreateModal({ modal, setModal }) {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const { value } = modal;

	return (
		<EntityForm.Main
			url={value ? `/company/${value.id}` : "/company"}
			method={value ? "put" : "post"}
			entity="company"
			name="company"
			prependData
			version="v1"
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
					name: "title",
					type: "string",
					value: value ? value.title : null,
					required: true
				},
				{
					name: "files",
					type: "array",
					value: get(value, "files0") ? [get(value, "files0", [])] : [],
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "slug",
					value: value ? value.slug : null,
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
							<Field
								component={Fields.fileUpload}
								name="files"
								label="Фото"
								items={Array.isArray(get(values, "files")) ? get(values, "files") : [get(values, "files")]}
								onChangeHandler={data => {
									setFieldValue("files", data);
								}}
								multiple={false}
							/>
						</div>
						<div className="col-12">
							<Field component={Fields.Input} name="title" type="text" placeholder="Введите названия" label="Названия" />
						</div>

						<div className="col-12">
							<Field component={Fields.Input} name="slug" type="text" placeholder="Введите ссылка" label="Ссылка" />
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
