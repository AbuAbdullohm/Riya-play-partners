import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button, Ckeditor } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

const Form = ({ isUpdate, isSubmitting, setFieldValue, values, lang }) => {
	const { t } = useTranslation();
	const history = useHistory();
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5">
					<Field component={Fields.Input} name="title" type="text" placeholder="Введите названию" label="Названия" />
					<Field component={Fields.Input} name="slug" type="text" placeholder="Введите слуг" label="Слуг" />
					<Field component={Ckeditor} name="description" placeholder="Полный текст новости" label="Полный текст новости" />
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Field
						component={Fields.fileUpload}
						name="photo"
						label="Файлы"
						items={Array.isArray(get(values, "photo")) ? get(values, "photo") : [get(values, "photo")]}
						onChangeHandler={data => {
							setFieldValue("photo", data);
						}}
						isDoc={true}
						multiple={true}
						limit={10}
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
						<Button.Default type="secondary" buttonType="button" onClick={() => history.push(`/pages?lang=${lang}`)}>
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
