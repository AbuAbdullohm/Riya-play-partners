import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { isArray } from "lodash";

const Form = ({ isFetched, setFieldTouched, isUpdate, isSubmitting, setFieldValue, values, lang = "ru", validateForm = () => {} }) => {
	const { t } = useTranslation();
	const history = useHistory();
	const logo = get(values, "logo_id");

	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5" style={{ zIndex: 50 }}>
					<Grid.Row>
						<Grid.Column lg={12}>
							<Field
								component={Fields.fileUpload}
								name="logo_id"
								label="Фото"
								version="v1"
								items={logo ? (Array.isArray(logo) ? logo : [logo]) : []}
								onChangeHandler={data => {
									setFieldValue("logo_id", data);
								}}
								multiple={false}
							/>
						</Grid.Column>
						<Grid.Column lg={4}>
							<Field component={Fields.Input} name="name_uz" type="text" placeholder="Введите заголовок (UZ)" label="Имя (UZ)" size="large" />
						</Grid.Column>
						<Grid.Column lg={4}>
							<Field component={Fields.Input} name="name_ru" type="text" placeholder="Введите заголовок (RU)" label="Имя (RU)" size="large" />
						</Grid.Column>
						<Grid.Column lg={4}>
							<Field component={Fields.Input} name="name_en" type="text" placeholder="Введите заголовок (EN)" label="Имя (EN)" size="large" />
						</Grid.Column>
						<Grid.Column lg={12}>
							<Field
								component={Fields.Input}
								name="description_uz"
								type="text"
								placeholder="Введите описание (UZ)"
								label="Описание (UZ)"
								size="large"
							/>
						</Grid.Column>
						<Grid.Column lg={12}>
							<Field
								component={Fields.Input}
								name="description_ru"
								type="text"
								placeholder="Введите описание (RU)"
								label="Описание (RU)"
								size="large"
							/>
						</Grid.Column>
						<Grid.Column lg={12}>
							<Field
								component={Fields.Input}
								name="description_en"
								type="text"
								placeholder="Введите описание (EN)"
								label="Описание (EN)"
								size="large"
							/>
						</Grid.Column>
					</Grid.Row>
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Field
						component={Fields.Switch}
						name="is_redirectable"
						label="Перенаправляется"
						onChange={() => {
							setFieldValue("is_redirectable", !values.is_redirectable);
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
