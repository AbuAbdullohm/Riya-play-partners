import React from "react";
import EntityForm from "modules/entity/forms";
import ModalForm from "./formSeriesModal";
import { Spinner } from "components";
import { useNotification } from "hooks";
import get from "lodash/get";
import { useParams } from "react-router";

const CreateSeriesModal = ({ item, showCreateModal, updateSeries, canUpdate, setCanUpdate }) => {
	const { id } = useParams();
	const { notification } = useNotification();

	return (
		<EntityForm.Main
			method="post"
			entity="series"
			name={`series`}
			url="/series"
			version="v2"
			prependData={true}
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				updateSeries(data, id);
				showCreateModal(false);
				notification("Успешно добавлено", {
					type: "success"
				});
				setCanUpdate(!canUpdate);
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			fields={[
				{
					name: "name_uz",
					required: true
				},
				{
					name: "name_ru",
					required: true
				},
				{
					name: "track",
					value: [{ name: "", name_select: "", path: null }],
					onSubmitValue: value =>
						value.reduce(
							(prev, curr) => [
								...prev,
								{
									name: get(curr, "name"),
									name_select: get(curr, "name_select"),
									path: get(curr, "path")
								}
							],
							[]
						)
				},
				{
					name: "sort",
					required: false,
					onSubmitValue: field => Number(field)
				},
				{
					name: "photo",
					value: [],
					onSubmitValue: value => (value ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : null)
				},
				{
					name: "film_id",
					value: Number(id)
				},
				{
					name: "season_id",
					required: false,
					type: "object",
					onSubmitValue: field => (field ? field.id : null)
				},
				{
					name: "sort",
					required: false
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}
			params={{
				include: "translations,files,track,film"
			}}>
			{({ isSubmitting, values, setFieldValue }) => {
				return isSubmitting ? <Spinner /> : <ModalForm {...{ item, values, setFieldValue, isUpdate: false }} />;
			}}
		</EntityForm.Main>
	);
};

export default CreateSeriesModal;
