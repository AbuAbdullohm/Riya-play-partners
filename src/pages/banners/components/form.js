import React from "react";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { useHistory } from "react-router";
const Form = ({ isUpdate, isSubmitting, setFieldValue, values, lang = "ru" }) => {
	const { t } = useTranslation();
	const history = useHistory();
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={8} gutter={10}>
				<Panel>
					<Field component={Fields.Input} name="title" type="text" placeholder="Введите загаловок" label="Заголовок" size="large" />

					<Field
						component={Fields.fileUpload}
						name="file_id"
						label={t("Фото")}
						size="large"
						items={Array.isArray(get(values, "file_id")) ? get(values, "file_id") : [get(values, "file_id")]}
						onChangeHandler={data => {
							setFieldValue("file_id", data);
						}}
						className={"mb-10"}
						isDocument={false}
					/>
				</Panel>
			</Grid.Column>

			<Grid.Column xs={4} gutter={10}>
				<Panel>
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
								label="Линк"
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
								label="Фильм"
							/>
						</Grid.Column>
					</Grid.Row>

					{values.type === 1 ? (
						<Field component={Fields.Input} name="link" type="text" label="Ссылка" placeholder="Введите ссылку" />
					) : values.type === 2 ? (
						<Field
							component={Fields.AsyncSelect}
							name="film_id"
							placeholder="Виберите Фильмы"
							label="Фильмы"
							isClearable
							hasMore
							version="v2"
							isSearchable
							loadOptionsUrl="/films"
							optionLabel={`name_${lang}`}
							loadOptionsParams={search => {
								return {
									extra: { name: search },
									filter: { status: 1 }
								};
							}}
						/>
					) : null}

					<Grid.Row cols={12} className="mb-5">
						<Grid.Column lg={6}>
							<Fields.Radio
								id="count-1"
								name="count-1"
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
								id="count-2"
								name="count-2"
								checked={values.view_type === 2}
								onChange={e => {
									setFieldValue("view_type", Number(e.target.value));
									// setFieldValue("start_date", null);
									setFieldValue("end_date", null);
								}}
								borderColor="dark-gray"
								value={2}
								label="По количестве просмотров"
							/>
						</Grid.Column>
					</Grid.Row>

					{values.view_type === 1 ? (
						<Field
							component={Fields.NewDatePicker}
							name="end_date"
							label="Дата окончания"
							required={values.view_type === 1}
							minDate={new Date()}
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
