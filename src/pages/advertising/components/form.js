import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

const Form = ({ isUpdate, isSubmitting, setFieldValue, values }) => {
	const { t } = useTranslation();
	const history = useHistory();

	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5" style={{ zIndex: 50 }}>
					<Grid.Row>
						<Grid.Column lg={6}>
							<Field
								component={Fields.Input}
								name="title_uz"
								type="text"
								placeholder="Введите название (УЗ)"
								label="Название (УЗ)"
								size="large"
							/>
						</Grid.Column>
						<Grid.Column lg={6}>
							<Field
								component={Fields.Input}
								name="title_ru"
								type="text"
								placeholder="Введите название (РУ)"
								label="Название (РУ)"
								size="large"
							/>
						</Grid.Column>
					</Grid.Row>

					<Field component={Fields.Input} name="link" label="Линк" placeholder="Введите линк" size="large" />

					<Field
						component={Fields.fileUpload}
						name="file_id"
						label="Видео реклама"
						items={get(values, "file_id", [])}
						isDoc={true}
						onChangeHandler={data => {
							setFieldValue("file_id", data);
						}}
					/>
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Grid.Row cols={12} className="mb-5">
						<Grid.Column lg={6}>
							<Fields.Radio
								id="type-1"
								name="type-1"
								checked={values.type === 1}
								onChange={e => {
									setFieldValue("type", Number(e.target.value));
								}}
								borderColor="dark-gray"
								value={1}
								label="Показать"
							/>
						</Grid.Column>
						<Grid.Column lg={6}>
							<Fields.Radio
								id="type-2"
								name="type-2"
								checked={values.type === 2}
								onChange={e => setFieldValue("type", Number(e.target.value))}
								borderColor="dark-gray"
								value={2}
								label="Срок"
							/>
						</Grid.Column>
					</Grid.Row>

					{values.type === 1 ? (
						<Field
							component={Fields.Input}
							name="max_views_count"
							type="number"
							min="1"
							label="Показать"
							placeholder="Введите число"
							size="large"
						/>
					) : values.type === 2 ? (
						<Field
							component={Fields.DatePicker}
							name="expire_at"
							size="large"
							label={"Cрок"}
							placeholder={"Cрок"}
							showTime={true}
							style={{ width: "100%" }}
							onChange={date => {
								setFieldValue("expire_at", date);
							}}
						/>
					) : null}

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
