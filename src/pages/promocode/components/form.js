import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { helpers } from "services";

const Form = ({ isFetched, isUpdate, isSubmitting, setFieldValue, values }) => {
	const { t } = useTranslation();
	const history = useHistory();

	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5">
					<Grid.Row gutter={10} gutterX={4}>
						<Grid.Column xs={12} xl={6}>
							<Field
								component={Fields.Input}
								disabled={isUpdate && true}
								name="title_uz"
								type="text"
								placeholder="Введите имя"
								label="Имя (UZ)"
							/>
						</Grid.Column>
						<Grid.Column xs={12} xl={6}>
							<Field
								component={Fields.Input}
								disabled={isUpdate && true}
								name="title_ru"
								type="text"
								placeholder="Введите имя"
								label="Имя (RU)"
							/>
						</Grid.Column>
					</Grid.Row>

					<Field component={Fields.Input} name="code" disabled={isUpdate && true} type="text" placeholder="Введите промокод" label="Промокод" />

					<Field
						component={Fields.Input}
						name="users_count"
						type="number"
						onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
						placeholder="Введите число ползователи"
						label="Число ползователи"
						min="0"
					/>
					<Field
						component={Fields.Input}
						name="copy"
						type="number"
						onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
						placeholder="Введите число копии"
						label="Число копии"
						min="0"
					/>
					<Field
						component={Fields.AsyncSelect}
						name="rates_id"
						placeholder="Виберите Тарифы"
						label="Тарифы"
						isClearable
						hasMore
						version="v1"
						isSearchable
						isMulti={true}
						loadOptionsUrl="/rates"
						optionLabel={`name_ru`}
						loadOptionsParams={search => {
							return {
								extra: { name: search },
								filter: { status: 1 }
							};
						}}
					/>
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Grid.Row cols={12} className="mb-5">
						<Grid.Column xs={12} lg={6}>
							<Fields.Radio
								value={1}
								id="type-1"
								label="Дни"
								name="type-1"
								checked={values.type === 1}
								borderColor="dark-gray"
								onChange={e => {
									setFieldValue("type", Number(e.target.value));
								}}
							/>
						</Grid.Column>
						<Grid.Column xs={12} lg={6}>
							<Fields.Radio
								value={2}
								id="type-2"
								name="type-2"
								label="Месяцы"
								borderColor="dark-gray"
								checked={values.type === 2}
								onChange={e => setFieldValue("type", Number(e.target.value))}
							/>
						</Grid.Column>
					</Grid.Row>
					<Field
						component={Fields.InputMask}
						name="expire_of"
						size="large"
						label={`${values.type === 1 ? "Дни" : "Месяцы"}`}
						placeholder={`Ввыдите ${values.type === 1 ? "Дни" : "Месяцы"}`}
						mask=""
						format="###"
						style={{ width: "100%" }}
					/>

					<Field
						component={Fields.NewDatePicker}
						label="Дата окончания"
						name="expire_at"
						isClearable={true}
						minDate={new Date()}
						onChange={value => {
							setFieldValue("expire_at", value);
						}}
					/>
					<p style={{ marginTop: -10, marginBottom: 30 }}>{t("Оставьте пустым, чтобы быть неограниченным!")}</p>
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
						<Button.Default type="primary" buttonType="submit" disabled={isSubmitting} loading={isSubmitting} className="ml-2">
							{isUpdate ? t("Сохранить") : t("Добавить")}
						</Button.Default>
					</div>
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
