import React from "react";
import EntityForm from "modules/entity/forms";
import { Fields, Grid, Button } from "components";
import { useNotification } from "hooks";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { Field } from "formik";

const View = ({ selected, isUpdate, setUpdateModal, setViewModal, setCanUpdate, canUpdate }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const replies = get(selected, "replies");
	return (
		<Grid.Row gutter={1}>
			<Grid.Column xs={12}>
				<h2 className="bold">
					<b>{`${t("Ползователь")}: ${get(selected, "user.username")} - ${get(selected, "user.phone")}`}</b>
				</h2>
				<br />
				<h2 className="mb-1">
					<b>{t("Отзыв от пользователя")}:</b>
				</h2>
				<p className="py-1 px-2" style={{ wordBreak: "break-all" }}>
					{get(selected, "message")}
				</p>

				{replies.length > 0 && (
					<div className="text-right">
						<h1>
							<b>Администрация BekTv</b>
						</h1>
						<div>
							{replies.map(item => (
								<p className="my-3">
									<span className="py-1 px-2" style={{ border: "1px solid #8ef2a2", display: "inline-block", borderRadius: "10px" }}>
										{item.message}
									</span>
								</p>
							))}
						</div>
					</div>
				)}
				<EntityForm.Main
					method="post"
					entity="review-replies"
					name="review-replies"
					url={`/review-replies/reple/${selected.id}`}
					prependData
					primaryKey="id"
					normalizeData={data => data}
					onSuccess={(data, resetForm) => {
						setViewModal(false);
						setCanUpdate(!canUpdate);
						notification("Успешно добавлено", {
							type: "success"
						});
					}}
					onError={() => {
						notification("Что-то пошло не так", {
							type: "danger"
						});
					}}
					fields={[{ name: "message" }]}>
					{({ isSubmitting, values, setFieldValue }) => {
						return (
							<div className="my-5">
								<Field component={Fields.Input} name="message" label="Ответить" />

								<div className="flex justify-end">
									<Button.Default type="secondary" buttonType="button" onClick={() => setViewModal(false)}>
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
