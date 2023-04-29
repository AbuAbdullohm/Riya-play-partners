import React from "react";
import qs from "qs";
import { Field, Form, withFormik } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { Fields, Grid, Button } from "components";

const Filter = ({ handleSubmit, setFieldValue, t, history, setFilter }) => {
	const clearForm = () => {
		setFilter(false);
		setFieldValue("publish_time", 0);
		history.push({
			search: qs.stringify({}, { encode: false })
		});
	};

	return (
		<Form>
			<Grid.Row gutterY={0} className="mt-5">
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="title" placeholder="Поиск по заголовку" label="Заголовок" />
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.AsyncSelect}
						name="category_id"
						placeholder={t("Выберите категорию")}
						label={t("Категория")}
						isClearable={true}
						isSearchable={false}
						optionValue="id"
						loadOptionsUrl="/categories"
						className="mb-24"
						optionLabel={`title_ru`}
						loadOptionsParams={title_ru => {
							return {
								filter: { status: 1 },
								extra: { title_ru }
							};
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

		const category_id = params.category_id
			? {
					id: params.category_id.split("/")[0],
					[`title_ru`]: params.category_id.split("/")[1]
			  }
			: null;

		return {
			title: params.title || "",
			category_id
		};
	},

	handleSubmit: (values, { props: { location, history, lang, setFilter } }) => {
		const query = qs.parse(location.search);
		values = {
			...values,
			lang,
			category_id: values.category_id ? values.category_id.id + "/" + values.category_id[`title_ru`] : ""
		};

		values = Object.keys({ ...query, ...values }).reduce((prev, curr) => (values[curr] ? { ...prev, [curr]: values[curr] } : { ...prev }), {});
		setFilter(false);
		history.push({
			search: qs.stringify(values, { encode: false })
		});
	}
})(Filter);

export default withRouter(withTranslation("main")(EnhancedForm));
