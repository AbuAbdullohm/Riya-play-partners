import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Button, Fields, Grid, Panel } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import Actions from "modules/entity/actions";
import get from "lodash/get";
import { useDispatch } from "react-redux";
import { helpers } from "services";
const Form = ({ isUpdate, isSubmitting, setFieldValue, values }) => {
	const { t } = useTranslation();
	const history = useHistory();
	const [types, setTypes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [defaultValue, setDefaultValue] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		setLoading(true);
		getTypes();
		setLoading(false);
	}, []);

	useEffect(() => {
		if (isUpdate && types.length) {
			setLoading(true);
			const defaultItem = types.filter(item => item.id === values.type_id);
			setDefaultValue(defaultItem);
			setLoading(false);
		}
	}, [types]);

	const getTypes = () => {
		dispatch(
			Actions.LoadDefault.request({
				url: `/types`,
				params: {
					filter: { status: 1 },
					limit: 250
				},
				cb: {
					success: ({ data }) => {
						setTypes(data);
					},
					error: error => {
						console.log(error);
					}
				}
			})
		);
	};

	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5">
					<Field component={Fields.Input} name="name_uz" type="text" placeholder="Введите имя" label="Имя (UZ)" />
					<Field component={Fields.Input} name="name_ru" type="text" placeholder="Введите имя" label="Имя (RU)" />
					<Field
						component={Fields.Input}
						name="sort"
						type="number"
						onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
						placeholder="Введите sort"
						label="Sort"
					/>
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Field
						component={Fields.fileUpload}
						name="file_id"
						label="Фото"
						items={get(values, "file_id")}
						onChangeHandler={data => {
							setFieldValue("file_id", data);
						}}
						multiple={false}
					/>

					<Field
						component={Fields.fileUpload}
						name="icon_id"
						label="Иконка (svg)"
						isDoc={true}
						onlyOneType=".svg"
						items={get(values, "icon_id")}
						onChangeHandler={data => {
							setFieldValue("icon_id", data);
						}}
						multiple={false}
					/>

					{!loading && (
						<Field
							label="Тип"
							component={Fields.Select}
							defaultValue={defaultValue}
							name="type_id"
							isSearchable={true}
							isClearable={true}
							optionLabel="name_ru"
							optionValue="id"
							placeholder="Поиск"
							options={types}
						/>
					)}

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
