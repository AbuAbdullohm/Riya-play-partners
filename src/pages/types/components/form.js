import React from "react";
import { useHistory } from "react-router";
import { Button, Fields, Grid, Panel } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";

const Form = ({ isUpdate, isSubmitting, setFieldValue, values }) => {
	const { t } = useTranslation();
	const history = useHistory();
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5">
					<Field component={Fields.Input} name="name_uz" type="text" placeholder="Введите имя" label="Имя (UZ)" />
					<Field component={Fields.Input} name="name_ru" type="text" placeholder="Введите имя" label="Имя (RU)" />
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Field component={Fields.Input} name="sort" type="number" min="0" placeholder="Введите номер" label="Сортировать" />

					<Field
						component={Fields.Switch}
						name="has_season"
						label="Сезон"
						onChange={() => {
							setFieldValue("has_season", !values.has_season);
						}}
					/>

					<Field
						component={Fields.Switch}
						name="status"
						label="Статус"
						onChange={() => {
							setFieldValue("status", !values.status);
						}}
					/>

					<div className="flex justify-end">
						<Button.Default type="secondary" buttonType="button" onClick={() => history.goBack()}>
							{t("Отменить")}
						</Button.Default>
						<Button.Default type="primary" buttonType="submit" loading={isSubmitting} className="ml-2">
							{isUpdate ? t("Сохранить") : t("Добавить")}
						</Button.Default>
					</div>
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
