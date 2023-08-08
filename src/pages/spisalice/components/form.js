import React from "react";
import { useHistory } from "react-router";
import { Fields, Grid, Panel, Button, Loader, Icon } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { useAccess, useNotification } from "hooks";
import { helpers, api, queryBuilder, time } from "services";
import EntityContainer from "modules/entity/containers";
import "../style.scss";

const Form = ({ id, isFetched, isUpdate, isSubmitting, setFieldValue, setFieldError, values, lang, hideStatus = false }) => {
	const { t } = useTranslation();
	const history = useHistory();
	const { notification } = useNotification();
	const isAdmin = useAccess({ roles: ["admin"] });

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
		<Grid.Row gutter={10} gutterX={4} className={"spisalice mb-10"}>
			<Grid.Column xs={12} xl={3}>
				<Panel>
					<Field
						component={Fields.fileUpload}
						name="photo"
						label="Фото"
						items={Array.isArray(get(values, "photo")) ? get(values, "photo") : []}
						onChangeHandler={data => {
							setFieldValue("photo", data);
						}}
						multiple={false}
					/>
				</Panel>
				{id ? (
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
								user_id: id
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
				) : null}
			</Grid.Column>
			<Grid.Column xs={12} xl={9}>
				<Panel>
					<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
						<Grid.Column xs={12} xl={6}>
							<Field component={Fields.Input} name="full_name" type="text" placeholder="Введите имя" label="Полное имя" />
						</Grid.Column>
						<Grid.Column xs={12} xl={6}>
							<Field component={Fields.Input} name="username" type="text" placeholder="Введите имя" label="Имя пользователя" />
						</Grid.Column>
						<Grid.Column xs={12} xl={6}>
							<Field
								component={Fields.MaskInput}
								name="phone"
								label="Телефон"
								mask="\9\98 99 999 99 99"
								placeholder={`Ввыдите телефон`}
								style={{ width: "100%" }}
							/>
						</Grid.Column>
						<Grid.Column xs={12} xl={6}>
							<Field component={Fields.Input} name="email" type="email" rows={10} label="Эл.адрес" placeholder="Эл.адрес" />
						</Grid.Column>

						<Grid.Column xs={12} xl={6}>
							<Field
								component={Fields.Input}
								name="password"
								type="password"
								min="0"
								onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
								placeholder="Пароль"
								label="Введите пароль"
							/>
						</Grid.Column>
						<Grid.Column xs={12} xl={6}>
							<Field
								component={Fields.Input}
								name="confirm-password"
								type="password"
								min="0"
								onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
								placeholder="Повторите пароль"
								label="Повторите пароль"
							/>
						</Grid.Column>

						{/* <Field component={Fields.Input} name="phone" type="text" rows={10} label="Телефон" placeholder="Телефон" /> */}

						<Grid.Column xs={6} xl={6}>
							<Field
								component={Fields.Select}
								name="role"
								options={isAdmin ? helpers.adminRoles : helpers.userRoles}
								optionValue="value"
								optionLabel="label"
								isClearable={true}
								isSearchable={false}
								label="Роль"
								placeholder="Выберите роль"
							/>
						</Grid.Column>
						{hideStatus ? null : (
							<Grid.Column xs={6} xl={6} className="d-flex align-items-center">
								<Field
									component={Fields.Switch}
									className="mb-0"
									name="status"
									label="Статус"
									onChange={() => {
										setFieldValue("status", !values.status);
									}}
								/>
							</Grid.Column>
						)}
					</Grid.Row>

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
