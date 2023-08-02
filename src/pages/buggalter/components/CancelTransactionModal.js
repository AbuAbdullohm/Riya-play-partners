import React from "react";
import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import { Field } from "formik";
import { Fields } from "../../../components";

export default function CancelTransactionModal({ itemId, onClose }) {
	const { notification } = useNotification();

	return (
		<EntityForm.Main
			method="post"
			entity="transactions/cancel"
			name={`transactions/cancel`}
			url={"/transactions/cancel/" + itemId}
			prependData
			version="v1"
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(_, resetForm) => {
				resetForm();
				onClose();
				notification("Отменено успешно", {
					type: "success"
				});
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			fields={[
				{
					name: "comment",
					required: true
				}
			]}>
			{() => {
				return (
					<div className="d-flex flex-column">
						<Field name="comment" component={Fields.Textarea} placeholder="Причина" label="Причина" />
						<button htmlType="submit" className="btn btn-danger mt-2">
							{"Отменит"}
						</button>
					</div>
				);
			}}
		</EntityForm.Main>
	);
}
