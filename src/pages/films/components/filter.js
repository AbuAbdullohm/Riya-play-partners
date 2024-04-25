import React, { useEffect } from "react";
import qs from "qs";
import { Field, Form, withFormik } from "formik";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Fields, Grid, Button } from "components";
import EntityActions from "modules/entity/actions";
import { get } from "lodash";
import { helpers, constants } from "services";

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

	const loadInvoicesCompany = id => {
		dispatch(
			EntityActions.LoadDefault.request({
				url: `/company/${id}`,
				params: {
					filter: { type: 1 }
				},
				cb: {
					success: data => {
						setFieldValue("company_id", data);
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
		if (values.company_id) {
			loadInvoicesCompany(values.company_id.id);
		}
	}, []);

	return (
		<Form className="overflow-y">
			<Grid.Row gutterY={0} className="mt-5">
				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Input}
						name="id"
						type="number"
						min="0"
						onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
						placeholder="Системный ID"
						label="ID"
					/>
				</Grid.Column>
				<Grid.Column xs={4} lg={4} xl={4}>
					<Field
						component={Fields.Select}
						size="large"
						name="external_type"
						label={t("Тип медиа ID")}
						placeholder={t("Тип медиа ID")}
						className="mb-24"
						optionLabel={"label"}
						optionValue={"value"}
						options={constants.externalTypes}
					/>
				</Grid.Column>
				<Grid.Column xs={8} lg={8} xl={8}>
					<Field
						component={Fields.Input}
						name="kinopoisk_id"
						disabled={values.external_type ? false : true}
						type="number"
						min="0"
						onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
						placeholder="Медиа ID"
						label="Медиа ID"
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.AsyncSelect}
						name="holder_id"
						placeholder={t("Правообладатель")}
						label={t("Правообладатель")}
						isClearable
						isSearchable
						hasMore
						loadOptionsUrl="/holder"
						className="mb-24"
						version={"v3"}
						optionLabel={"title_ru"}
						optionValue={"id"}
						loadOptionsParams={search => {
							return {
								extra: { title: search }
							};
						}}
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="name" placeholder="Название" label="Название" />
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
						placeholder="Тип медиаконтента"
						label="Тип медиаконтента"
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="year" placeholder="Год выпуска" label="Год выпуска" />
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.AsyncSelect}
						name="country_id"
						placeholder={t("Выберите страну")}
						label={t("Страна")}
						isClearable
						isSearchable
						hasMore
						loadOptionsUrl="/country"
						className="mb-24"
						optionLabel={`name_ru`}
						optionValue={`id`}
						loadOptionsParams={search => {
							return {
								sort: "name",
								extra: { name: search }
							};
						}}
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.AsyncSelect}
						name="company_id"
						placeholder={t("Кинокомпания")}
						label={t("Кинокомпания")}
						isClearable
						isSearchable
						hasMore
						loadOptionsUrl="/company"
						className="mb-24"
						optionLabel={`title`}
						loadOptionsParams={search => {
							return {
								filter: { status: 1 },
								extra: { title: search }
							};
						}}
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.AsyncSelect}
						name="genres"
						placeholder={t("Жанры")}
						label={t("Жанры")}
						isClearable
						isSearchable
						loadOptionsUrl="/genres"
						className="mb-24"
						optionLabel={`name_ru`}
						loadOptionsParams={search => {
							return {
								extra: { name: search },
								filter: { status: 1 }
							};
						}}
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.AsyncSelect}
						name="maker_id"
						placeholder={t("Режиссер")}
						label={t("Режиссер")}
						isClearable={true}
						isSearchable={true}
						optionValue="id"
						loadOptionsUrl="/makers"
						className="mb-24"
						optionLabel={`name_ru`}
						loadOptionsParams={name => ({
							extra: { name }
						})}
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
							extra: { name }
						})}
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="age_limit" placeholder="Возрастное ограничение" label="Возрастное ограничение" />
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="kinopoisk_rating" placeholder="Рейтинг в Кинопоиске" label="Рейтинг в Кинопоиске" />
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="imdb_rating" placeholder="Рейтинг в IMDB" label="Рейтинг в IMDB" />
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field component={Fields.Input} name="riyaplay_rating" placeholder="Рейтинг в RiyaPlay" label="Рейтинг в RiyaPlay" />
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						name="thriller"
						label={t("Доступность трейлера в альбоме")}
						placeholder={t("Доступность трейлера в альбоме")}
						component={Fields.Select}
						optionLabel={"label"}
						isClearable={true}
						optionValue={"id"}
						size={"small"}
						options={[
							{ id: "0", label: "Недоступно" },
							{ id: "1", label: "Доступно" }
						]}
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
							{ id: "0", type: "Недоступно" },
							{ id: "1", type: "Доступно" }
						]}
						placeholder="Доступность просмотра за границей"
						label="Доступность просмотра за границей"
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						checked={values.foreign_user_can_view}
						component={Fields.Switch}
						className="mb-5"
						name="foreign_user_can_view"
						onChange={e => {
							setFieldValue("foreign_user_can_view", e.target.checked);
						}}
						label={t("Доступно просмотр для иностранный пользователя")}
						size="large"
					/>
					<Field
						className="mr-2"
						component={Fields.Switch}
						name="visible_web"
						label="Разрешен просмотр на вебсайте"
						onChange={() => setFieldValue("visible_web", !values.visible_web)}
						checked={values.visible_web}
					/>
					<Field
						className="mr-2"
						component={Fields.Switch}
						name="visible_tv"
						label="Разрешен просмотр на TV приложение"
						onChange={() => setFieldValue("visible_tv", !values.visible_tv)}
						checked={values.visible_tv}
					/>
					<Field
						className="mr-2"
						component={Fields.Switch}
						name="visible_mobile"
						label="Разрешен просмотр на мобильное приложение"
						onChange={() => setFieldValue("visible_mobile", !values.visible_mobile)}
						checked={values.visible_mobile}
					/>
					<Field
						checked={values.enabled_watermark}
						component={Fields.Switch}
						className="mb-5"
						name="enabled_watermark"
						onChange={e => {
							setFieldValue("enabled_watermark", e.target.checked);
						}}
						label={t("Подключить защиту (Ватермарк) на контент")}
						size="large"
					/>
					<Field
						checked={values.recommended}
						component={Fields.Switch}
						className="mb-5"
						name="recommended"
						onChange={e => setFieldValue("recommended", e.target.checked)}
						label={t("Рекомендуемый альбом")}
						size="large"
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.Select}
						name="tariff"
						optionLabel={"label"}
						optionValue="id"
						isClearable={true}
						options={[
							{ id: "1", label: "Существуют-платный контент" },
							{ id: "0", label: "Не существуют-бесплатный контент" }
						]}
						placeholder="Требования по тарифу"
						label="Требования по тарифу"
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						component={Fields.AsyncSelect}
						name="category_id"
						placeholder={t("Коллекция контента/Категория")}
						label={t("Коллекция контента/Категория")}
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
						type="range"
						component={Fields.NewDatePicker}
						name="start"
						isClearable={true}
						label="Дата создания альбома"
						onChange={value => {
							setFieldValue("start", value);
						}}
					/>
				</Grid.Column>

				<Grid.Column xs={12} lg={12} xl={12}>
					<Field
						type="range"
						component={Fields.NewDatePicker}
						name="updated_at"
						isClearable={true}
						label="Дата обновления альбома"
						onChange={value => {
							setFieldValue("updated_at", value);
						}}
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
						placeholder="Системный статус"
						label="Системный статус"
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

		const company_id = params.company_id
			? {
					id: params.company_id.split("/")[0],
					[`title`]: params.company_id.split("/")[1]
			  }
			: null;

		const actor_id = params.actor_id
			? {
					id: params.actor_id.split("/")[0],
					name_ru: params.actor_id.split("/")[1]
			  }
			: null;

		return {
			id: params.id || "",
			external_type: params.external_type,
			kinopoisk_id: params.kinopoisk_id || "",
			holder_id: params.holder_id || "",
			name: params.name || "",
			type: params.type || "",
			year: params.year || "",
			country_id: params.country_id || "",
			company_id,
			genres: params.genres || "",
			maker_id: params.maker_id || "",
			actor_id,
			age_limit: params.age_limit || "",
			kinopoisk_rating: params.kinopoisk_rating || "",
			imdb_rating: params.imdb_rating || "",
			riyaplay_rating: params.riyaplay_rating || "",
			thriller: params.thriller || "",
			visible_web: params.visible_web || "",
			visible_tv: params.visible_tv || "",
			visible_mobile: params.visible_mobile || "",
			visible: params.visible || "",
			tariff: params.tariff || "",
			category_id,
			recommended: params.recommended || "",
			paid: params.paid || "",
			status: params.status || "",
			enabled_watermark: params.enabled_watermark || "",
			foreign_status: params.foreign_status || "",
			start: params.start || [],
			updated_at: params.updated_at || [],
			foreign_user_can_view: params.foreign_user_can_view || ""
		};
	},

	handleSubmit: (values, { props: { location, history, lang, setFilter } }) => {
		const query = qs.parse(location.search, { ignoreQueryPrefix: true });

		values = {
			...values,
			id: values.id ? values.id : "",
			external_type: values.external_type ? values.external_type : "",
			kinopoisk_id: values.kinopoisk_id ? values.kinopoisk_id : "",
			holder_id: values.holder_id ? values.holder_id.id : "",
			name: values.name ? values.name : "",
			type: values.type ? values.type : "",
			year: values.year ? values.year : "",
			country_id: values.country_id ? values.country_id.id : "",
			company_id: values.company_id ? values.company_id.id : "",
			genres: values.genres ? values.genres.id : "",
			maker_id: values.maker_id ? values.maker_id.id : "",
			actor_id: values.actor_id ? values.actor_id.id : "",
			age_limit: values.age_limit ? values.age_limit : "",
			thriller: values.thriller ? values.thriller : "",
			visible_web: values.visible_web ? 1 : "",
			visible_tv: values.visible_tv ? 1 : "",
			visible_mobile: values.visible_mobile ? 1 : "",
			tariff: values.tariff ? values.tariff : "",
			visible: values.visible || "",
			category_id: values.category_id ? values.category_id.id : "",
			enabled_watermark: values.enabled_watermark === true ? 1 : "",
			recommended: values.recommended === true ? 1 : "",
			foreign_user_can_view: values.foreign_user_can_view === true ? 1 : "",
			start:
				values.start.length > 0
					? get(values, "start[1]") === get(query, "start[1]")
						? values.start
						: [...values.start.slice(0, 1), values.start[1] + 86399]
					: "",
			updated_at:
				values.updated_at.length > 0
					? get(values, "updated_at[1]") === get(query, "updated_at[1]")
						? values.updated_at
						: [...values.updated_at.slice(0, 1), values.updated_at[1] + 86399]
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
