import React, { useState } from "react";
import { Fields, Grid, Panel, Button, Modal, Icon } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import CreateTag from "./create-tag";
import { helpers } from "services";
const Form = ({ isUpdate, isSubmitting, setFieldValue, values, lang = "ru", handleSubmit }) => {
	const { t } = useTranslation();
	const [createModal, setCreateModal] = useState(false);

	const createTag = e => {
		e.preventDefault();
		e.stopPropagation();
		setCreateModal(prev => !prev);
	};

	return (
		<>
			<Modal.Default header="Добавить" toggle={createModal} setToggle={setCreateModal}>
				<CreateTag {...{ setCreateModal }} />
			</Modal.Default>

			<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
				<Grid.Column xl={8} gutter={10} className="zIndex100">
					<Panel>
						<Grid.Row gutter={10} gutterX={4}>
							<Grid.Column lg={6}>
								<Field component={Fields.Input} name="name_uz" type="text" placeholder="Название (УЗ)" label="Название (УЗ)" size="large" />
							</Grid.Column>
							<Grid.Column lg={6}>
								<Field component={Fields.Input} name="name_ru" type="text" placeholder="Название (РУ)" label="Название (РУ)" size="large" />
							</Grid.Column>
						</Grid.Row>

						<Grid.Row gutter={10} gutterX={4}>
							<Grid.Column lg={6}>
								<Field
									component={Fields.Textarea}
									name="description_uz"
									type="text"
									rows={8}
									placeholder={"Полный текст (УЗ)"}
									label={"Описание (УЗ)"}
								/>
							</Grid.Column>
							<Grid.Column lg={6}>
								<Field
									component={Fields.Textarea}
									name="description_ru"
									type="text"
									rows={8}
									placeholder={"Полный текст (РУ)"}
									label={"Описание (РУ)"}
								/>
							</Grid.Column>
						</Grid.Row>

						<Field
							component={Fields.fileUpload}
							name="photo"
							label={t("Фото")}
							items={get(values, "photo")}
							onChangeHandler={data => {
								setFieldValue("photo", data);
							}}
						/>

						<Field
							component={Fields.fileUpload}
							name="gallery"
							multiple={true}
							label={t("Галлерея")}
							items={get(values, "gallery")}
							onChangeHandler={data => {
								setFieldValue("gallery", data);
							}}
						/>

						<Field
							component={Fields.fileUpload}
							name="thriller_id"
							label={t("Трейлер")}
							items={get(values, "thriller_id")}
							isDoc={true}
							onChangeHandler={data => {
								setFieldValue("thriller_id", data);
							}}
						/>

						<Field
							component={Fields.AsyncSelect}
							name="actors"
							placeholder={"Выберите актера"}
							label={"Aктеры"}
							isClearable
							hasMore
							isMulti
							isSearchable
							loadOptionsUrl="/actors"
							className="mb-24"
							optionLabel={`name_${lang}`}
							loadOptionsParams={search => {
								return {
									extra: { name: search },
									filter: { status: 1 }
								};
							}}
						/>
						<Field
							component={Fields.AsyncSelect}
							name="maker_id"
							placeholder={t("Выберите режиссера")}
							label={t("Режиссер")}
							isClearable
							hasMore
							isSearchable
							loadOptionsUrl="/makers"
							className="mb-24"
							optionLabel={`name_${lang}`}
							loadOptionsParams={search => {
								return {
									extra: { name: search },
									filter: { status: 1 }
								};
							}}
						/>
					</Panel>
				</Grid.Column>

				<Grid.Column xl={4} gutter={10}>
					<Panel>
						<Field
							component={Fields.DatePicker}
							name="publish_time"
							size="large"
							disabled={true}
							label={"Дата публикации"}
							placeholder={"Дата публикации"}
							style={{ width: "100%" }}
							onChange={date => {
								setFieldValue("publish_time", date);
							}}
						/>
						<Field
							component={Fields.Input}
							name="playback_time"
							type="number"
							min="0"
							step="1"
							onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
							label={t("Продолжительность")}
							placeholder={t("Продолжительность (минута)")}
							size="large"
						/>
						<Field
							component={Fields.Input}
							name="year"
							type="number"
							min="1900"
							max="2099"
							step="1"
							onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
							label={t("Год")}
							placeholder={t("Выберите год")}
							size="large"
						/>
						<Field
							component={Fields.AsyncSelect}
							name="country_id"
							placeholder={t("Выберите страну")}
							label={t("Страна")}
							isClearable
							isSearchable
							hasMore
							loadOptionsUrl="/country"
							loadFilterParams={{ country_id: get(values, "country_id.id") }}
							className="mb-24"
							optionLabel={`name_${lang}`}
							loadOptionsParams={search => {
								return {
									sort: "name",
									limit: 20,
									extra: { name: search }
								};
							}}
						/>
						<Field
							component={Fields.AsyncSelect}
							name="categories"
							placeholder={t("Выберите категорию")}
							label={t("Категория")}
							isClearable={true}
							isSearchable={true}
							isMulti={true}
							loadOptionsUrl="/categories"
							className="mb-24"
							optionLabel={`title_${lang}`}
							loadOptionsParams={title => {
								return {
									filter: { status: 1 },
									extra: { title }
								};
							}}
						/>

						<div className="films-form-tag">
							{!createModal && (
								<Field
									component={Fields.AsyncSelect}
									name="tags"
									placeholder={t("Выберите формат")}
									label="Формат"
									isClearable
									hasMore
									isSearchable
									isDisabled={createModal}
									loadOptionsUrl="/tags"
									className="mb-24 mr-2"
									isMulti
									optionLabel={`title_${lang}`}
									loadOptionsParams={search => {
										return {
											extra: { title: search },
											filter: { status: 1 }
										};
									}}
								/>
							)}
							<Button.Outline
								type="success"
								buttonType="button"
								size="sm"
								style={{ width: createModal ? "100%" : "auto" }}
								onClick={e => createTag(e)}
								// loading={isSubmitting}
							>
								<Icon name="plus" />
							</Button.Outline>
						</div>

						<Field
							component={Fields.AsyncSelect}
							name="genres"
							placeholder={t("Выберите жанры")}
							label={t("Жанры")}
							isClearable
							hasMore
							isMulti
							isSearchable
							loadOptionsUrl="/genres"
							className="mb-24"
							optionLabel={`name_${lang}`}
							loadOptionsParams={search => {
								return {
									extra: { name: search },
									filter: { status: 1 }
								};
							}}
						/>

						<Field
							component={Fields.AsyncSelect}
							name="type"
							placeholder={t("Выберите тип")}
							label={t("Тип")}
							isClearable
							hasMore
							isSearchable
							loadOptionsUrl="/types"
							className="mb-24"
							optionLabel={`name_${lang}`}
							loadOptionsParams={search => {
								return {
									extra: { name: search },
									filter: { status: 1 }
								};
							}}
						/>

						<div className="d-flex justify-content-between">
							<Field
								checked={Number(values.paid) === true}
								component={Fields.Checkbox}
								className="mb-5"
								name="paid"
								onChange={e => setFieldValue("paid", e.target.checked)}
								label={t("Платный")}
								size="large"
							/>
							<Field
								checked={Number(values.recommended) === true}
								component={Fields.Checkbox}
								className="mb-5"
								name="recommended"
								onChange={e => setFieldValue("recommended", e.target.checked)}
								label={t("Рекомендуемые")}
								size="large"
							/>
							<Field
								checked={Number(values.enabled_watermark) === true}
								component={Fields.Checkbox}
								className="mb-5"
								name="enabled_watermark"
								onChange={e => setFieldValue("enabled_watermark", e.target.checked)}
								label={t("Ватермарк")}
								size="large"
							/>
						</div>
						{/* <Field
							checked={Number(values.foreign_user_can_view) === true}
							component={Fields.Checkbox}
							className="mb-5"
							disabled={values.foreign_status ? true : false}
							name="foreign_user_can_view"
							onChange={e => setFieldValue("foreign_user_can_view", e.target.checked)}
							label={t("Иностранные пользователи")}
							size="large"
						/> */}

						<Field
							className="mr-2"
							component={Fields.Switch}
							name="foreign_user_can_view"
							disabled={values.foreign_status ? true : false}
							label="Иностранные пользователи"
							onChange={() => setFieldValue("foreign_user_can_view", !values.foreign_user_can_view)}
							checked={values.foreign_user_can_view}
						/>

						<Field
							className="mr-2"
							component={Fields.Switch}
							name="foreign_status"
							disabled={values.foreign_user_can_view ? true : false}
							label="Смотреть за границей"
							onChange={() => setFieldValue("foreign_status", !values.foreign_status)}
							checked={!!values.foreign_status}
						/>
						<Field
							className="mr-2"
							component={Fields.Switch}
							name="status"
							label="Активный статус"
							onChange={() => setFieldValue("status", !values.status)}
							checked={values.status}
						/>

						<Button.Default type="primary" buttonType="button" disabled={isSubmitting} onClick={() => handleSubmit()} loading={isSubmitting}>
							{isUpdate ? t("Сохранить") : t("Добавить")}
						</Button.Default>
					</Panel>
				</Grid.Column>
			</Grid.Row>
		</>
	);
};

export default Form;
