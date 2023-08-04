import React from "react";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";

const Form = ({ isUpdate, isSubmitting, setFieldValue, values, lang = "ru" }) => {
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10 rates-form"}>
			<Grid.Column lg={3}></Grid.Column>

			<Grid.Column lg={6} gutter={10}>
				<Panel>
					<Grid.Row gutter={10} gutterX={4}>
						<Grid.Column lg={12}>
							<Field component={Fields.Input} name="title" type="text" placeholder="Название" label="Название" size="large" />
						</Grid.Column>
						<Grid.Column lg={12}>
							<Field component={Fields.Textarea} name="description" type="text" placeholder="Описание" label="Описание" size="large" />
						</Grid.Column>
						<Grid.Column lg={12}>
							<Field
								component={Fields.Select}
								name="type"
								type="text"
								placeholder="Тип"
								label="Тип"
								size="large"
								optionValue={"value"}
								optionLabel={"label"}
								options={[{ value: 1, label: 1 }]}
							/>
						</Grid.Column>
						<Grid.Column lg={12} gutter={10}>
							<Field
								placeholder="Дни простоя сервера"
								label="Дни простоя сервера"
								size="large"
								component={Fields.NewDatePicker}
								name="days"
								type="range"
								onChange={value => {
									setFieldValue("days", value);
								}}
							/>
						</Grid.Column>
						<Grid.Column lg={12} gutter={10}>
							<Button.Default
								type="primary"
								buttonType="submit"
								style={{
									width: "100%"
								}}
								loading={isSubmitting}>
								Применять
							</Button.Default>
						</Grid.Column>

						{/* <Grid.Column md={12}>
							<div className="flex justify-end">
								<Button.Default type="secondary" buttonType="button" onClick={() => history.goBack()}>
									{t("Отменить")}
								</Button.Default>
								<Button.Default type="primary" buttonType="submit" loading={isSubmitting}>
									{isUpdate ? t("Сохранить") : t("Добавить")}
								</Button.Default>
							</div>
						</Grid.Column> */}
					</Grid.Row>
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
