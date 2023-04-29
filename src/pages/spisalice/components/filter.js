import React from "react";
import qs from "qs";
import { Field, Form, withFormik } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { Fields, Grid, Button } from "components";
import { helpers } from "services";
import { useAccess } from "hooks";
const Filter = ({ handleSubmit, t, history, setFilter }) => {
	const isAdmin = useAccess({ roles: ["admin"] });

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
					<Field component={Fields.Input} name="username" placeholder="Поиск по заголовку" label="Заголовок" />
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Select}
						name="role"
						options={isAdmin ? helpers.adminRoles : helpers.userRoles}
						optionValue="value"
						optionLabel="label"
						isClearable={true}
						isSearchable={false}
						label="Роль"
						placeholder="Выберите роль"
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
			role: params.role || "",
			username: params.username || ""
		};
	},

	handleSubmit: (values, { props: { location, history, lang, setFilter } }) => {
		const query = qs.parse(location.search, { ignoreQueryPrefix: true });

		values = Object.keys({ ...query, ...values }).reduce((prev, curr) => (values[curr] ? { ...prev, [curr]: values[curr] } : { ...prev }), {});
		setFilter(false);
		history.push({
			search: qs.stringify(values, { encode: false })
		});
	}
})(Filter);

export default withRouter(withTranslation("main")(EnhancedForm));
