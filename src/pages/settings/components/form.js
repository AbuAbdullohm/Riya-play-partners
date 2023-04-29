import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

const Form = ({ isFetched, isUpdate, isSubmitting, setFieldValue, values }) => {
	const { t } = useTranslation();
	const history = useHistory();
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5">
					<Field component={Fields.Input} name="name" type="text" placeholder={t("Введите загаловок")} label={t("Заголовок")} size="large" />
					<Field
						component={Fields.Input}
						name="slug"
						type="text"
						placeholder={t("Введите слуг")}
						label={t("Слуг")}
						size="large"
						disabled={isUpdate}
					/>
					<Field component={Fields.Input} name="link" type="text" placeholder={t("Введите линк")} label={t("Линк")} size="large" />
					<Field component={Fields.Textarea} name="value" type="text" rows={5} label={t("Текст")} placeholder={t("Введите текст")} />
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Field
						component={Fields.Input}
						name="alias"
						type="text"
						placeholder={t("Введите алиас")}
						label={t("Алиас")}
						size="large"
						disabled={isUpdate}
					/>
					<Field
						component={Fields.fileUpload}
						name="photo"
						label="Фото"
						items={get(values, "photo")}
						onChangeHandler={data => {
							setFieldValue("photo", data);
						}}
						multiple={false}
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
