import React from "react";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const Form = ({ isUpdate, isSubmitting, setFieldValue, values }) => {
	const { t } = useTranslation();
	const history = useHistory();
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column md={8} gutter={10}>
				<Panel>
					<Field component={Fields.Input} name="title" type="text" placeholder="Введите загаловок" label="Заголовок" size="large" />
					<Field component={Fields.Textarea} name="message" type="text" label="Описание" placeholder="Введите описание" />
				</Panel>
			</Grid.Column>

			<Grid.Column md={4} gutter={10}>
				<Panel>
					<Fields.Radio
						id="type-3"
						name="type-3"
						checked={values.type === 3}
						onChange={e => {
							setFieldValue("type", Number(e.target.value));
							setFieldValue("model_id", null);
							setFieldValue("date", null);
							setFieldValue("balance_filter", null);
						}}
						borderColor="dark-gray"
						value={3}
						label="Уведомление"
						className="mb-3"
					/>
					<Fields.Radio
						id="type-1"
						name="type-1"
						checked={values.type === 1}
						onChange={e => {
							setFieldValue("type", Number(e.target.value));
							setFieldValue("model_id", null);
							setFieldValue("date", null);
							setFieldValue("balance_filter", null);
						}}
						borderColor="dark-gray"
						value={1}
						label="Новости"
						className="mb-3"
					/>
					<Fields.Radio
						id="type-2"
						name="type-2"
						checked={values.type === 2}
						onChange={e => {
							setFieldValue("type", Number(e.target.value));
							setFieldValue("model_id", null);
							setFieldValue("date", null);
							setFieldValue("balance_filter", null);
						}}
						borderColor="dark-gray"
						value={2}
						label="Фильмы"
						className="mb-3"
					/>
					<Fields.Radio
						id="type-4"
						name="type-4"
						checked={values.type === 4}
						onChange={e => {
							setFieldValue("type", Number(e.target.value));
							setFieldValue("model_id", null);
						}}
						borderColor="dark-gray"
						value={4}
						label="По типу пользователя"
						className="mb-3"
					/>
					{values.type === 1 && (
						<Field
							component={Fields.AsyncSelect}
							name="model_id"
							placeholder="Виберите Новости"
							label="Новости"
							isClearable
							hasMore
							isSearchable
							loadOptionsUrl="/posts"
							optionLabel={`title`}
							loadOptionsParams={search => {
								return {
									extra: { name: search },
									filter: { status: 1 }
								};
							}}
						/>
					)}
					{values.type === 2 && (
						<Field
							component={Fields.AsyncSelect}
							name="model_id"
							placeholder="Виберите Фильмы"
							label="Фильмы"
							isClearable
							version="v2"
							hasMore
							isSearchable
							loadOptionsUrl="/films"
							optionLabel={`name_ru`}
							loadOptionsParams={search => {
								return {
									extra: { name: search },
									filter: { status: 1 }
								};
							}}
						/>
					)}

					{values.type === 4 && (
						<>
							<Field
								component={Fields.Select}
								name="balance_filter"
								optionValue="value"
								optionLabel="label"
								isClearable={true}
								label="Тип пользователя"
								placeholder="Выберите тип пользователя"
								options={[
									{ value: 1, label: "Пользователи с тарифами" },
									{ value: 2, label: "Пользователи с промокодам" },
									{ value: 3, label: "Обычный пользователи" },
									{ value: 4, label: "Все пользователи" }
								]}
							/>
							{values.balance_filter === 1 && (
								<Field
									component={Fields.NewDatePicker}
									name="date"
									isClearable={true}
									required={values.balance_filter === 1 && true}
									label="Время окончания тарифа"
									onChange={value => {
										setFieldValue("date", value);
									}}
								/>
							)}
						</>
					)}

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
