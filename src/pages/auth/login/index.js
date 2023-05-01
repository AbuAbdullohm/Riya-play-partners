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

const Login = ({ history }) => {
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
				<Grid.Row cols={2} className="login__page--container">
					<div className="login__page--left d-flex flex-col">
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
									history.push(`/confirm/${get(data, "confirmation")}`);
								}
							}}
							onError={error => {
								notification(get(error, "errorMessage"), {
									type: "danger"
								});
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
											extra={<img src={require("assets/images/icons/key.svg")} alt="" />}
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
					<div className="login__page--right">
						<div className="login__page--modal">
							<div className="login__page--abs-1">
								<img src={require("assets/images/icons/shield.svg")} alt="" />
							</div>
							<img src={require("assets/images/icons/shield.svg")} alt="" />
							<h5>
								Bek TV
								{/* {t("Ўзбекистон Республикаси Инвестициялар ва ташқи савдо вазирлиги")} */}
							</h5>
							<a href="http://bektv.uz/" target="_blank" rel="noreferrer noopener">
								www.bektv.uz
							</a>
						</div>
					</div>
				</Grid.Row>
			</div>
		</div>
	);
};

export default Login;
