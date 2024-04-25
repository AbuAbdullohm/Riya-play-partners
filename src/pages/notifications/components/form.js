import React from "react";
import { Fields, Grid, Panel, Button, Ckeditor } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { get } from "lodash";
import moment from "moment";

const Form = ({ isUpdate, isSubmitting, setFieldValue, values, handleSubmit, notificationType, setNotificationType }) => {
	const { t } = useTranslation();
	const history = useHistory();

	const { notification_type } = values;

	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column md={8} gutter={10}>
				<Panel>
					<Field
						component={Fields.Select}
						name="notification_type"
						optionValue="value"
						optionLabel="label"
						label="Выберите формат уведомления"
						placeholder="Выберите формат уведомления"
						onChange={({ value }) => {
							setFieldValue("notification_type", value);
							setNotificationType(value);
						}}
						options={[
							{ value: 1, label: "Уведомления в приложении" },
							{ value: 2, label: "Уведомления в виде SMS" }
						]}
					/>

					{notification_type === 1 ? (
						<>
							<Field
								component={Fields.fileUpload}
								name="image_id"
								label="Изображение"
								items={Array.isArray(get(values, "image_id")) ? get(values, "image_id") : [get(values, "image")]}
								onChangeHandler={data => {
									setFieldValue("image_id", data);
								}}
								multiple={false}
							/>
							<Field component={Fields.Input} name="title" type="text" placeholder="Введите загаловок" label="Заголовок" size="large" />
							<Field component={Ckeditor} name="content" placeholder="Полный текст новости" label="Полный текст новости" />
						</>
					) : (
						<Field
							component={Fields.Textarea}
							name="message"
							type="text"
							label={`Описание (${get(values, "message", "").length})`}
							placeholder="Введите описание"
						/>
					)}
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
					{notification_type === 1 && (
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
					)}

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

					{values.type === 1 && notification_type === 1 && (
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
								name={"filter.user_category"}
								component={Fields.Select}
								optionValue="value"
								optionLabel="label"
								isClearable={true}
								label="Категория пользователей"
								placeholder="Выберите Категория пользователей"
								options={[
									{ value: 1, label: "Локальные пользователи" },
									{ value: 2, label: "Глобальные пользователи" }
								]}
							/>
							<Field
								name="filter.user_id"
								label="ID пользователя"
								component={Fields.AsyncSelect}
								placeholder="Виберите пользователя"
								isClearable
								version="v2"
								hasMore
								isSearchable
								loadOptionsUrl="/user"
								loadOptionsKey="items"
								optionLabel={`full_name`}
								loadOptionsParams={search => {
									return {
										extra: {
											id: search,
											status: 10
										},
										sort: "-id"
									};
								}}
							/>

							<Field
								name="filter.phone"
								label="Телефон пользователя"
								component={Fields.AsyncSelect}
								placeholder="Телефон пользователя"
								isClearable
								version="v2"
								hasMore
								isSearchable
								loadOptionsUrl="/user"
								loadOptionsKey="items"
								optionLabel={option => (
									<div className="d-flex">
										<div className="text-left">
											<span>{option.username}: </span>
										</div>
										<div>
											<span>+{option.phone}</span>
										</div>
									</div>
								)}
								loadOptionsParams={search => {
									return {
										extra: {
											phone: search,
											status: 10
										},
										sort: "-id"
									};
								}}
							/>

							<Field
								name="filter.fullname"
								label="Ф.И.О пользователя"
								component={Fields.AsyncSelect}
								placeholder="Виберите пользователя"
								isClearable
								version="v2"
								hasMore
								isSearchable
								loadOptionsUrl="/user"
								loadOptionsKey="items"
								optionLabel={`full_name`}
								loadOptionsParams={search => {
									return {
										extra: {
											name: search,
											status: 10
										},
										sort: "-id"
									};
								}}
							/>

							<Field
								component={Fields.Select}
								name="filter.gender"
								optionValue="value"
								optionLabel="label"
								isClearable={true}
								label="Пол пользователя"
								placeholder="Выберите Пол пользователя"
								options={[
									{ value: 1, label: "Мужской" },
									{ value: 2, label: "Женский" }
								]}
							/>

							<Field
								component={Fields.Input}
								type="number"
								name="filter.device_count"
								label="Количество устройстве"
								placeholder="Выберите Количество устройстве"
							/>

							<Field
								component={Fields.Select}
								name="filter.account_status"
								optionValue="value"
								optionLabel="label"
								isClearable={true}
								label="Состояние счета и тарифа"
								placeholder="Выберите состояние счета и тарифа"
								options={[
									{ value: "1", label: "Есть деньги на счету - Тариф активирован" },
									{ value: "2", label: "Есть деньги на счету - Тариф неактивирован" },
									{ value: "3", label: "Счет не заполнен - Тариф активирован" },
									{ value: "4", label: "Счет не заполнен - Тариф неактивирован" }
								]}
							/>

							<Field
								component={Fields.Select}
								name="filter.ban_status"
								optionValue="value"
								optionLabel="label"
								isClearable={true}
								label="Статус огр-е (использования / комментарий)"
								placeholder="Выберите статус"
								options={[
									{ value: "1", label: "Активный - Активный" },
									{ value: "2", label: "Активный - Неактивный" },
									{ value: "3", label: "Неактивный - Активный" }
								]}
							/>

							{false && (
								<Grid.Row gutter={12} className="align-center">
									<Grid.Column
										xs={values.subscribe_type !== null && values.subscribe_type !== "" ? 8 : 12}
										lg={values.subscribe_type !== null && values.subscribe_type !== "" ? 8 : 12}
										xl={values.subscribe_type !== null && values.subscribe_type !== "" ? 8 : 12}>
										<Field
											component={Fields.Select}
											name="filter.subscribe_type"
											optionValue="value"
											optionLabel="label"
											isClearable={true}
											label="Тип премиум подписки пользователя"
											placeholder="Выберите тип подписки пользователя"
											handleChange={() => {
												setFieldValue("is_active", 0);
											}}
											options={[
												{ value: "2", label: "Все пользователи с тарифом" },
												{ value: "1", label: "Все пользователи с промокодам" },
												{ value: "3", label: "Все пользователи с дополнительным днем" }
											]}
										/>
									</Grid.Column>

									{values.subscribe_type !== null && values.subscribe_type !== "" && (
										<Grid.Column xs={4} lg={4} xl={4}>
											<Field
												component={Fields.Switch}
												name="filter.is_active"
												placeholder="Поиск по id"
												label="Активный"
												className="mb-0 ml-1"
												checked={values.is_active}
												onChange={e => {
													setFieldValue("is_active", +e.target.checked);
												}}
											/>
										</Grid.Column>
									)}
								</Grid.Row>
							)}

							<Grid.Row gutter={12} className="align-center">
								<Grid.Column
									xs={values.subscription_ids !== null && values.subscription_ids !== "" ? 12 : 12}
									lg={values.subscription_ids !== null && values.subscription_ids !== "" ? 12 : 12}
									xl={values.subscription_ids !== null && values.subscription_ids !== "" ? 12 : 12}>
									<Field
										component={Fields.AsyncSelect}
										name="filter.subscription_ids"
										placeholder={t("Выберите тариф")}
										label={t("Выберите тарифы")}
										isClearable={true}
										isSearchable={true}
										isDisabled={values.promoCode && true}
										optionValue="code"
										loadOptionsUrl="/rates"
										className="mb-24"
										optionLabel={`name_ru`}
										onChange={() => {
											setFieldValue("is_active1", 0);
										}}
										loadOptionsParams={name_ru => {
											return {
												extra: { name_ru, include: "ratesPrices" }
											};
										}}
									/>
								</Grid.Column>

								{/* {values.subscription_ids !== null && values.subscription_ids !== "" && (
									<Grid.Column xs={4} lg={4} xl={4}>
										<Field
											component={Fields.Switch}
											name="is_active1"
											placeholder="Поиск по id"
											label="Активный"
											className="mb-0 ml-1"
											checked={values.is_active1}
											onChange={e => {
												setFieldValue("is_active1", +e.target.checked);
											}}
										/>
									</Grid.Column>
								)} */}

								{values.subscription_ids && (
									<Grid.Column xs={12} lg={12} xl={12}>
										<Field
											component={Fields.NewDatePicker}
											name="subscription_start_at"
											type="range"
											isClearable={true}
											placeholder="Дата окончания действия тарифа"
											label="Дата окончания действия тарифа"
											className="mb-0 ml-1"
											onChange={value => {
												setFieldValue("filter.subscription_start_at", value[0]);
												setFieldValue("filter.subscription_end_at", value[1]);
												setFieldValue("subscription_start_at", value[0]);
												setFieldValue("subscription_end_at", value[1]);
											}}
										/>
									</Grid.Column>
								)}
							</Grid.Row>

							<Grid.Row gutter={12} className="align-center">
								<Grid.Column
									xs={values.promocode_ids !== null && values.promocode_ids !== "" ? 12 : 12}
									lg={values.promocode_ids !== null && values.promocode_ids !== "" ? 12 : 12}
									xl={values.promocode_ids !== null && values.promocode_ids !== "" ? 12 : 12}>
									<Field
										component={Fields.AsyncSelect}
										name="filter.promocode_ids"
										placeholder={t("Выберите промокод")}
										label={t("Выберите промокод")}
										isClearable={true}
										isSearchable={true}
										optionValue="code"
										isDisabled={values.tariff_id && true}
										loadOptionsUrl="/promo-code"
										className="mb-24"
										onChange={() => {
											setFieldValue("is_active2", 0);
										}}
										optionLabel={option => <span>{get(option, "code")}</span>}
										loadOptionsParams={title => {
											return {
												extra: { title }
											};
										}}
									/>
								</Grid.Column>

								{/* {values.promocode_ids !== null && values.promocode_ids !== "" && (
									<Grid.Column xs={4} lg={4} xl={4}>
										<Field
											component={Fields.Switch}
											name="is_active2"
											placeholder="Поиск по id"
											label="Активный"
											className="mb-0 ml-1"
											checked={values.is_active2}
											onChange={e => {
												setFieldValue("is_active2", +e.target.checked);
											}}
										/>
									</Grid.Column>
								)} */}
								{values.promocode_ids && (
									<Grid.Column xs={12} lg={12} xl={12}>
										<Field
											component={Fields.NewDatePicker}
											name="promocode_activation_date"
											type="range"
											isClearable={true}
											placeholder="Дата окончания действия промокода"
											label="Дата окончания действия промокода"
											className="mb-0 ml-1"
											onChange={value => {
												setFieldValue("filter.promocode_activation_date", value[0]);
												setFieldValue("filter.promocode_end_date", value[1]);
												setFieldValue("promocode_activation_date", value[0]);
												setFieldValue("promocode_end_date", value[1]);
											}}
										/>
									</Grid.Column>
								)}
							</Grid.Row>

							<Field
								component={Fields.NewDatePicker}
								type="range"
								isClearable={true}
								name="user_register_at"
								maxDate={moment().toDate()}
								label="Дата регистрации пользователей"
								onChange={value => {
									setFieldValue("filter.user_register_at", value);
									setFieldValue("user_register_at", value);
								}}
							/>

							<Field
								component={Fields.NewDatePicker}
								type="range"
								isClearable={true}
								name="user_last_action_at"
								maxDate={moment().toDate()}
								label="Последний действия в приложение"
								onChange={value => {
									setFieldValue("filter.user_last_action_at", value);
									setFieldValue("user_last_action_at", value);
								}}
							/>

							<Field
								component={Fields.Switch}
								name="user_not_full_registered"
								placeholder="Незавершенний регистрирующие пользователи"
								label="Незавершенний регистрирующие пользователи"
								checked={values.user_not_full_registered}
								onChange={e => {
									setFieldValue("filter.user_not_full_registered", +e.target.checked);
								}}
							/>

							<Field
								component={Fields.Switch}
								name="filter.user_has_money"
								placeholder="Наличные деньги в кошельке"
								label="Наличные деньги в кошельке"
								checked={values.user_has_money}
								onChange={e => {
									setFieldValue("filter.user_has_money", +e.target.checked);
								}}
							/>

							<Field
								className="mr-2"
								component={Fields.Select}
								name="user_status"
								label="Системный статус"
								placeholder="Системный статус"
								optionValue="value"
								optionLabel="label"
								isClearable={true}
								options={[
									{ value: "1", label: "Активный" },
									{ value: "0", label: "Неактивный" },
									{ value: "2", label: "Блокирован" }
								]}
							/>

							<Field
								component={Fields.AsyncSelect}
								name="filter.ban_reason_id"
								placeholder="Виберите Причина блокировки"
								label="Причина блокировки"
								isClearable
								isSearchable
								loadOptionsUrl="/reason"
								optionLabel={`title_ru`}
								loadOptionsParams={search => {
									return {
										extra: { name: search }
									};
								}}
							/>
						</>
					)}

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
