import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { helpers } from "services";
const Form = ({ isFetched, isUpdate, isSubmitting, setFieldValue, values, lang }) => {
	const { t } = useTranslation();
	const history = useHistory();
	// const checkNumber = text => {
	// 	if (text.keyCode !== 8) {
	// 		if ("0123456789".indexOf(text.key) === -1) {
	// 			text.preventDefault();
	// 		}
	// 	}
	// };

	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column xs={12} xl={8}>
				<Panel className="mt-5">
					<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
						<Grid.Column xs={12} xl={6}>
							<Field component={Fields.Input} name="username" type="text" placeholder="Введите имя" label="Имя пользователя" />
						</Grid.Column>
						<Grid.Column xs={12} xl={6}>
							<Field
								component={Fields.Input}
								name={isUpdate ? "code" : "password"}
								type="number"
								min="0"
								maxLength={4}
								placeholder="Пароль"
								label="Введите пароль"
							/>
						</Grid.Column>
						<Grid.Column xs={12} xl={6}>
							<Field component={Fields.Input} name="full_name" type="text" placeholder="Введите имя" label="Полное имя" />
						</Grid.Column>
						<Grid.Column xs={12} xl={6}>
							<Field
								component={Fields.MaskInput}
								name="phone"
								label="Номер телефона"
								mask="\9\98 22 999 99 99"
								onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
								placeholder={`Ввыдите номер телефона`}
								style={{ width: "100%" }}
							/>
						</Grid.Column>
					</Grid.Row>
				</Panel>
			</Grid.Column>
			<Grid.Column xs={12} xl={4}>
				<Panel className="mt-5">
					<Field
						component={Fields.fileUpload}
						name="photo"
						label="Фото"
						items={Array.isArray(get(values, "photo")) ? get(values, "photo") : null}
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
						<Button.Default type="primary" buttonType={"submit"} loading={isSubmitting} className="ml-2">
							{t("Сохранить")}
						</Button.Default>
					</div>
				</Panel>
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
