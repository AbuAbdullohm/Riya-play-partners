import React from "react";
import { Fields, Grid, Panel, Button, Ckeditor } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { useHistory } from "react-router";

const Form = ({ isUpdate, isSubmitting, setFieldValue, values, lang = "ru" }) => {
	const { t } = useTranslation();
	const history = useHistory();
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xl={8} gutter={10}>
				<Panel>
					<Field component={Fields.Input} name={`title`} type="text" placeholder="Введите загаловок" label="Заголовок" size="large" />
					<Field component={Fields.Textarea} name="description" type="text" rows={5} label="Описание" placeholder="Введите описание" />
					<Field component={Ckeditor} name="content" placeholder="Полный текст новости" label="Полный текст новости" />
				</Panel>
			</Grid.Column>

			<Grid.Column xl={4} gutter={10}>
				<Panel>
					<Field
						component={Fields.AsyncSelect}
						name="category_id"
						placeholder={t("Выберите категорию")}
						label={t("Категория")}
						isClearable={true}
						isSearchable={false}
						loadOptionsUrl="/categories"
						className="mb-24"
						optionLabel={`title_${lang}`}
						loadOptionsParams={title => {
							return {
								filter: { status: 1 },
								extra: { title }
							};
						}}
					/>
					<Field
						component={Fields.NewDatePicker}
						label="Дата публикации"
						name="publish_time"
						disabled
						// value={isUpdate ? values.publish_time : new Date()}
						minDate={new Date()}
						isToday
						onChange={value => {
							setFieldValue("publish_time", value);
						}}
					/>

					<Field
						component={Fields.fileUpload}
						name="photo"
						label={t("Фото")}
						items={get(values, "photo")}
						onChangeHandler={data => {
							setFieldValue("photo", data);
						}}
					/>

					<div className="d-flex align-items-center">
						<Field
							className="mr-2"
							component={Fields.Switch}
							name="status"
							label="Активный статус"
							onChange={() => setFieldValue("status", !values.status)}
							checked={values.status}
						/>
					</div>
					<Button.Default type="secondary" buttonType="button" onClick={() => history.goBack()}>
						Отменить
					</Button.Default>
					<Button.Default type="primary" buttonType="submit" loading={isSubmitting}>
						{isUpdate ? t("Сохранить") : t("Добавить")}
					</Button.Default>
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
