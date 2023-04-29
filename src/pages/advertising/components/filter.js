import React, { Component } from "react";
import qs from "qs";
import { Field, withFormik, Form } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { Fields, Grid, Button } from "../../../components";
class Filter extends Component {
	render() {
		const { handleSubmit, t, history, setFilter } = this.props;
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
						<Field component={Fields.Input} name="name" placeholder="Поиск по загаловок" label="Загаловок" />
					</Grid.Column>
					<Grid.Column xs={12} lg={12} xl={12}>
						<Field component={Fields.Input} name="film_name" placeholder="Поиск по фильм" label="Фильм" />
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
	}
}

Filter = withFormik({
	enableReinitialize: true,
	mapPropsToValues: ({ location, lang }) => {
		const params = qs.parse(location.search, { ignoreQueryPrefix: true });

		return {
			name: params.name || "",
			film_id: params.film_name || ""
		};
	},
	handleSubmit: (values, { props: { location, history, lang, setFilter } }) => {
		values = {
			...values
		};
		const query = qs.parse(location.search);

		values = Object.keys({ ...query, ...values }).reduce((prev, curr) => (values[curr] ? { ...prev, [curr]: values[curr] } : { ...prev }), {});
		setFilter(false);
		history.push({
			search: qs.stringify(values, { encode: false })
		});
	}
})(Filter);

export default withRouter(withTranslation("main")(Filter));
