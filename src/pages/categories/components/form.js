import React from "react";
import { Button, Fields, Grid } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { helpers } from "services";
const Form = ({ isUpdate, isSubmitting, setCreateModal, setUpdateModal, values, setFieldValue }) => {
	const { t } = useTranslation();

	const handleCancel = () => {
		if (isUpdate) {
			setUpdateModal(false);
		} else {
			setCreateModal(false);
		}
	};
	return (
		<Grid.Row gutter={1}>
			<Grid.Column xs={12}>
				<Field component={Fields.Input} name="title_uz" type="text" placeholder="Введите название (УЗ)" label="Названия (УЗ)" />
				<Field component={Fields.Input} name="title_ru" type="text" placeholder="Введите название (РУ)" label="Названия (РУ)" />

				<Field
					component={Fields.Input}
					name="sort"
					type="number"
					min="0"
					onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
					placeholder="Введите число"
					label="Сортировать"
				/>

				<Field
					component={Fields.Switch}
					name="show_in_home"
					label="Видно на главнии"
					onChange={() => setFieldValue("show_in_home", !values.show_in_home)}
					checked={values.status}
				/>

				<Field
					component={Fields.Switch}
					name="status"
					label="Активный статус"
					onChange={() => setFieldValue("status", !values.status)}
					checked={values.status}
				/>

				<div className="flex justify-end">
					<Button.Default type="secondary" buttonType="button" onClick={handleCancel} className="mt-5 mr-2">
						{t("Отменить")}
					</Button.Default>
					<Button.Default type="primary" buttonType="submit" loading={isSubmitting} className="mt-5">
						{isUpdate ? t("Сохранить") : t("Добавить")}
					</Button.Default>
				</div>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
