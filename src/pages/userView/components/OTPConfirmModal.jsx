import React, { useState, useEffect } from "react";
import { Field } from "formik";
import { get } from "lodash";
import { useNotification } from "hooks";
import EntityForm from "modules/entity/forms";
import { Fields, Button, Grid } from "components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Actions from "store/actions";

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

export default function OTPConfirmModal({ modal, setModal }) {
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const { t } = useTranslation();

	if (!modal) return <></>;

	// const UpdateUser = data => {
	// 	dispatch(
	// 		Actions.entities.Update.success({
	// 			entity: "user",
	// 			entityId: id,
	// 			data
	// 		})
	// 	);
	// };
	return (
		<EntityForm.Main
			method="put"
			entity="user"
			name={`user`}
			url={`/user/update-phone`}
			primaryKey="id"
			normalizeData={data => data}
			// id={get(user, "id")}
			version="v2"
			updateData
			onSuccess={data => {
				setModal(false);
				// UpdateUser(data);
				notification("Успешно обновлено", {
					type: "success"
				});
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
			params={{}}
			fields={[
				{
					name: "code",
					required: true,
					// value: get(user, "phone"),
					min: 12
				}
			]}>
			{({ isSubmitting }) => {
				return (
					<>
						<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
							<Grid.Column xs={12} xl={12}>
								<h1>Код подтверждения</h1>
							</Grid.Column>
							<Grid.Column xs={12} xl={12}>
								<Field component={ConfirmInput} name="code" style={{ width: "100%" }} />
							</Grid.Column>
						</Grid.Row>
						<div className="flex justify-end">
							<Button.Default
								type="secondary"
								buttonType="button"
								onClick={() => {
									setModal(false);
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
