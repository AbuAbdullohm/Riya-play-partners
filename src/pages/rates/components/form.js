import React from "react";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { helpers } from "services";
import { get } from "lodash";

const Form = ({ isUpdate, isSubmitting, setFieldValue, values, lang = "ru" }) => {
	const { t } = useTranslation();
	const history = useHistory();

	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10 rates-form"}>
			<Grid.Column md={12} gutter={10}>
				<Panel>
					<Grid.Row gutter={10} gutterX={4}>
						<Grid.Column>
							<Field
								component={Fields.fileUpload}
								name="logo"
								label={"Изображение на заднем плане"}
								items={get(values, "logo")}
								onChangeHandler={data => {
									setFieldValue("logo", data);
								}}
							/>
						</Grid.Column>
						<Grid.Column sm={6} gutter={10}>
							<Field component={Fields.Input} name="name_uz" type="text" placeholder="Введите загаловок" label="Заголовок (УЗ)" size="large" />
							<Field component={Fields.Textarea} name="description_uz" type="text" label="Описание (УЗ)" placeholder="Введите описание" />
						</Grid.Column>
						<Grid.Column sm={6} gutter={10}>
							<Field component={Fields.Input} name="name_ru" type="text" placeholder="Введите загаловок" label="Заголовок (РУ)" size="large" />
							<Field component={Fields.Textarea} name="description_ru" type="text" label="Описание (РУ)" placeholder="Введите описание" />
						</Grid.Column>
					</Grid.Row>
					<Field
						component={Fields.Input}
						name="sort"
						type="number"
						onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
						placeholder="Введите сортировку"
						min="0"
						label="Сорт"
						size="large"
						className={"mb-2"}
					/>
					<Field
						component={Fields.AsyncSelect}
						name="holders"
						placeholder={t("Выберите правообладатель")}
						label={t("Правообладатель")}
						isClearable={true}
						isSearchable={true}
						isMulti={true}
						loadOptionsUrl="/holder"
						version="v3"
						className="mb-24"
						optionLabel={`title_${lang}`}
						loadOptionsParams={title => {
							return {
								filter: { status: 1 },
								extra: { title }
							};
						}}
					/>

					<div className="d-flex align-items-center">
						<Field
							className="mr-2"
							component={Fields.Switch}
							name="is_foreign"
							label="Для иностранных пользователей"
							onChange={() => setFieldValue("is_foreign", !values.is_foreign)}
							checked={values.is_foreign}
						/>
					</div>

					<div className="d-flex align-items-center">
						<Field
							className="mr-2"
							component={Fields.Switch}
							name="status"
							label="Активный статус"
							onChange={() => setFieldValue("status", !values.status)}
							checked={values.status}
						/>
					</div>
				</Panel>
			</Grid.Column>

			<Grid.Column md={12}>
				<h1 className="title">Тарифные цены</h1>
			</Grid.Column>

			{values.ratesPrices &&
				values.ratesPrices.map((item, i) => {
					return (
						<Grid.Column key={i} md={4} gutter={10} className="rate-column">
							<Button.Outline
								type="danger"
								className="remove-btn"
								onClick={() => {
									setFieldValue(
										"ratesPrices",
										values.ratesPrices.filter((r, index) => index !== i)
									);
								}}>
								x
							</Button.Outline>

							<Panel>
								<Field
									component={Fields.Input}
									name={`ratesPrices[${i}].price`}
									type="number"
									onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
									placeholder="Введите цену"
									min="0"
									label="Цена"
									size="large"
									className={"mb-1"}
								/>
								<Field
									component={Fields.Input}
									name={`ratesPrices[${i}].days`}
									onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
									type="number"
									placeholder="Введите дней"
									min="0"
									label="Дни"
									size="large"
									className={"mb-1"}
								/>

								<Field
									component={Fields.Input}
									name={`ratesPrices[${i}].device_count`}
									onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
									type="number"
									placeholder="Введите кол-во"
									min="0"
									label="Количество устройств"
									size="large"
									className={"mb-1"}
								/>
								<Field
									component={Fields.Checkbox}
									name={`ratesPrices[${i}].top`}
									onChange={e => setFieldValue(`ratesPrices[${i}].top`, e.target.checked)}
									label="Топ"
									min="0"
									size="large"
									className={"mb-1"}
								/>
							</Panel>
						</Grid.Column>
					);
				})}

			<Grid.Column md={4}>
				<Button.Outline
					style={{ width: "100%", height: "100%", minHeight: 200 }}
					buttonType="button"
					type="primary"
					onClick={() => {
						setFieldValue("ratesPrices", [
							...values.ratesPrices,
							{
								days: 0,
								price: 0,
								device_count: 0
							}
						]);
					}}>
					+ Добавить
				</Button.Outline>
			</Grid.Column>
			<Grid.Column md={12}>
				<Panel>
					<div className="flex justify-end">
						<Button.Default type="secondary" buttonType="button" onClick={() => history.goBack()}>
							{t("Отменить")}
						</Button.Default>
						<Button.Default type="primary" buttonType="submit" loading={isSubmitting}>
							{isUpdate ? t("Сохранить") : t("Добавить")}
						</Button.Default>
					</div>
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
