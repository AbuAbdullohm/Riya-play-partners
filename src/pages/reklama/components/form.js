import React from "react";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { useHistory } from "react-router";
import { helpers } from "services";
const Form = ({ isUpdate, isSubmitting, setFieldValue, values, item, lang = "ru", setDatePicketChange }) => {
	const { t } = useTranslation();
	const history = useHistory();
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={8} gutter={8}>
				<Panel>
					<Field component={Fields.Input} name="name" type="text" placeholder="Введите загаловок" label="Заголовок" size="large" />
					<Field component={Fields.Input} name="link" type="text" placeholder="Введите линк" label="Линк" size="large" />
					<Field
						component={Fields.fileUpload}
						name="video_id"
						label={t("Видео")}
						items={get(values, "video_id")}
						isDoc={true}
						onChangeHandler={data => {
							setFieldValue("video_id", data);
						}}
					/>
					{get(values, "video_id").length > 0 && (
						<video controls className="reklamaVideo my-5">
							<source src={get(values, "video_id[0].linkAbsolute")} type="video/mp4" />
						</video>
					)}
					<Field
						component={Fields.Input}
						name="second"
						type="number"
						min="0"
						step="1"
						onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
						label={t("Продолжительность (секунт)")}
						placeholder={t("Продолжительность (секунт)")}
						size="large"
					/>
					<Field
						component={Fields.NewDatePicker}
						name="start_date"
						label="Дата начала"
						todayButton="Сегодня"
						minDate={new Date()}
						onChange={value => {
							setFieldValue("start_date", value);
						}}
					/>

					<Grid.Row cols={12} className="mb-5">
						<Grid.Column lg={6}>
							<Fields.Radio
								id="type-1"
								name="type-1"
								checked={values.view_type === 1}
								onChange={e => {
									setFieldValue("view_type", Number(e.target.value));
									setFieldValue("expected_view_count", null);
								}}
								borderColor="dark-gray"
								value={1}
								label="По дате"
							/>
						</Grid.Column>
						<Grid.Column lg={6}>
							<Fields.Radio
								id="type-2"
								name="type-2"
								checked={values.view_type === 2}
								onChange={e => {
									// setFieldValue("start_date", null);
									setFieldValue("end_date", null);
									setFieldValue("view_type", Number(e.target.value));
								}}
								borderColor="dark-gray"
								value={2}
								label="По количестве просмотров"
							/>
						</Grid.Column>
					</Grid.Row>

					{values.view_type === 1 ? (
						// <Fields.NewDatePicker
						// 	label="Дата"
						// 	type="range"
						// 	isClearable={true}
						// 	required={values.view_type === 1}
						// 	value={[values.start_date, values.end_date]}
						// 	onChange={value => {
						// 		if (setDatePicketChange) {
						// 			setDatePicketChange(true);
						// 		}
						// 		if (value[0] && value[1]) {
						// 			if (value[0]) {
						// 				setFieldValue("start_date", moment(value[0]).unix());
						// 			}
						// 			if (value[1]) {
						// 				setFieldValue("end_date", moment(value[1]).unix());
						// 			}
						// 		}
						// 	}}
						// />

						<Field
							component={Fields.NewDatePicker}
							name="end_date"
							label="Дата окончания"
							minDate={new Date()}
							todayButton="Сегодня"
							onChange={value => {
								setFieldValue("end_date", value);
							}}
						/>
					) : values.view_type === 2 ? (
						<Field
							component={Fields.Input}
							required={values.view_type === 2}
							name="expected_view_count"
							type="text"
							label="Количество просмотров"
							placeholder="Введите ссылку"
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
