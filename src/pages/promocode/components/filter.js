import React from "react";
import qs from "qs";
import { Field, Form, withFormik } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { Fields, Grid, Button } from "components";

const Filter = ({ handleSubmit, t, history, setFieldValue, setFilter, values }) => {
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
					<Field component={Fields.Input} name="title_ru" placeholder="Поиск по имени" label="Имя" />
					<Field
						component={Fields.Select}
						name="status"
						isClearable
						placeholder="Поиск по статусу"
						label="Статус"
						optionValue="value"
						optionLabel="name"
						options={[
							{ id: 1, value: "1", name: "Активный" },
							{ id: 2, value: "0", name: "Неактивный" }
						]}
					/>
					{/* ?  : "" */}
					<Field
						component={Fields.NewDatePicker}
						name="date_to"
						isClearable={true}
						label="Дата окончания"
						onChange={value => {
							setFieldValue("date_to", value);
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

		return {
			title: params.title_ru || "",
			status: params.status || "",
			date_to: params.date_to || ""
		};
	},
	handleSubmit: (values, { props: { location, history, lang, setFilter } }) => {
		values = {
			...values
			// date_to: values.date_to ? moment(values.date_to).unix() : ""
		};
		const query = qs.parse(location.search);
		setFilter(false);
		values = Object.keys({ ...query, ...values }).reduce((prev, curr) => (values[curr] ? { ...prev, [curr]: values[curr] } : { ...prev }), {});

		history.push({
			search: qs.stringify(values, { encode: false })
		});
	}
})(Filter);

export default withRouter(withTranslation("main")(EnhancedForm));
