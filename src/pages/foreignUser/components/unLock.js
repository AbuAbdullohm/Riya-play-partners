import React from "react";

import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import { Button } from "components";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
const UnLock = ({ setUnLock, setCanUpdate, canUpdate, tabLang, idModal }) => {
	const { notification } = useNotification();
	const id = get(idModal, "id");
	const { t } = useTranslation();
	const bannedComment = get(idModal, "banned.status");
	return (
		<EntityForm.Main
			method="post"
			entity="user"
			name="all"
			version="v2"
			url={`user/unban/${id}`}
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				setUnLock(false);
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
			params={{
				extra: { _l: tabLang }
			}}
			fields={[]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<>
						<div>
							{/* <p className="text-center">Вы действительно хотите вытащить из</p> */}
							<p className="text-center mb-5">
								{bannedComment === 1
									? "Вы уверены, что открываете от запрета использования системы этого пользователя"
									: "Вы уверены, что открываете от запрета использования системы этого пользователя (Комментарии)"}
							</p>
						</div>
						<div className="flex justify-end">
							<Button.Default type="secondary" buttonType="button" onClick={() => setUnLock(false)}>
								{t("Отменить")}
							</Button.Default>
							<Button.Default type="primary" buttonType="submit" loading={isSubmitting} className="ml-2">
								{t("Да")}
							</Button.Default>
						</div>
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default UnLock;
