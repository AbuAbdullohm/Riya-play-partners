import React from "react";
import { Fields, Grid, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";

const Form = ({ isUpdate, isSubmitting, setCreateModal, setUpdateModal, values, setFieldValue }) => {
	const { t } = useTranslation();

	return (
		<Grid.Row gutter={1}>
			<Grid.Column xs={12}>
				<Field component={Fields.Input} name="name_uz" type="text" placeholder="Введите название (УЗ)" label="Названия (УЗ)" />
				<Field component={Fields.Input} name="name_ru" type="text" placeholder="Введите название (РУ)" label="Названия (РУ)" />
				<Field
					component={Fields.Switch}
					name="status"
					label="Активный статус"
					onChange={() => setFieldValue("status", !values.status)}
					checked={values.status}
				/>

				<div className="flex justify-end">
					<Button.Default type="primary" buttonType="submit" loading={isSubmitting} className="mt-5">
						{isUpdate ? t("Сохранить") : t("Добавить")}
					</Button.Default>
				</div>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
