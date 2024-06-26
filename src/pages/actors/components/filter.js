import React from "react";
import qs from "qs";
import { Field, Form, withFormik } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { Fields, Grid, Button } from "components";
import { helpers, constants } from "services";

const Filter = ({ handleSubmit, t, history, setFilter }) => {
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
					<Field component={Fields.Input} name="name" placeholder="Поиск по имени" label="Имя" />
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="id" placeholder="Поиск по id" label="ID" />
				</Grid.Column>
				<Grid.Column xs={8} lg={8} xl={8}>
					<Field
						component={Fields.Input}
						name="kinopoisk_id"
						type="number"
						min="0"
						onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
						placeholder="Поиск по кинопоиск ID"
						label="Кинопоиск ID"
					/>
				</Grid.Column>
				<Grid.Column xs={4} lg={4} xl={4}>
					<Field
						component={Fields.Select}
						size="large"
						name="external_type"
						label={t("тип")}
						placeholder={t("тип")}
						className="mb-24"
						optionLabel={"label"}
						optionValue={"value"}
						options={constants.externalTypes}
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
			id: params.id || "",
			kinopoisk_id: params.kinopoisk_id,
			external_type: params.external_type
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

export default withRouter(withTranslation("main")(EnhancedForm));
