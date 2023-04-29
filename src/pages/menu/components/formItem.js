import React from "react";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import { Fields, Grid, Button } from "components";

const Form = ({ isUpdate, isSubmitting, setCreateModal, setUpdateModal, setFieldValue, values }) => {
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
				<Field
					component={Fields.fileUpload}
					name="icon"
					label="Иконка (svg)"
					isDoc={true}
					onlyOneType=".svg"
					items={get(values, "icon")}
					onChangeHandler={data => {
						setFieldValue("icon", data);
					}}
					multiple={false}
				/>
				<Field component={Fields.Input} name="title" type="text" label={t("Заголовок")} placeholder={t("Введите заголовок")} size="large" />
				<Field component={Fields.Input} name="url" type="text" label={t("Ссылка")} placeholder={t("Введите ссылку")} size="large" />
				<div className="flex justify-end">
					<Button.Default type="secondary" buttonType="button" onClick={handleCancel} className="mt-5">
						{t("Отменить")}
					</Button.Default>
					<Button.Default type="primary" buttonType="submit" loading={isSubmitting} className="mt-5 ml-2">
						{isUpdate ? t("Сохранить") : t("Добавить")}
					</Button.Default>
				</div>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
