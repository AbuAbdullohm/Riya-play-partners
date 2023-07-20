import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { constants, api, queryBuilder, helpers } from "services";

const { debounce } = helpers;

const Form = ({ isFetched, isUpdate, isSubmitting, setFieldValue, values, setErrors, errors }) => {
	const { t } = useTranslation();
	const history = useHistory();

	function checkId(value, type) {
		setFieldValue("kinopoisk_id", value);

		if (value && value.length > 3) {
			debounce(
				async () => {
					await api["requestv1"]
						.get(
							queryBuilder("/actors", {
								filter: {
									kinopoisk_id: value,
									external_type: type
								}
							})
						)
						.then(({ data }) => {
							if (data.data && data.data.length > 0) {
								setErrors({
									...errors,
									kinopoisk_id: "Этот ID уже существует"
								});
								setTimeout(() => {
									setFieldValue("kinopoisk_id", "");
								}, 2000);
							}
						});
				},
				"fetch",
				1000
			);
		}
	}

	useEffect(() => {
		checkId(values.kinopoisk_id, values.external_type);
	}, [values.kinopoisk_id, values.external_type]);

	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5">
					<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
						<Grid.Column xs={12} xl={6}>
							<Field component={Fields.Input} name="name_uz" type="text" placeholder="Введите имя" label="Имя (UZ)" />
						</Grid.Column>
						<Grid.Column xs={12} xl={6}>
							<Field component={Fields.Input} name="name_ru" type="text" placeholder="Введите имя" label="Имя (RU)" />
						</Grid.Column>
					</Grid.Row>
					<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
						<Grid.Column xs={12} xl={6}>
							<Field
								component={Fields.Textarea}
								name="bio_uz"
								type="text"
								rows={10}
								label="Полный текст биографии (UZ)"
								placeholder="Введите полный текст биографии (UZ)"
							/>
						</Grid.Column>
						<Grid.Column xs={12} xl={6}>
							<Field
								component={Fields.Textarea}
								name="bio_ru"
								type="text"
								rows={10}
								label="Полный текст биографии (RU)"
								placeholder="Введите полный текст биографии (RU)"
							/>
						</Grid.Column>
						<Grid.Column lg={9}>
							<Field
								component={Fields.Input}
								placeholder={t("Кинопоиск ид")}
								size="large"
								name="kinopoisk_id"
								label={t("Кинопоиск ид")}
								className="mb-24"
							/>
						</Grid.Column>
						<Grid.Column lg={3}>
							<Field
								component={Fields.Select}
								size="large"
								name="external_type"
								label={t("ID тип")}
								placeholder={t("ID тип")}
								className="mb-24"
								optionLabel={"label"}
								optionValue={"value"}
								options={constants.externalTypes}
							/>
						</Grid.Column>
					</Grid.Row>
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Field component={Fields.Input} name="instagram" type="text" placeholder="Введите инстаграм" label="Инстаграм" />
					<Field
						component={Fields.fileUpload}
						name="photo"
						label="Фото"
						items={Array.isArray(get(values, "photo")) ? get(values, "photo") : [get(values, "photo")]}
						onChangeHandler={data => {
							setFieldValue("photo", data);
						}}
						multiple={false}
					/>
					<div className="d-flex justify-between">
						<Field
							component={Fields.Switch}
							name="status"
							label="Статус"
							onChange={() => {
								setFieldValue("status", !values.status);
							}}
						/>
						<Field
							component={Fields.Switch}
							name="type"
							label="Дубляж актеров"
							onChange={() => {
								setFieldValue("type", !values.type);
							}}
						/>
					</div>

					<div className="flex justify-end">
						<Button.Default type="secondary" buttonType="button" onClick={() => history.goBack()}>
							{t("Отменить")}
						</Button.Default>
						<Button.Default type="primary" buttonType="submit" loading={isSubmitting} className="ml-2">
							{isUpdate ? t("Сохранить") : t("Добавить")}
						</Button.Default>
					</div>
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
