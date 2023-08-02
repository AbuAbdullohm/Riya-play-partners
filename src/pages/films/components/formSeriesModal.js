import React from "react";
import get from "lodash/get";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { Fields, Button, Grid, TracksList } from "components";
import { helpers, api, queryBuilder } from "services";

const Form = ({ isUpdate, lang = "ru", setFieldValue, values, item = {} }) => {
	const { t } = useTranslation();

	const onDeleteHandler = async (id, files) => {
		const screenshot = values.screenshots.find(s => s.id === id);
		setFieldValue("screenshots", files);
		await api["requestv3"].delete(queryBuilder("/screenshots/" + screenshot.screenshot_id));
	};

	return (
		<>
			<Grid.Row gutter={10} gutterX={4}>
				<Grid.Column lg={6}>
					<Field component={Fields.Input} name="name_uz" type="text" placeholder="Введите загаловок (УЗ)" label="Имя (УЗ)" size="large" />
				</Grid.Column>
				<Grid.Column lg={6}>
					<Field component={Fields.Input} name="name_ru" type="text" placeholder="Введите загаловок (РУ)" label="Имя (РУ)" size="large" />
				</Grid.Column>
				<Grid.Column lg={12}>
					<Field
						component={Fields.fileUpload}
						name="photo"
						label="Фото"
						items={get(values, "photo")}
						onChangeHandler={data => {
							setFieldValue("photo", data);
						}}
						multiple={false}
					/>
				</Grid.Column>

				<Grid.Column lg={12}>
					<Field
						component={Fields.fileUpload}
						name="screenshots"
						multiple={true}
						label={t("Скриншоты")}
						limit={10}
						items={get(values, "screenshots")}
						onDeleteHandler={onDeleteHandler}
						onChangeHandler={data => {
							setFieldValue("screenshots", data);
						}}
					/>
				</Grid.Column>

				<Grid.Column lg={4}>
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
				</Grid.Column>

				{get(item, "type.has_season", 0) === 1 && (
					<Grid.Column lg={4}>
						<Field
							component={Fields.AsyncSelect}
							name="season_id"
							placeholder="Виберите Seasons"
							label="Seasons"
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
					</Grid.Column>
				)}

				<Grid.Column xs={12}>
					<TracksList {...{ values, setFieldValue }} />
				</Grid.Column>

				<Grid.Column lg={12}>
					<Field
						component={Fields.Switch}
						name="status"
						label="Статус"
						onChange={() => {
							setFieldValue("status", !values.status);
						}}
					/>
				</Grid.Column>
				<Grid.Column lg={12}>
					<div className="flex justify-end">
						<Button.Default type="primary" buttonType="submit" className="ml-2">
							{isUpdate ? t("Сохранить") : t("Добавить")}
						</Button.Default>
					</div>
				</Grid.Column>
			</Grid.Row>
		</>
	);
};

export default Form;
