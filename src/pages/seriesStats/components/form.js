import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button, TracksList } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { helpers } from "services";
const Form = ({ isFetched, setFieldTouched, isUpdate, isSubmitting, setFieldValue, values, lang = "ru", validateForm = () => {} }) => {
	const { t } = useTranslation();
	const history = useHistory();

	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5" style={{ zIndex: 50 }}>
					<Grid.Row>
						<Grid.Column lg={6}>
							<Field component={Fields.Input} name="name_uz" type="text" placeholder="Введите заголовок (УЗ)" label="Имя (УЗ)" size="large" />
						</Grid.Column>
						<Grid.Column lg={6}>
							<Field component={Fields.Input} name="name_ru" type="text" placeholder="Введите заголовок (РУ)" label="Имя (РУ)" size="large" />
						</Grid.Column>
					</Grid.Row>
					<TracksList {...{ values, setFieldValue }} />
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Field
						component={Fields.AsyncSelect}
						name="film_id"
						placeholder="Выберите фильм"
						label="Фильмы"
						isClearable
						hasMore
						isSearchable
						version="v2"
						loadOptionsUrl="/films"
						optionLabel={`name_${lang}`}
						loadOptionsParams={search => {
							return {
								extra: { name: search },
								filter: { status: 1 }
							};
						}}
					/>

					<Field
						component={Fields.Input}
						name="sort"
						type="number"
						min={0}
						onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
						label="Порядок"
						placeholder="Введите порядок"
						size="large"
					/>
					{get(values, "type") !== 3 && get(values, "type") !== 4 ? (
						<Field
							component={Fields.AsyncSelect}
							name="season_id"
							placeholder="Выберите сезон"
							label="Сезоны"
							isClearable
							hasMore
							isSearchable
							loadOptionsUrl="/seasons"
							optionLabel={`name_${lang}`}
							loadOptionsParams={search => {
								return {
									extra: { name: search },
									filter: { status: 1 }
								};
							}}
						/>
					) : null}
					<Field
						component={Fields.fileUpload}
						name="photo"
						label="Фото"
						version="v1"
						items={get(values, "photo")}
						onChangeHandler={data => {
							setFieldValue("photo", data);
						}}
						multiple={false}
					/>
					<Field
						component={Fields.Switch}
						name="status"
						label="Статус"
						onChange={() => {
							setFieldValue("status", !values.status);
						}}
					/>

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
