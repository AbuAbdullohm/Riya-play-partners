import React from "react";

import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import { Button, Fields } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import moment from "moment";

const BanModal = ({ setCreateModal, setCanUpdate, blockButtonData }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();

	return (
		<EntityForm.Main
			method="post"
			entity="user"
			version="v2"
			name="all"
			url={`user/ban/${blockButtonData}`}
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				setCreateModal(false);
				notification("Успешно добавлено", {
					type: "success"
				});
				setCanUpdate(P => !P);
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			fields={[
				{
					name: "reason_id",
					required: true,
					onSubmitValue: value => value && value.id
				},
				{ name: "banned_until", onSubmitValue: value => value && value }
			]}
			params={{}}>
			{({ isSubmitting, values, setFieldValue, errors }) => {
				return (
					<>
						<Field
							component={Fields.AsyncSelect}
							name="reason_id"
							placeholder="Причина блокировки:"
							label="Причина блокировки:"
							isClearable
							hasMore
							isSearchable
							loadOptionsUrl="/reason"
							optionLabel={`title_ru`}
							loadOptionsParams={search => {
								return {
									extra: { name: search }
								};
							}}
						/>
						<Field
							component={Fields.NewDatePicker}
							name="banned_until"
							isClearable={true}
							label="Дата и время авто разблокировки:"
							onChange={value => {
								setFieldValue("banned_until", value);
							}}
							minDate={moment()
								.add(1, "d")
								.toDate()}
						/>
						<div className="flex justify-end">
							<Button.Default type="secondary" buttonType="button" onClick={() => setCreateModal(false)}>
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
};

export default BanModal;
