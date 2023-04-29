import React, { useState } from "react";

import { Fields, Grid } from "../../../../components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";

const TracksList = ({ setFieldValue, values, initialValue, options }) => {
	const { t } = useTranslation();

	const [inputFields, setInputFields] = useState([{ name: "", path: "", name_select: "" }]);

	// useEffect(() => {
	//     checkRequired();
	// }, [])

	// const handleSubmit = e => {
	//     e.preventDefault();
	//     console.log("inputFields", inputFields);
	// };

	const handleInputChange = (e, index) => {
		const innerValues = [...inputFields];
		innerValues[index].name = e.target.value;

		setInputFields(innerValues);
		setFieldValue("tracks", [...inputFields]);
		// checkRequired();
	};

	const handleSelectChange = (e, index) => {
		const innerValues = [...inputFields];
		if (e !== null) {
			innerValues[index].path = e.value;
		} else {
			innerValues[index].path = "";
		}
		setInputFields(innerValues);
		setFieldValue("tracks", [...inputFields]);
	};

	// const checkRequired = (event, index) => {
	//     if (get(event, "target.value", false)) {
	//         if (event.target.value && event.target.nextElementSibling.classList.contains("hide")) {
	//             event.target.nextElementSibling.classList.remove("hide")
	//         }
	//         else {
	//             if (!event.target.nextElementSibling.classList.contains("hide")) {
	//                 event.target.nextElementSibling.classList.add("hide")
	//             }
	//         }
	//     }
	// }

	const handleAddFields = () => {
		const innerValues = [...inputFields];
		innerValues.push({ name: "", path: "", name_select: "" });
		setInputFields(innerValues);
	};

	const handleRemoveFields = index => {
		const innerValues = [...inputFields];
		if (inputFields.length > 1) {
			innerValues.splice(index, 1);
			setInputFields(innerValues);
		}
	};

	return (
		<>
			<div className="form-row">
				{inputFields.map((inputField, index) => (
					<Grid.Row key={`${inputField}~${index}`} gutter={10} gutterX={4} className={"mb-5 align-items-end"}>
						<Grid.Column xs={12} lg={4}>
							<div className="form-group relative">
								<label className="form-label" htmlFor="TracksListName">
									{t("Формат")}
								</label>
								<input
									type="name"
									className="form-control"
									id="TracksListName"
									name="name"
									required
									onChange={event => handleInputChange(event, index)}
									// onBlur={event => checkRequired(event, index)}
									placeholder={t("Формат")}
									value={inputField.name}
								/>
								{/* <div className="text-theme-24 absolute left-0 hide">
                                    <span>{t("Required")}</span>
                                </div> */}
							</div>
						</Grid.Column>
						<Grid.Column xs={12} lg={6}>
							<Field
								label="Дорожка"
								component={Fields.Select}
								// name={`track-${index}`}
								className="mb-0"
								required
								isSearchable={true}
								isClearable={true}
								handleChange={e => handleSelectChange(e, index)}
								optionLabel="name"
								optionValue="value"
								placeholder="Поиск"
								options={options}
							/>
							{/* <label className='form-label' htmlFor="TracksListNameTrack">track</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="TracksListNameTrack"
                                    name="track"
                                    onChange={event => handleInputChange(index, event)}
                                    value={inputField.track}
                                /> */}
						</Grid.Column>
						<Grid.Column xs={12} lg={2}>
							<div className="d-flex">
								<button
									className="btn btn-outline-danger mr-4 w100"
									style={{ width: "100%" }}
									type="button"
									onClick={() => handleRemoveFields(index)}>
									-
								</button>
								<button className="btn btn-outline-success w-100" style={{ width: "100%" }} type="button" onClick={() => handleAddFields()}>
									+
								</button>
							</div>
						</Grid.Column>
					</Grid.Row>
				))}
			</div>
			<br />
			<pre>{JSON.stringify(inputFields, null, 2)}</pre>
		</>
	);
};

export default TracksList;
