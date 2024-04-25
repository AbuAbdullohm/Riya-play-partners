import React from "react";
import { Field } from "formik";
import { useHistory } from "react-router";
import { get } from "lodash";
import { useNotification } from "hooks";
import EntityForm from "modules/entity/forms";
import { Fields, Button, Grid } from "components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Actions from "store/actions";

export default function PhoneModal({ user, setUser, modal, setModal, setOTPConfirmModal }) {
	const history = useHistory();
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const { t } = useTranslation();

	const { id } = user;

	if (!id || !modal) return <></>;

	const UpdateUser = data => {
		dispatch(
			Actions.entities.Update.success({
				entity: "user",
				entityId: id,
				data
			})
		);
	};
	return (
		<EntityForm.Main
			method="put"
			entity="user"
			name={`user`}
			url={`/user/update-phone`}
			primaryKey="id"
			normalizeData={data => data}
			id={get(user, "id")}
			version="v2"
			updateData
			onSuccess={data => {
				setOTPConfirmModal(true);
				setModal(false);
				UpdateUser(data);
				// notification("Успешно обновлено", {
				// 	type: "success"
				// });
				// history.goBack();
			}}
			onError={error => {
				let message = get(error, "message");
				let phone = get(error, "phone");

				if (phone) {
					notification(phone, {
						type: "danger"
					});
				} else
					notification(message, {
						type: "danger"
					});
			}}
			params={{
				extra: {
					phone: user ? user.phone : "",
					user_id: id ? id : ""
				}
			}}
			fields={[
				{
					name: "phone",
					required: true,
					value: get(user, "phone"),
					min: 12
				}
			]}>
			{({ isSubmitting }) => {
				return (
					<>
						<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
							<Grid.Column xs={12} xl={12}>
								<Field
									component={Fields.MaskInput}
									name="phone"
									label="Номер телефона"
									mask="\9\98 99 999 99 99"
									placeholder={`Ввыдите номер телефон`}
									style={{ width: "100%" }}
								/>
							</Grid.Column>
						</Grid.Row>
						<div className="flex justify-end">
							<Button.Default
								type="secondary"
								buttonType="button"
								onClick={() => {
									setModal(false);
									setUser({});
								}}>
								{t("Отменить")}
							</Button.Default>

							<Button.Default type="primary" buttonType="submit" loading={isSubmitting} className="ml-2">
								{t("Сохранить")}
							</Button.Default>
						</div>
					</>
				);
			}}
		</EntityForm.Main>
	);
}
