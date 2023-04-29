import React, { useState } from "react";
import EntityForm from "modules/entity/forms";
import { Fields, Grid, Button, Modal } from "components";
import { useNotification } from "hooks";
import { useTranslation } from "react-i18next";
import Actions from "store/actions/system";
import { Field } from "formik";
import { useDispatch } from "react-redux";
import { helpers } from "services";
import "../style.scss";
const AddDay = ({ setAddDay, setCanUpdate, canUpdate }) => {
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const { t } = useTranslation();
	const [userType, setUserType] = useState(1);
	const [modal, setModal] = useState(false);
	let invalidChars = ["+", "e", ".", ","];
	return (
		<>
			<EntityForm.Main
				method="post"
				entity="add-extra-time"
				name="add-extra-time"
				url={`/user/add-extra-times`}
				version="v2"
				primaryKey="id"
				onSuccess={(data, resetForm) => {
					dispatch(Actions.GetAddDay());
					setCanUpdate(!canUpdate);
					notification("Успешно добавлено", {
						type: "success"
					});
					setModal(false);
					setAddDay(false);
				}}
				onError={() => {
					notification("Что-то пошло не так", {
						type: "danger"
					});
				}}
				fields={[
					{ name: "users_type", value: 1 },
					{
						name: "type",
						type: "number",
						required: true,
						onSubmitValue: value => value && value
					},
					{ name: "extra_time", required: true, onSubmitValue: value => value && +value },
					{ name: "is_active", onSubmitValue: value => (value && value === 1 ? 1 : 0) },
					{ name: "foreign_user", value: 1 },
					{
						name: "ids",
						required: userType === 2,
						type: "array",
						onSubmitValue: value => (userType === 1 ? null : value && value.reduce((prev, curr) => [...prev, curr.id], []).join(","))
					}
				]}>
				{({ isSubmitting, values, setFieldValue, handleSubmit }) => {
					return (
						<div className="my-5">
							<Modal.Confirm
								title={
									<div>
										Вы действительно хотите добавить дни?{" "}
										<p style={{ color: "#000", fontWeight: "700" }}>Это может занять несколько минут, обновляйте страницу</p>
									</div>
								}
								toggle={modal}
								setToggle={setModal}
								closable
								type="monition"
								isSubmitting={isSubmitting}
								cancelText="нет"
								okText="да"
								className="z-99999"
								onOk={() => handleSubmit()}
							/>
							<Grid.Row cols={12} className="mb-5">
								<Grid.Column lg={6}>
									<Fields.Radio
										id="count-1"
										name="count-1"
										checked={values.users_type === 1}
										onChange={e => {
											setUserType(1);
											setFieldValue("users_type", Number(e.target.value));
											setFieldValue("ids", "");
											setFieldValue("extra_time", "");
											setFieldValue("is_active", 0);
										}}
										borderColor="dark-gray"
										value={1}
										label="Все пользователи"
									/>
								</Grid.Column>
								<Grid.Column lg={6}>
									<Fields.Radio
										id="count-2"
										name="count-2"
										checked={values.users_type === 2}
										onChange={e => {
											setFieldValue("users_type", Number(e.target.value));
											setUserType(2);
											setFieldValue("type", "");
											setFieldValue("extra_time", "");
											setFieldValue("is_active", 0);
										}}
										borderColor="dark-gray"
										value={2}
										label="Некоторые пользователи"
									/>
								</Grid.Column>
							</Grid.Row>

							<Grid.Row cols={12} className="mb-5">
								<Grid.Column xl={12} lg={12}>
									{values.users_type === 1 ? (
										<>
											<div className="row align-center">
												<div className="col-md-10">
													<Field
														component={Fields.Select}
														name="type"
														label="Выберите тип подписки"
														placeholder="Выберите тип подписки"
														optionLabel="name"
														isClearable
														optionValue="id"
														options={[
															{
																id: 2,
																name: "Пользователи тарифа"
															},
															{
																id: 1,
																name: "Пользователи промокода"
															}
														]}
													/>
												</div>
												<div className="col-md-2">
													<Field
														component={Fields.Switch}
														name="is_active"
														label="Активный"
														className="mb-0"
														onChange={e => {
															setFieldValue("is_active", +e.target.checked);
														}}
													/>
												</div>
											</div>
											<Field
												component={Fields.Input}
												name="extra_time"
												type="number"
												onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
												label="День"
												min="0"
												placeholder="Введите день"
											/>
										</>
									) : values.users_type === 2 ? (
										<>
											<div className="row align-center">
												<div className="col-md-10">
													<Field
														component={Fields.Select}
														name="type"
														label="Выберите тип подписки"
														placeholder="Выберите тип подписки"
														optionLabel="name"
														isClearable
														optionValue="id"
														handleChange={value => {
															if (value && value.id === 2) {
																setFieldValue("ids", "");
															} else if (value && value.id === 1) {
																setFieldValue("ids", "");
															} else setFieldValue("ids", "");
														}}
														options={[
															{
																id: 2,
																name: "Пользователи тарифа"
															},
															{
																id: 1,
																name: "Пользователи промокода"
															}
														]}
													/>
												</div>
												<div className="col-md-2">
													<Field
														component={Fields.Switch}
														name="is_active"
														label="Активный"
														className="mb-0"
														onChange={e => {
															setFieldValue("is_active", +e.target.checked);
														}}
													/>
												</div>
											</div>

											<Field
												component={Fields.AsyncSelect}
												name="ids"
												placeholder="Выберите пользователей"
												label="Выберите пользователей"
												isClearable
												loadOptionsKey="items"
												isSearchable
												version="v2"
												isDisabled={values.type === "" || (values.type === null && true)}
												isMulti
												loadOptionsUrl="/user"
												optionLabel={option => (
													<div className="d-flex justify-content-between">
														<div>
															ID: <span style={{ fontWeight: "bold" }}>{option.id}</span>
														</div>
														<div className="text-left">
															Username: <span style={{ fontWeight: "bold" }}>{option.username}</span>
														</div>
														<div>
															Phone: <span style={{ fontWeight: "bold" }}>{option.phone}</span>
														</div>
													</div>
												)}
												loadOptionsParams={search => {
													return {
														extra: {
															id: search,
															foreign_user: 1,
															subscribe_type: values.type === 1 ? 1 : values.type === 2 ? 2 : ""
														},
														sort: "-id"
													};
												}}
											/>
											<Field
												component={Fields.Input}
												name="extra_time"
												type="number"
												onKeyDown={e => {
													if (invalidChars.includes(e.key)) {
														e.preventDefault();
													}
												}}
												label="День"
												min="0"
												placeholder="Введите день"
											/>
										</>
									) : (
										""
									)}

									{/* <Field
										component={Fields.Input}
										name="extra_time"
										label="День"
										min="0"
										type="number"
										onKeyDown={e => helpers.onKeyDownInvalidChars(e)}
										placeholder="Введите день"
									/> */}
								</Grid.Column>
							</Grid.Row>

							<div className="flex justify-end">
								<Button.Default type="secondary" buttonType="button" onClick={() => setAddDay(false)}>
									{t("Отменить")}
								</Button.Default>

								<Button.Default
									type="primary"
									loading={isSubmitting}
									onClick={() => {
										if (values.users_type === 1) {
											if (values.type === "" || values.extra_time === "") {
												handleSubmit();
											} else setModal(true);
										} else if (values.users_type === 2) {
											if (values.subscribe_type === "" || values.extra_time === "") {
												handleSubmit();
											} else setModal(true);
										}
									}}>
									{t("Отправить")}
								</Button.Default>
							</div>
						</div>
					);
				}}
			</EntityForm.Main>
		</>
	);
};

export default AddDay;
