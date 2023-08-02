import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { helpers } from "services";

const Form = ({ isFetched, setFieldTouched, isUpdate, isSubmitting, setFieldValue, values, lang = "ru", validateForm = () => {} }) => {
	const { t } = useTranslation();
	const history = useHistory();

	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5" style={{ zIndex: 50 }}>
					<Grid.Row>
						<Grid.Column lg={12}>
							<Field
								component={Fields.fileUpload}
								name="photo"
								label="Фото"
								version="v1"
								items={get(values, "photo")}
								onChangeHandler={data => {
									setFieldValue("photo", data);
								}}
								multiple={false}
							/>
						</Grid.Column>
						<Grid.Column lg={12}>
							<Field component={Fields.Input} name="title" type="text" placeholder="Введите заголовок" label="Имя" size="large" />
						</Grid.Column>
						<Grid.Column lg={12}>
							<Field component={Fields.Input} name="description" type="text" placeholder="Введите описание" label="Описание" size="large" />
						</Grid.Column>
					</Grid.Row>
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Field component={Fields.Input} name="slug" type="text" label="URL" placeholder="Введите URL" size="large" />

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
