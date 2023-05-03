import React, { useEffect } from "react";
import qs from "qs";
import { Field, Form, withFormik } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Fields, Grid, Button } from "components";
import EntityActions from "modules/entity/actions";
import { get } from "lodash";
import { helpers } from "services";
const Filter = ({ handleSubmit, t, history, setFilter, values, setFieldValue }) => {
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
				url: `/categories/${id}`,
				params: {
					filter: { status: 1 }
				},
				cb: {
					success: data => {
						setFieldValue("category_id", data);
					},
					error: error => console.log("error", error)
				}
			})
		);
	};
	const loadInvoicesActors = id => {
		dispatch(
			EntityActions.LoadDefault.request({
				url: `/actors/${id}`,
				params: {
					filter: { type: 1 }
				},
				cb: {
					success: data => {
						setFieldValue("actor_id", data);
					},
					error: error => console.log("error", error)
				}
			})
		);
	};

	useEffect(() => {
		if (values.category_id) {
			loadInvoices(values.category_id.id);
		}
		if (values.actor_id) {
			loadInvoicesActors(values.actor_id.id);
		}
	}, []);

	return (
		<Form className="overflow-y">
			<Grid.Row gutterY={0} className="mt-5">
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="name" placeholder="Поиск по заголовку" label="Зоголовок" />
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Select}
						name="type"
						optionLabel={"type"}
						isClearable={true}
						optionValue={"id"}
						size={"small"}
						options={[
							{ id: "1", type: "Сериал" },
							{ id: "2", type: "Фильмы" },
							{ id: "3", type: "Музыка" },
							{ id: "4", type: "ТВ передачи" }
						]}
						placeholder="Поиск по типу"
						label="Тип"
					/>
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="year" placeholder="Поиск по году" label="Год" />
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Input}
						name="id"
						type="number"
						min="0"
						onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
						placeholder="Поиск по ID"
						label="ID"
					/>
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.AsyncSelect}
						name="actor_id"
						placeholder={t("Выберите актер")}
						label={t("Актеры")}
						isClearable={true}
						isSearchable={true}
						optionValue="id"
						loadOptionsUrl="/actors"
						className="mb-24"
						optionLabel={`name_ru`}
						loadOptionsParams={name => ({
							filter: { type: 1 },
							extra: { name }
						})}
					/>
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

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Select}
						name="paid"
						optionLabel={"type"}
						optionValue="id"
						options={[
							{ id: "1", type: "Платный" },
							{ id: "0", type: "Бесплатно" }
						]}
						isClearable={true}
						placeholder="Платные фильмы"
						label="Платные фильмы"
					/>
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Select}
						name="status"
						optionLabel={"type"}
						optionValue="id"
						isClearable={true}
						options={[
							{ id: "1", type: "Активное" },
							{ id: "0", type: "Неактивный" }
						]}
						placeholder="Активное кино"
						label="Активное кино"
					/>
				</Grid.Column>
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Select}
						name="foreign_status"
						optionLabel={"type"}
						optionValue="id"
						isClearable={true}
						options={[
							{ id: "1", type: "Видно" },
							{ id: "0", type: "Невидно" }
						]}
						placeholder="Смотреть за границей"
						label="Смотреть за границей"
					/>
					<Field
						type="range"
						component={Fields.NewDatePicker}
						name="start"
						isClearable={true}
						label="Дата"
						onChange={value => {
							setFieldValue("start", value);
						}}
					/>

					<Field
						checked={values.recommended}
						component={Fields.Checkbox}
						className="mb-5"
						name="recommended"
						onChange={e => setFieldValue("recommended", e.target.checked)}
						label={t("Рекомендуемые")}
						size="large"
					/>
					<Field
						checked={values.enabled_watermark}
						component={Fields.Checkbox}
						className="mb-5"
						name="enabled_watermark"
						onChange={e => {
							setFieldValue("enabled_watermark", e.target.checked);
						}}
						label={t("Ватермарк")}
						size="large"
					/>

					<Field
						checked={values.foreign_user_can_view}
						component={Fields.Checkbox}
						className="mb-5"
						name="foreign_user_can_view"
						onChange={e => {
							setFieldValue("foreign_user_can_view", e.target.checked);
						}}
						label={t("Видимость для иностранных пользователей")}
						size="large"
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

		const actor_id = params.actor_id
			? {
					id: params.actor_id.split("/")[0],
					["name_ru"]: params.actor_id.split("/")[1]
			  }
			: null;

		return {
			type: params.type || "",
			year: params.year || "",
			name: params.name || "",
			id: params.id || "",
			category_id,
			actor_id,
			recommended: params.recommended || "",
			paid: params.paid || "",
			status: params.status || "",
			enabled_watermark: params.enabled_watermark || "",
			foreign_status: params.foreign_status || "",
			start: params.start || [],
			foreign_user_can_view: params.foreign_user_can_view || ""
		};
	},

	handleSubmit: (values, { props: { location, history, lang, setFilter } }) => {
		const query = qs.parse(location.search, { ignoreQueryPrefix: true });

		values = {
			...values,
			id: values.id ? values.id : "",
			category_id: values.category_id ? values.category_id.id : "",
			actor_id: values.actor_id ? values.actor_id.id : "",
			enabled_watermark: values.enabled_watermark === true ? 1 : "",
			recommended: values.recommended === true ? 1 : "",
			foreign_user_can_view: values.foreign_user_can_view === true ? 1 : "",
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
