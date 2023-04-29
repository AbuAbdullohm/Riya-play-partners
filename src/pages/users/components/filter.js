import React from "react";
import qs from "qs";
import { Field, withFormik, Form } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { Fields, Grid, Button } from "components";

import moment from "moment";
import { get } from "lodash";

const Filter = ({ handleSubmit, t, history, setFilter, values, setFieldValue, filter }) => {
	const clearForm = () => {
		setFilter(false);
		history.push({
			search: qs.stringify({}, { encode: false })
		});
	};

	return (
		<Form>
			<Grid.Row gutterY={0} className="mt-5">
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="name" placeholder="Полное имя" label="Полное имя" />
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="phone" placeholder="Поиск по телефонуу" label="Телефон" />
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="id" placeholder="Поиск по id" label="Id" />
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Select}
						name="status"
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
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Grid.Row gutter={0} className="align-center">
						<Grid.Column
							xs={values.subscribe_type !== null && values.subscribe_type !== "" ? 8 : 12}
							lg={values.subscribe_type !== null && values.subscribe_type !== "" ? 8 : 12}
							xl={values.subscribe_type !== null && values.subscribe_type !== "" ? 8 : 12}>
							<Field
								component={Fields.Select}
								name="subscribe_type"
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
									name="is_active"
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
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Grid.Row gutter={0} className="align-center">
						<Grid.Column
							xs={values.tariff_id !== null && values.tariff_id !== "" ? 8 : 12}
							lg={values.tariff_id !== null && values.tariff_id !== "" ? 8 : 12}
							xl={values.tariff_id !== null && values.tariff_id !== "" ? 8 : 12}>
							<Field
								component={Fields.AsyncSelect}
								name="tariff_id"
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
										extra: { name_ru }
									};
								}}
							/>
						</Grid.Column>
						{values.tariff_id !== null && values.tariff_id !== "" && (
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
						)}
					</Grid.Row>
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Grid.Row gutter={0} className="align-center">
						<Grid.Column
							xs={values.promoCode !== null && values.promoCode !== "" ? 8 : 12}
							lg={values.promoCode !== null && values.promoCode !== "" ? 8 : 12}
							xl={values.promoCode !== null && values.promoCode !== "" ? 8 : 12}>
							<Field
								component={Fields.AsyncSelect}
								name="promoCode"
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
						{values.promoCode !== null && values.promoCode !== "" && (
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
						)}
					</Grid.Row>
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Select}
						name="balance_filter"
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
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.NewDatePicker}
						type="range"
						isClearable={true}
						name="user_created"
						maxDate={moment().toDate()}
						label="Дата регистрации пользователей"
						onChange={value => {
							setFieldValue("user_created", value);
						}}
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						type="range"
						component={Fields.NewDatePicker}
						name="rates_start"
						isClearable={true}
						maxDate={moment().toDate()}
						label="Дата активации тарифа"
						onChange={value => {
							setFieldValue("rates_start", value);
						}}
					/>
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.NewDatePicker}
						type="range"
						isClearable={true}
						name="rates_finish"
						label="Дата окончания действия тарифа"
						onChange={value => {
							setFieldValue("rates_finish", value);
						}}
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Switch}
						name="balance"
						placeholder="Поиск по id"
						label="Баланс"
						checked={values.balance}
						onChange={e => {
							setFieldValue("balance", +e.target.checked);
						}}
					/>
				</Grid.Column>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column className="flex justify-end mt-0">
					<Button.Default type="secondary" onClick={clearForm}>
						{t("Очистить фильтр")}
					</Button.Default>
					<Button.Default type="primary" buttonType="submit" className="ml-2" onClick={handleSubmit}>
						{t("Фильтровать")}
					</Button.Default>
				</Grid.Column>
			</Grid.Row>
		</Form>
	);
};

const EnhancedForm = withFormik({
	enableReinitialize: true,
	mapPropsToValues: ({ location, lang }) => {
		const params = qs.parse(location.search, { ignoreQueryPrefix: true });
		const promoCode = params.promoCode
			? {
					id: params.promoCode,
					code: params.promoTitle
			  }
			: null;

		const tariff_id = params.tariff_id
			? {
					id: params.tariff_id,
					name_ru: params.ratesTitle
			  }
			: null;

		return {
			phone: params.phone && params.phone,
			id: params.id && params.id,
			balance: params.balance && params.balance,
			status: params.status && params.status,
			name: params.name && params.name,
			balance_filter: params.balance_filter && params.balance_filter,
			promoCode,
			tariff_id,
			subscribe_type: params.subscribe_type ? params.subscribe_type : "",
			rates_start: params.rates_start ? params.rates_starts : "",
			rates_finish: params.rates_finish ? params.rates_finish : "",
			user_created: params.user_created ? params.user_created : "",
			last_subscribe: params.last_subscribe ? params.last_subscribe : "",
			is_active: params.is_active && params.is_active,
			is_active1: params.is_active1 && params.is_active1,
			is_active2: params.is_active2 && params.is_active2
		};
	},

	handleSubmit: (values, { props: { location, history, lang, setFilter, filter } }) => {
		const query = qs.parse(location.search, { ignoreQueryPrefix: true });
		values = {
			...values,
			promoCode: get(values, "promoCode") ? get(values, "promoCode.id") : "",
			promoTitle: get(values, "promoCode") ? get(values, "promoCode.code") : "",
			ratesTitle: get(values, "tariff_id.name_ru") && get(values, "tariff_id.name_ru"),
			tariff_id: get(values, "tariff_id.id") && get(values, "tariff_id.id"),
			user_created:
				values.user_created.length > 0
					? get(values, "user_created[1]") === get(query, "user_created[1]")
						? values.user_created
						: [...values.user_created.slice(0, 1), values.user_created[1] + 86399]
					: "",
			rates_start:
				values.rates_start.length > 0
					? get(values, "rates_start[1]") === get(query, "rates_start[1]")
						? values.rates_start
						: [...values.rates_start.slice(0, 1), values.rates_start[1] + 86399]
					: "",
			rates_finish:
				values.rates_finish.length > 0
					? get(values, "rates_finish[1]") === get(query, "rates_finish[1]")
						? values.rates_finish
						: [...values.rates_finish.slice(0, 1), values.rates_finish[1] + 86399]
					: ""
		};

		values = Object.keys({ ...query, ...values }).reduce((prev, curr) => (values[curr] ? { ...prev, [curr]: values[curr] } : { ...prev }), {});
		setFilter(!filter);
		history.push({ search: qs.stringify(values, { encode: false }) });
	}
})(Filter);

export default withRouter(withTranslation("main")(EnhancedForm));
