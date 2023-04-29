import React from "react";
import { get } from "lodash";
import "./style.scss";
import EntityForm from "modules/entity/forms";

const Update = ({ selected, setUpdateModal }) => {
	return (
		<>
			{selected && (
				<EntityForm.Main
					method="put"
					entity="log"
					name="all"
					url={`/log/${get(selected, "id")}`}
					primaryKey="id"
					updateData={true}
					normalizeData={data => data}
					id={get(selected, "id")}
					fields={[
						{
							name: "data",
							value: get(selected, "data", ""),
							required: true
						}
					]}>
					{({ isSubmitting, values, setFieldValue }) => {
						return (
							<>
								<p className="logs-word">{JSON.stringify(values.data)}</p>
							</>
						);
					}}
				</EntityForm.Main>
			)}
		</>
	);
};

export default Update;
