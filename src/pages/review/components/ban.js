import React from "react";
import EntityForm from "modules/entity/forms";
import { Fields, Grid, Button } from "components";
import { useNotification } from "hooks";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import { Field } from "formik";
import moment from "moment";

const View = ({ selectedBan, isUpdate, setUpdateModal, setCanUpdate, canUpdate, setModalBan }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const userId = get(selectedBan, "user_id");
	const user = get(selectedBan, "user.username");
	return (
		<Grid.Row gutter={1}>
			<Grid.Column xs={12}>
				<h2 className="text-center">Вы действительно хотите ограничить:</h2>
				<h2 className="mt-4">Id:{userId}</h2>
				<h2>Ползователь : {user}</h2>
				<EntityForm.Main
					method="post"
					entity="review-replies"
					name="review-replies"
					url={`/reviews/block/${selectedBan.id}`}
					prependData
					primaryKey="id"
					onSuccess={(data, resetForm) => {
						setModalBan(false);
						setCanUpdate(!canUpdate);
						notification("Успешно добавлено", {
							type: "success"
						});
					}}
					onError={errors => {
						if (get(errors, "errorMessage")) {
							notification(get(errors, "errorMessage"), {
								type: "danger"
							});
						} else
							notification("Что-то пошло не так", {
								type: "danger"
							});
					}}
					fields={[
						{ name: "block_type", value: 2, onSubmitValue: value => (value === 1 ? "app" : "comment") },
						{ name: "block_end_date", onSubmitValue: value => value && value },
						{ name: "reason_id", required: true, onSubmitValue: value => value && value.id }
					]}>
					{({ isSubmitting, values, setFieldValue }) => {
						return (
							<div className="my-5">
								<Grid.Row cols={12} className="mb-5">
									<Grid.Column lg={6}>
										<Fields.Radio
											id="count-1"
											name="count-1"
											checked={values.block_type === 2}
											onChange={e => {
												setFieldValue("block_type", Number(e.target.value));
											}}
											borderColor="dark-gray"
											value={2}
											label="Написать комментарий"
										/>
									</Grid.Column>
									<Grid.Column lg={6}>
										<Fields.Radio
											id="count-2"
											name="count-2"
											checked={values.block_type === 1}
											onChange={e => {
												setFieldValue("block_type", Number(e.target.value));
											}}
											borderColor="dark-gray"
											value={1}
											label="Использование приложения"
										/>
									</Grid.Column>
								</Grid.Row>

								<Grid.Row cols={12} className="mb-5">
									<Grid.Column xl={12} lg={12}>
										<Field
											component={Fields.AsyncSelect}
											name="reason_id"
											placeholder="Виберите причини"
											label="Причина блокировки"
											isClearable
											isSearchable
											loadOptionsUrl="/reason"
											optionLabel={`title_uz`}
										/>
									</Grid.Column>
								</Grid.Row>

								{values.block_type === 2 ? (
									<Field
										component={Fields.NewDatePicker}
										name="block_end_date"
										label="Дата окончания блока"
										isClearable={true}
										minDate={moment()
											.add(1, "d")
											.toDate()}
										onChange={value => {
											setFieldValue("block_end_date", value);
										}}
									/>
								) : values.block_type === 1 ? (
									<Field
										component={Fields.NewDatePicker}
										name="block_end_date"
										label="Дата окончания блока"
										isClearable={true}
										minDate={new Date()}
										onChange={value => {
											setFieldValue("block_end_date", value);
										}}
									/>
								) : null}
								<div className="flex justify-end">
									<Button.Default type="secondary" buttonType="button" onClick={() => setModalBan(false)}>
										{t("Отменить")}
									</Button.Default>
									<Button.Default type="primary" buttonType="submit" loading={isSubmitting}>
										{t("Отправить")}
									</Button.Default>
								</div>
							</div>
						);
					}}
				</EntityForm.Main>
			</Grid.Column>
		</Grid.Row>
	);
};

export default View;
