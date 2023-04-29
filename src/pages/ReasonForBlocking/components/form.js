import React from "react";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";

const Form = ({ isUpdate, isSubmitting, setFieldValue, values, lang = "ru" }) => {
	const { t } = useTranslation();
	return (
		<Grid.Row gutter={10} gutterX={10} className={"mb-10"}>
			<Grid.Column xl={10} gutter={10}>
				<Panel className="shadow-none">
					<Field component={Fields.Input} name="title_ru" type="text" placeholder="Введите причины" label="Причина" size="large" />
					<Field component={Fields.Input} name="title_uz" type="text" rows={5} label="Sabab" placeholder="Введите описание" />
					<Button.Default type="primary" buttonType="submit" loading={isSubmitting}>
						{isUpdate ? t("Сохранить") : t("Добавить")}
					</Button.Default>
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
