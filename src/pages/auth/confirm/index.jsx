import React, { useEffect } from "react";
import { Button, Fields, Grid } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { useNotification } from "hooks";
import EntityForm from "modules/entity/forms";
import { useParams } from "react-router-dom";
import { storage } from "services";
import Actions from "store/actions";
import { useDispatch } from "react-redux";

import { ReactComponent as RiyaPlayLogo } from "assets/images/bektv.svg";

const Confirm = ({ history }) => {
	const { code } = useParams();
	const { t } = useTranslation();
	const { notification } = useNotification();
	const dispatch = useDispatch();

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
									value: code
								}
							]}>
							{({ isSubmitting }) => {
								return (
									<>
										<Field
											component={Fields.LoginInput}
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
