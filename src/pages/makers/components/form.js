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
					<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
						<Grid.Column xs={12} xl={6}>
							<Field component={Fields.Input} name="name_uz" type="text" placeholder="Введите имя" label="Имя (UZ)" />
						</Grid.Column>
						<Grid.Column xs={12} xl={6}>
							<Field component={Fields.Input} name="name_ru" type="text" placeholder="Введите имя" label="Имя (RU)" />
						</Grid.Column>
					</Grid.Row>
					<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
						<Grid.Column xs={12} xl={6}>
							<Field
								component={Fields.Textarea}
								name="bio_uz"
								type="text"
								rows={10}
								label="Полный текст биографии (UZ)"
								placeholder="Введите полный текст биографии (UZ)"
							/>
						</Grid.Column>
						<Grid.Column xs={12} xl={6}>
							<Field
								component={Fields.Textarea}
								name="bio_ru"
								type="text"
								rows={10}
								label="Полный текст биографии (RU)"
								placeholder="Введите полный текст биографии (RU)"
							/>
						</Grid.Column>
					</Grid.Row>
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Field component={Fields.Input} name="instagram" type="text" placeholder="Введите инстаграм" label="Инстаграм" />
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
