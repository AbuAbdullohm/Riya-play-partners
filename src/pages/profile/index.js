import React from "react";

import { Fields, Panel, Button, Grid, Typography, Icon, Tag } from "components";
import EntityForm from "modules/entity/forms";
import { Field } from "formik";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Profile = ({ history }) => {
	const { t } = useTranslation();
	const user = useSelector(state => get(state, "auth.data"));

	return (
		<EntityForm.Main
			method={"put"}
			entity="profile"
			name={"profile"}
			url={"/user/update-admin"}
			updateData={true}
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push("/logout");
			}}
			fields={[
				{
					name: "password",
					required: true
				},
				{
					name: "password_confirmation",
					required: true
				}
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				function validate(stringValue) {
					let value = stringValue;
					let error;
					if (!value) {
						error = t("Важно");
					} else if (values.password !== value) {
						error = t("Не совпадает пароль");
					}
					return error;
				}

				return (
					<Grid.Row gutter={10} gutterX={4} cols={12} className={"mb-10 align-stretch"}>
						<Grid.Column lg={12}>
							<div className="d-flex align-items-center justify-content-between pt-10">
								<Typography.Heading type={5} className="intro-y font-medium mb-5 d-flex align-center">
									<Button.Outline type="primary" className="mr-5" size="sm" onClick={() => history.goBack()}>
										<Icon name="chevron-left" />
									</Button.Outline>
									{t("Редактирование пользователя")}
								</Typography.Heading>
							</div>
						</Grid.Column>
						<Grid.Column md={6} xl={8}>
							<Panel>
								<h1 className="profile-title">
									<strong>{t("Данные")}</strong>
								</h1>
								<ul className="profile-list">
									<li>
										<strong>{t("Имя ползователь")}:</strong>
										<p>{get(user, "username")}</p>
									</li>
									<li>
										<strong>{t("Почта")}:</strong>
										<p>{get(user, "email")}</p>
									</li>
									<li>
										<strong>{t("Тел")}:</strong>
										<p>{get(user, "phone")}</p>
									</li>

									<li>
										<strong>{t("Статус")}:</strong>
										<>{get(user, "status") === 10 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>}</>
									</li>
								</ul>
							</Panel>
						</Grid.Column>
						<Grid.Column md={6} xl={4}>
							<Panel>
								<Field component={Fields.Input} name="password" type="password" placeholder={t("Введите новый пароль")} label="Новый пароль" />
								<Field
									component={Fields.Input}
									name="password_confirmation"
									type="password"
									placeholder="Повторите новый пароль"
									label="Повторите новый пароль"
									validate={validate}
								/>
								<div className="flex justify-end">
									<Button.Default type="primary" buttonType="submit" loading={isSubmitting} className="ml-2">
										{t("Сохранить")}
									</Button.Default>
								</div>
							</Panel>
						</Grid.Column>
					</Grid.Row>
				);
			}}
		</EntityForm.Main>
	);
};

export default Profile;