import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button, Loader } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

const Form = ({ isFetched, isUpdate, isSubmitting, setFieldValue, values, setErrors, errors }) => {
	const { t } = useTranslation();
	const history = useHistory();

	if (!isFetched) return <Loader />;

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
						<Grid.Column xs={4} xl={4}>
							<Field component={Fields.Input} name="description_uz" type="text" placeholder="Введите описание" label="Описание (UZ)" />
						</Grid.Column>
						<Grid.Column xs={4} xl={4}>
							<Field component={Fields.Input} name="description_ru" type="text" placeholder="Введите описание" label="Описание (RU)" />
						</Grid.Column>
						<Grid.Column xs={4} xl={4}>
							<Field component={Fields.Input} name="description_en" type="text" placeholder="Введите описание" label="Описание (EN)" />
						</Grid.Column>
					</Grid.Row>
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Field
						component={Fields.fileUpload}
						name="poster_id"
						label="Пост"
						items={Array.isArray(get(values, "poster_id")) ? get(values, "poster_id") : [get(values, "poster")]}
						onChangeHandler={data => {
							setFieldValue("poster_id", data);
						}}
						multiple={false}
					/>
					<Field
						component={Fields.fileUpload}
						name="video_id"
						label="Видео"
						isDoc={true}
						onlyOneType={".jpeg,.jpg,.svg,.png,.doc,.docx,.xls,.xlsx,.mp4"}
						items={Array.isArray(get(values, "video_id")) ? get(values, "video_id") : [get(values, "video")]}
						onChangeHandler={data => {
							setFieldValue("video_id", data);
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
