import React from "react";
import { useSelector } from "react-redux";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import EntityContainer from "modules/entity/containers";
import { Fields, Panel, Button, Grid, Typography, Icon, Tag, Loader } from "components";
import EntityForm from "modules/entity/forms";
import { time, api, queryBuilder } from "services";
import { useNotification } from "hooks";
import "./style.scss";

const Profile = ({ history }) => {
	const { t } = useTranslation();
	const { notification } = useNotification();
	const user = useSelector(state => get(state, "auth.data"));

	function kickDevice(item) {
		api["requestv1"]
			.delete(
				queryBuilder("/user/kick-device", {
					extra: {
						token_id: item.id
					}
				})
			)
			.then(() => {
				notification("Успешно", {
					type: "success"
				});
			})
			.catch(() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			});
	}

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
					confirmPassword: true,
					required: true
				}
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
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
										<strong>{t("Фото")}:</strong>
										<img src={get(user, "image.link")} alt="profile img" width={100} height={100} />
									</li>
									<li>
										<strong>{t("Полное имя")}:</strong>
										<p>{get(user, "full_name")}</p>
									</li>
									<li>
										<strong>{t("Имя ползователь")}:</strong>
										<p>{get(user, "username")}</p>
									</li>
									<li>
										<strong>{t("Тел")}:</strong>
										<p>{get(user, "phone")}</p>
									</li>
									<li>
										<strong>{t("Почта")}:</strong>
										<p>{get(user, "email")}</p>
									</li>
									<li>
										<strong>{t("Роль")}:</strong>
										<p>{get(user, "role")}</p>
									</li>

									<li>
										<strong>{t("Статус")}:</strong>
										<>{get(user, "status") === 10 ? <Tag color={"green"}>Активный</Tag> : <Tag color={"red"}>Неактивный</Tag>}</>
									</li>
								</ul>
							</Panel>

							<Panel className="mt-5">
								<Field component={Fields.Input} name="password" type="password" placeholder={t("Введите новый пароль")} label="Новый пароль" />
								<Field
									component={Fields.Input}
									name="password_confirmation"
									type="password"
									placeholder="Повторите новый пароль"
									label="Повторите новый пароль"
								/>
								<div className="flex justify-end">
									<Button.Default type="primary" buttonType="submit" loading={isSubmitting} className="ml-2">
										{t("Сохранить")}
									</Button.Default>
								</div>
							</Panel>
						</Grid.Column>
						<Grid.Column md={6} xl={4}>
							<EntityContainer.All
								entity="/user/devices"
								name="/user/devices"
								url="/user/devices"
								version="v1"
								dataKey={"items"}
								params={{
									sort: "-id",
									extra: {
										page: 1,
										limit: 50,
										user_id: get(user, "id")
									}
								}}>
								{({ isFetched, items }) => {
									if (!isFetched) return <Loader />;
									return items.map(item => {
										return (
											<div className="device-item" key={item.id}>
												<div>
													<p>{item.device_name}</p>
													<p>{time.to(item.created_at, "DD.MM.YYYY / HH:mm:ss")}</p>
												</div>
												<p className="close" onClick={() => kickDevice(item)}>
													<Icon name="x" />
												</p>
											</div>
										);
									});
								}}
							</EntityContainer.All>
						</Grid.Column>
					</Grid.Row>
				);
			}}
		</EntityForm.Main>
	);
};

export default Profile;
