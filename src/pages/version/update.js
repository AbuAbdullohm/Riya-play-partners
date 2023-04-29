import React from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Typography } from "components";
import Form from "./components/form";
import { useNotification } from "hooks";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import qs from "query-string";

const Update = ({ location, history, match }) => {
	const { notification } = useNotification();
	const { id } = match.params;
	const { t } = useTranslation();
	const query = qs.parse(location.search);
	let { page } = query;
	return (
		<EntityContainer.One entity="versions" version="v2" name={`versions`} url={`/versions/${id}`} primaryKey="id" id={id} params={{}}>
			{({ item, isFetched }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить уведомление")}
						</Typography.Heading>

						<EntityForm.Main
							method={"put"}
							entity="versions"
							name={`versions`}
							version="v2"
							url={`/versions/${get(item, "id")}`}
							primaryKey="id"
							normalizeData={data => data}
							id={id}
							onSuccess={() => {
								notification("Успешно обновлено", {
									type: "success"
								});
								history.push(`/version?page=${page}`);
							}}
							onError={() => {
								notification("Что-то пошло не так", {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "type",
									value: get(item, "type"),
									required: true
								},
								{
									name: "comment_app",
									value: get(item, "comment_app"),
									required: true
								},
								{
									name: "dev_report",
									value: get(item, "dev_report"),
									required: true
								},
								{
									name: "version",
									required: false,
									value: get(item, "version"),
									onSubmitValue: value => value && value
								},
								{
									name: "status",
									value: get(item, "status"),
									onSubmitValue: value => (value ? 1 : 0),
									required: true
								}
							]}
							params={{}}>
							{({ isSubmitting, values, setFieldValue }) => {
								return (
									<>
										<Form
											{...{
												values,
												setFieldValue,
												isSubmitting,
												isUpdate: true
											}}
										/>
									</>
								);
							}}
						</EntityForm.Main>
					</>
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
