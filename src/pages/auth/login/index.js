import React, { useEffect } from "react";
import { Button, Fields, Grid } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { useNotification } from "hooks";
import EntityForm from "modules/entity/forms";
import Actions from "store/actions";
import { storage } from "services";
import { useDispatch } from "react-redux";

import { ReactComponent as RiyaPlayLogo } from "assets/images/bektv.svg";
import { useHistory } from "react-router";

const Login = () => {
	const history = useHistory();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { notification } = useNotification();

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
					<div className="login__page--left d-flex flex-col ml-auto mr-auto">
						<div className="logo">
							<RiyaPlayLogo />
						</div>
						<h4 className="login__page--title">Добро пожаловать</h4>
						{/*<p className="login__page--info">Мы всегда рады помочь вам по работе в электронном*/}
						{/*	автоматизированном системе обработки заявок по услугам Агентствы продвижения экспорта*/}
						{/*</p>*/}
						<EntityForm.Default
							method="post"
							url={`/user/sign-in`}
							params={{ include: "token" }}
							onSuccess={data => {
								if (get(data, "success")) {
									storage.set("token", get(data, "success.token"));
									dispatch(Actions.auth.Login.success(data));
								} else if (get(data, "confirmation")) {
									history.push({
										pathname: `/confirm`,
										state: {
											phone: get(data, "confirmation")
										}
									});
								}
							}}
							onError={error => {
								notification(
									error.errorMessage
										? get(error, "errorMessage")
										: get(error, "errorData.password[0]") + `<hr style="opacity: 0;" class="mb-2"/>${t("admin_panel_masul_hodim_raqami")}`,
									{
										type: "danger"
									}
								);
							}}
							fields={[
								{
									name: "username",
									required: true
								},
								{
									name: "password",
									required: true
								}
							]}>
							{({ isSubmitting }) => {
								return (
									<>
										<Field
											component={Fields.LoginInput}
											name="username"
											type="text"
											className="intro-x login__input  block"
											containerClassName="mt-10"
											placeholder={t("Введите логин")}
											label="Имя пользователя"
											extra={<img src={require("assets/images/icons/person.svg")} alt="" />}
										/>
										<Field
											component={Fields.LoginInput}
											name="password"
											type="password"
											className="intro-x login__input    block"
											placeholder={t("Введите пароль")}
											label="Ключ авторизации"
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

export default Login;
