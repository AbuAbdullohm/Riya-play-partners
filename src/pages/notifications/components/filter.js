import React from "react";
import qs from "qs";
import { Field, Form, withFormik } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { Fields, Grid, Button } from "../../../components";
import { constants } from "services";

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
					<Field component={Fields.Input} name="title" placeholder="Поиск по Загаловок" label="Загаловок" />
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Select}
						name="type"
						size="small"
						placeholder="Поиск по тип"
						label="Тип"
						optionLabel={"label"}
						optionValue={"value"}
						options={constants.notificationTypes}
					/>
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.NewDatePicker}
						name="date"
						label="Дата"
						onChange={value => {
							history.push({
								search: qs.stringify({ date: value, ...qs.parse(history.location.search, { ignoreQueryPrefix: true }) }, { encode: false })
							});
						}}
					/>
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Select}
						name="status"
						size="small"
						placeholder="Поиск по статус"
						label="Статус"
						optionLabel={"label"}
						optionValue={"value"}
						options={[
							{
								label: "Активный",
								value: "1"
							},
							{
								label: "Неактивный",
								value: "0"
							}
						]}
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
			title: params.title || "",
			date: params.date || "",
			type: params.type || "",
			status: params.status
		};
	},
	handleSubmit: (values, { props: { location, history, lang, setFilter } }) => {
		values = {
			...values,
			title: values.title,
			date: values.date,
			type: values.type,
			status: values.status
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
