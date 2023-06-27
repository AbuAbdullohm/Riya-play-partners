import React, { useEffect } from "react";
import qs from "qs";

import { Field, withFormik, Form } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { Fields, Grid, Button } from "components";
import { useDispatch } from "react-redux";
import EntityActions from "modules/entity/actions";
import { get } from "lodash";

const Filter = ({ handleSubmit, t, history, setFilter, setFieldValue, values }) => {
	const dispatch = useDispatch();
	const clearForm = () => {
		setFilter(false);
		history.push({
			search: qs.stringify({}, { encode: false })
		});
	};
	const loadInvoices = id => {
		dispatch(
			EntityActions.LoadDefault.request({
				url: `/rates/${id}`,
				params: {
					filter: { status: 1 }
				},
				cb: {
					success: data => {
						setFieldValue("invoice_id", data);
					},
					error: error => console.log("error", error)
				}
			})
		);
	};

	useEffect(() => {
		if (values.invoice_id) {
			loadInvoices(values.invoice_id.id);
		}
	}, []);

	return (
		<Form>
			<Grid.Row gutterY={0} className="mt-5">
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="phone" placeholder="Выберите тарифы" label="Телефон" />
					<Field component={Fields.Input} name="user_id" placeholder="Поиск по ID" label="ID пользователя" />
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.AsyncSelect}
						name="invoice_id"
						placeholder="Выберите тарифы"
						label="Тарифы"
						isClearable
						hasMore
						isSearchable
						loadOptionsUrl="/rates"
						optionLabel={`name_ru`}
						loadOptionsParams={search => {
							return {
								extra: { name: search }
							};
						}}
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Select}
						name="type"
						isClearable
						placeholder="Поиск по типу"
						label="	Тип трансакция"
						optionLabel="name"
						options={[
							{ id: "1", name: "Кирим (Hisob to'ldirish)" },
							{ id: "2", name: "Чиким (Obuna olish)" }
						]}
					/>
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					{/* <Field component={Fields.Input} name="payment_method" placeholder="Поиск по способ оплаты" label="Способ оплаты" /> */}
					<Field
						component={Fields.Select}
						name="payment_method"
						isClearable
						placeholder="Поиск по способу оплаты"
						label="Способ оплаты"
						optionLabel="name"
						options={[
							{ id: "from api", name: "Riya Play" },
							{ id: "payme", name: "Payme" },
							{ id: "apelsin", name: "Uzum" },
							{ id: "paynet", name: "Paynet" },
							{ id: "click", name: "Click" },
							{ id: "upay", name: "Upay" }
						]}
					/>
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12} className="mb-5">
					<Field
						component={Fields.NewDatePicker}
						name="start"
						type="range"
						isClearable={true}
						label="Дата"
						maxDate={new Date()}
						onChange={value => {
							setFieldValue("start", value);
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
		const invoice_id = params.invoice_id
			? {
					id: params.invoice_id.split("/")[0],
					[`name_ru`]: params.invoice_id.split("/")[1]
			  }
			: null;
		return {
			phone: params.phone || "",
			invoice_id,
			type: params.type || "",
			payment_method: params.payment_method || "",
			user_id: params.user_id || "",
			start: params.start || ""
		};
	},

	handleSubmit: (values, { props: { location, history, lang, setFilter } }) => {
		const query = qs.parse(location.search, { ignoreQueryPrefix: true });
		values = {
			...values,
			invoice_id: values.invoice_id ? values.invoice_id.id : "",
			start:
				values.start.length > 0
					? get(values, "start[1]") === get(query, "start[1]")
						? values.start
						: [...values.start.slice(0, 1), values.start[1] + 86399]
					: ""
		};
		values = Object.keys({ ...query, ...values }).reduce((prev, curr) => (values[curr] ? { ...prev, [curr]: values[curr] } : { ...prev }), {});
		setFilter(false);
		history.push({ search: qs.stringify(values, { encode: false }) });
	}
})(Filter);

export default withRouter(withTranslation("main")(EnhancedForm));
