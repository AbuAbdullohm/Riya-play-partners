import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button, Loader } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { constants } from "services";

const Form = ({ isFetched, isUpdate, isSubmitting, setFieldValue, values, setErrors, errors }) => {
	const { t } = useTranslation();
	const history = useHistory();

	if (!isFetched) return <Loader />;
	console.log({ values });
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5">
					<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
						<Grid.Column xs={4} xl={4}>
							<Field component={Fields.Input} name="name_uz" type="text" placeholder="Введите имя" label="Имя (UZ)" />
						</Grid.Column>
						<Grid.Column xs={4} xl={4}>
							<Field component={Fields.Input} name="name_ru" type="text" placeholder="Введите имя" label="Имя (RU)" />
						</Grid.Column>
						<Grid.Column xs={4} xl={4}>
							<Field component={Fields.Input} name="name_en" type="text" placeholder="Введите имя" label="Имя (EN)" />
						</Grid.Column>
						<Grid.Column xs={6} xl={6}>
							<Field
								component={Fields.Select}
								name="category_id"
								placeholder={t("Выберите категорию")}
								label={t("Категория")}
								isClearable={true}
								isSearchable={false}
								className="mb-24"
								optionLabel={"label"}
								optionValue="value"
								options={constants.channelTypes}
								onChange={({ value }) => setFieldValue("category_id", value)}
							/>
						</Grid.Column>
						<Grid.Column xs={6} xl={6}>
							<Field component={Fields.Input} name="stream" type="text" placeholder="Введите телеканал" label="Телеканал" />
						</Grid.Column>
					</Grid.Row>
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Field
						component={Fields.fileUpload}
						name="logo_id"
						label="Логотип"
						items={Array.isArray(get(values, "logo_id")) ? get(values, "logo_id") : [get(values, "logo")]}
						onChangeHandler={data => {
							setFieldValue("logo_id", data);
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
