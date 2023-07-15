import React from "react";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { helpers } from "services";
const Form = ({ isUpdate, isSubmitting, setFieldValue, values }) => {
	const { t } = useTranslation();
	const history = useHistory();
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column md={8} gutter={10}>
				<Panel>
					<Grid.Row gutter={10} gutterX={4}>
						<Grid.Column sm={6} gutter={10}>
							<Field component={Fields.Input} name="name_uz" type="text" placeholder="Введите загаловок" label="Заголовок (УЗ)" size="large" />
							<Field component={Fields.Textarea} name="description_uz" type="text" label="Описание (УЗ)" placeholder="Введите описание" />
						</Grid.Column>
						<Grid.Column sm={6} gutter={10}>
							<Field component={Fields.Input} name="name_ru" type="text" placeholder="Введите загаловок" label="Заголовок (РУ)" size="large" />
							<Field component={Fields.Textarea} name="description_ru" type="text" label="Описание (РУ)" placeholder="Введите описание" />
						</Grid.Column>
					</Grid.Row>
				</Panel>
			</Grid.Column>

			<Grid.Column md={4} gutter={10}>
				<Panel>
					<Field
						component={Fields.Input}
						name="price"
						type="number"
						onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
						placeholder="Введите цену"
						min="0"
						label="Цена"
						size="large"
						className={"mb-1"}
					/>
					<Field
						component={Fields.Input}
						name="days"
						onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
						type="number"
						placeholder="Введите дней"
						min="0"
						label="Дни"
						size="large"
						className={"mb-1"}
					/>
					<Field
						component={Fields.Input}
						name="sort"
						type="number"
						onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
						placeholder="Введите сортировку"
						min="0"
						label="Сорт"
						size="large"
						className={"mb-2"}
					/>

					<div className="d-flex align-items-center">
						<Field
							className="mr-2"
							component={Fields.Switch}
							name="is_foreign"
							label="Для иностранных пользователей"
							onChange={() => setFieldValue("is_foreign", !values.is_foreign)}
							checked={values.is_foreign}
						/>
					</div>

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

					<div className="flex justify-end">
						<Button.Default type="secondary" buttonType="button" onClick={() => history.goBack()}>
							{t("Отменить")}
						</Button.Default>
						<Button.Default type="primary" buttonType="submit" loading={isSubmitting}>
							{isUpdate ? t("Сохранить") : t("Добавить")}
						</Button.Default>
					</div>
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
