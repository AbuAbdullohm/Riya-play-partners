import React, { useState } from "react";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNotification } from "hooks";
import { api, queryBuilder } from "services";
import { Button, Grid, Modal } from "components";
import Actions from "store/actions";

export default function BanModal({ user, modal, setModal }) {
	const { notification } = useNotification();
	const [confirmModal, setConfirmModal] = useState(false);
	const { t } = useTranslation();
	const dispatch = useDispatch();

	if (!modal) return <></>;

	function unBanUser() {
		api["requestv2"]
			.post(queryBuilder(`/user/unban/${get(user, "id")}`))
			.then(({ data }) => {
				notification("Успешно", {
					type: "success"
				});
				console.log(data);
				dispatch(
					Actions.entities.Update.success({
						entity: "user",
						entityId: data.id,
						data
					})
				);
			})
			.catch(() =>
				notification("Что-то пошло не так", {
					type: "danger"
				})
			);
	}

	return (
		<>
			<Modal.Confirm
				closable
				cancelText={"Назад"}
				title="Вы действительно хотите ?"
				okText={"Да"}
				onOk={() => {
					unBanUser();
					setConfirmModal(false);
					setModal(false);
				}}
				setToggle={() => setConfirmModal(false)}
				toggle={confirmModal}
				type="error"
			/>
			<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
				<Grid.Column xs={12} xl={12}>
					<h1>{get(user, "banned.reason.title_ru")}</h1>
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

				<Button.Default type="primary" buttonType="submit" className="ml-2" onClick={() => setConfirmModal(true)}>
					{t("Снять бан")}
				</Button.Default>
			</div>
		</>
	);
}
