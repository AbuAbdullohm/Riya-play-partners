import React from "react";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
const Form = ({ isUpdate, isSubmitting, setFieldValue, values, item, lang = "ru", setDatePicketChange }) => {
	const { t } = useTranslation();
	const history = useHistory();
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={8} gutter={8}>
				<Panel>
					<Field
						component={Fields.Select}
						name="type"
						label="Название"
						placeholder="Название"
						isDisabled={isUpdate}
						isClearable
						optionLabel="name"
						optionValue="value"
						options={[
							{ name: "Пакет FF (Free user - Free film)", value: 1 },
							{ name: "Пакет PF (Premium user - Free film)", value: 2 },
							{ name: "Пакет PP (Premium user - Premium film)", value: 3 }
						]}
					/>
					<Field
						component={Fields.AsyncSelect}
						name="advertising"
						label="Выберите реклама"
						isMulti={true}
						isSearchable={true}
						isClearable={true}
						placeholder="Выберите реклама"
						optionLabel="name"
						loadOptionsUrl="/ads-track"
						loadOptionsParams={search => {
							return {
								filter: { status: 1 }
							};
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
						<Button.Default type="primary" buttonType="submit" loading={isSubmitting}>
							{t("Обновить")}
						</Button.Default>
					</div>
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
