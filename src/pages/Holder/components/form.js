import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button, Loader } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

const Form = ({ isFetched, isUpdate, isSubmitting, setFieldValue, values, setErrors, errors }) => {
	const { t } = useTranslation();
	const history = useHistory();

	if (!isFetched) return <Loader />;
	console.log({ values });
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5">
					<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
						<Grid.Column xs={4} xl={4}>
							<Field component={Fields.Input} name="title_uz" type="text" placeholder="Введите название" label="Название (UZ)" />
						</Grid.Column>
						<Grid.Column xs={4} xl={4}>
							<Field component={Fields.Input} name="title_ru" type="text" placeholder="Введите название" label="Название (RU)" />
						</Grid.Column>
						<Grid.Column xs={4} xl={4}>
							<Field component={Fields.Input} name="title_en" type="text" placeholder="Введите название" label="Название (EN)" />
						</Grid.Column>
						<Grid.Column xs={4} xl={4}>
							<Field component={Fields.Input} name="description_uz" type="text" placeholder="Введите описание" label="Описание (UZ)" />
						</Grid.Column>
						<Grid.Column xs={4} xl={4}>
							<Field component={Fields.Input} name="description_ru" type="text" placeholder="Введите описание" label="Описание (RU)" />
						</Grid.Column>
						<Grid.Column xs={4} xl={4}>
							<Field component={Fields.Input} name="description_en" type="text" placeholder="Введите описание" label="Описание (EN)" />
						</Grid.Column>
					</Grid.Row>
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Field
						component={Fields.fileUpload}
						name="logo_id"
						label="Логотип"
						items={Array.isArray(get(values, "logo_id")) ? get(values, "logo_id") : [get(values, "logo")]}
						onChangeHandler={data => {
							setFieldValue("logo_id", data);
						}}
						multiple={false}
					/>

					<div className="d-flex justify-between">
						<Field
							component={Fields.Switch}
							name="status"
							label="Статус"
							onChange={() => {
								setFieldValue("status", !values.status);
							}}
						/>
					</div>

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
