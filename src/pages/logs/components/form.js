import React from "react";
import { Fields, Grid, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";

const Form = ({ isUpdate, isSubmitting, setCreateModal, setUpdateModal }) => {
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
				<Field component={Fields.Textarea} name="data" type="text" disabled placeholder="Введите названия" label="Message" />

				<div className="flex justify-end">
					<Button.Default type="secondary" buttonType="button" onClick={handleCancel} className="mt-5">
						{t("Отменить")}
					</Button.Default>
				</div>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
