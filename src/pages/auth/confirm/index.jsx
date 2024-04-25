import React, { useEffect, useState } from "react";
import { Button, Grid } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { useNotification } from "hooks";
import EntityForm from "modules/entity/forms";
import { useLocation } from "react-router-dom";
import { storage } from "services";
import Actions from "store/actions";
import { useDispatch } from "react-redux";

import { ReactComponent as RiyaPlayLogo } from "assets/images/bektv.svg";

function ConfirmInput(props) {
	const [value, setValue] = useState(get(props, "field.value"));

	function changeFocus(e, index) {
		const eventValue = e.target.value;
		const character = value.at(index);

		if (eventValue) {
			if (character) {
				if (index > value.length - 1) return value;
				const v = value.substring(0, index) + eventValue + value.substring(index + 1);

				return setValue(v);
			} else {
				setValue(p => p + eventValue);
			}

			const el = document.getElementById(`input-${index + 1}`);
			if (el) el.focus();
		}
	}

	useEffect(() => {
		if (value.length === 6) {
			props.form.setFieldValue("code", value);
		}
	}, [value]);

	return (
		<div className="d-flex align-items-center justify-content-between">
			<input
				id="input-0"
				onChange={e => changeFocus(e, 0)}
				className="form-control"
				style={{ width: "15%", height: 65, fontSize: 32, textAlign: "center" }}
				maxLength={1}
			/>
			<input
				id="input-1"
				onChange={e => changeFocus(e, 1)}
				className="form-control"
				style={{ width: "15%", height: 65, fontSize: 32, textAlign: "center" }}
				maxLength={1}
			/>
			<input
				id="input-2"
				onChange={e => changeFocus(e, 2)}
				className="form-control"
				style={{ width: "15%", height: 65, fontSize: 32, textAlign: "center" }}
				maxLength={1}
			/>
			<input
				id="input-3"
				onChange={e => changeFocus(e, 3)}
				className="form-control"
				style={{ width: "15%", height: 65, fontSize: 32, textAlign: "center" }}
				maxLength={1}
			/>
			<input
				id="input-4"
				onChange={e => changeFocus(e, 4)}
				className="form-control"
				style={{ width: "15%", height: 65, fontSize: 32, textAlign: "center" }}
				maxLength={1}
			/>
			<input
				id="input-5"
				onChange={e => changeFocus(e, 5)}
				className="form-control"
				style={{ width: "15%", height: 65, fontSize: 32, textAlign: "center" }}
				maxLength={1}
			/>
		</div>
	);
}

const Confirm = ({ history }) => {
	const { state } = useLocation();
	const { t } = useTranslation();
	const { notification } = useNotification();
	const dispatch = useDispatch();

	const { phone } = state;

	useEffect(() => {
		document.body.className = "logins";

		return () => {
			document.body.className = `main`;
		};
	}, []);

	return (
		<div className="login__page">
			<div className="container sm:px-10">
				<Grid.Row cols={12} className="login__page--container">
					<div className="login__page--left d-flex flex-col mr-auto ml-auto">
						<div className="logo">
							<RiyaPlayLogo />
						</div>
						<h4 className="login__page--title">Введите код</h4>
						<p className="login__page--info">
							Мы отправили вам код в виде СМС на ваше номерт телефона который было указано в профиле, пожалуйтста введите код для входа в систему
						</p>
						<EntityForm.Default
							method="post"
							url={`/user/confirm/`}
							params={{
								include: "token,image"
							}}
							onSuccess={data => {
								if (get(data, "success")) {
									storage.set("token", get(data, "success.token"));
									dispatch(Actions.auth.Login.success(data.user));
									history.push("/");
								}
							}}
							onSubmit={() => {}}
							onError={error => {
								notification(get(error, "errorMessage"), {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "code",
									required: true
								},
								{
									name: "phone",
									value: phone
								}
							]}>
							{({ isSubmitting }) => {
								return (
									<>
										<Field
											component={ConfirmInput}
											name="code"
											type="password"
											className="intro-x login__input block"
											placeholder={t("Введите пароль")}
											label="Код авторизации"
											containerClassName="mt-10"
											password={true}
										/>

										<div className="intro-x mt-5 text-left">
											<Button.Default
												loading={isSubmitting}
												type="primary"
												buttonType="submit"
												className="py-5 px-5 w-full  align-top mt-10"
												style={{
													backgroundColor: "#003BCF",
													borderRadius: "12px"
												}}>
												{t("Войти в систему")}
											</Button.Default>
											<Button.Outline
												onClick={() => history.push("/")}
												type="primary"
												className="py-5 px-4 w-full  align-top mt-5"
												style={{
													backgroundColor: "transparent",
													border: "none",
													textDecoration: "underline",
													boxShadow: "none"
												}}>
												{/*{t("Отправить заного")}*/}
												Вернитесь назад
											</Button.Outline>
										</div>
									</>
								);
							}}
						</EntityForm.Default>
					</div>
				</Grid.Row>
			</div>
		</div>
	);
};

export default Confirm;
