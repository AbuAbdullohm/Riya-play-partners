import React from "react";
import qs from "qs";
import { Field, Form, withFormik } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { Fields, Grid, Button } from "../../../components";
import moment from "moment";
import { get } from "lodash";
const Filter = ({ handleSubmit, t, history, setFilter, values, setFieldValue }) => {
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
					<Field component={Fields.Input} name="name" placeholder="Поиск по заголовку" label="Загаловок" />
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="film_name" placeholder="Поиск по фильмам" label="Фильм" />

					<Field
						component={Fields.NewDatePicker}
						name="start"
						type="range"
						isClearable={true}
						label="Дата просмотров"
						maxDate={moment().toDate()}
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

		return {
			name: params.name || "",
			film_name: params.film_name || "",
			start: params.start || ""
		};
	},
	handleSubmit: (values, { props: { location, history, lang, setFilter } }) => {
		const query = qs.parse(location.search);
		values = {
			...values,
			start:
				values.start.length > 0
					? get(values, "start[1]") === get(query, "start[1]")
						? values.start
						: [...values.start.slice(0, 1), values.start[1] + 86399]
					: ""
		};

		values = Object.keys({ ...query, ...values }).reduce((prev, curr) => (values[curr] ? { ...prev, [curr]: values[curr] } : { ...prev }), {});
		setFilter(false);
		history.push({
			search: qs.stringify(values, { encode: false })
		});
	}
})(Filter);

export default withRouter(withTranslation("main")(EnhancedForm));
