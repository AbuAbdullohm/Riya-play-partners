import React, { useEffect } from "react";
import qs from "qs";
import { Field, Form, withFormik } from "formik";
import { withRouter } from "react-router";
import { useDispatch } from "react-redux";
import { withTranslation } from "react-i18next";
import { Fields, Grid, Button } from "components";
import EntityActions from "modules/entity/actions";
import moment from "moment";
import { get } from "lodash";
const Filter = ({ handleSubmit, t, history, setFieldValue, values, setFilter }) => {
	const dispatch = useDispatch();
	const clearForm = () => {
		setFilter(false);
		history.push({
			search: qs.stringify({}, { encode: false })
		});
	};

	const loadFilms = id => {
		dispatch(
			EntityActions.LoadDefault.request({
				url: `/films/${id}`,
				version: "v2",
				params: {},
				cb: {
					success: data => {
						setFieldValue("film_id", data);
					},
					error: error => console.log("error", error)
				}
			})
		);
	};

	useEffect(() => {
		if (values.film_id) {
			loadFilms(values.film_id.film_id);
		}
	}, []);
	return (
		<Form>
			<Grid.Row gutterY={0} className="mt-5">
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="user_id" placeholder="Поиск по ID" label="User ID" />
					<Field
						component={Fields.AsyncSelect}
						name="film_id"
						placeholder="Выберите фильмы"
						label="Фильмы"
						isClearable
						hasMore
						isSearchable
						version="v2"
						loadOptionsUrl="/films"
						optionLabel={`name_ru`}
						loadOptionsParams={search => {
							return {
								extra: { name: search }
								// filter: { status: 1 }
							};
						}}
					/>
					<Field
						name="status"
						component={Fields.Select}
						optionLabel={"name"}
						optionValue="id"
						placeholder="Выберите статус"
						label="Статус комментария"
						isClearable={true}
						options={[
							{ id: "1", name: "Активное" },
							{ id: "0", name: "Неактивный" }
						]}
					/>
					<Field
						type="range"
						component={Fields.NewDatePicker}
						name="created_start"
						maxDate={moment().toDate()}
						isClearable={true}
						label="Дата комментария"
						onChange={value => {
							setFieldValue("created_start", value);
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
		const film_id = params.film_id
			? {
					film_id: params.film_id.split("/")[0],
					name_ru: params.film_id.split("/")[1]
			  }
			: null;

		return {
			user_id: params.user_id || "",
			status: params.status || "",
			film_id,
			created_start: params.created_start || ""
		};
	},
	handleSubmit: (values, { props: { location, history, lang, setFilter } }) => {
		const query = qs.parse(location.search, { ignoreQueryPrefix: true });

		values = {
			...values,
			film_id: values.film_id ? values.film_id.id : "",
			created_start:
				values.created_start.length > 0
					? get(values, "created_start[1]") === get(query, "created_start[1]")
						? values.created_start
						: [...values.created_start.slice(0, 1), values.created_start[1] + 86399]
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
