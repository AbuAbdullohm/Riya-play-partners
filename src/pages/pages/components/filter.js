import React from "react";
import qs from "qs";
import { Field, Form, withFormik } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { Fields, Grid, Button } from "components";
import { useLocation } from "react-router-dom";
const Filter = ({ handleSubmit, t, history, setFilter }) => {
	const location = useLocation();
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const clearForm = () => {
		setFilter(false);
		let newQs = {};
		for (const key in params) {
			if (Object.hasOwnProperty.call(params, key)) {
				const element = params[key];
				if (params.lang) {
					if (key !== "lang=uz" && key !== "lang=ru") {
						newQs = { [key]: element };
					}
				} else {
					newQs = {};
				}
			}
		}
		history.push({
			search: qs.stringify(newQs, { encode: false })
		});
	};
	return (
		<Form>
			<Grid.Row gutterY={0} className="mt-5">
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="title" placeholder="Поиск по заголовку" label="Зоголовок" />
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
			title: params.title || ""
		};
	},
	handleSubmit: (values, { props: { location, history, lang, setFilter } }) => {
		values = {
			...values,
			lang
		};
		const query = qs.parse(location.search);

		values = Object.keys({ ...query, ...values }).reduce((prev, curr) => (values[curr] ? { ...prev, [curr]: values[curr] } : { ...prev }), {});
		setFilter(false);
		history.push({
			search: qs.stringify(values, { encode: false })
		});
	}
})(Filter);

export default withRouter(withTranslation("main")(EnhancedForm));
