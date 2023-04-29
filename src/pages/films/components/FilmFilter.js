import React, { useState, useEffect } from "react";
import Actions from "modules/entity/actions";
import { Formik, Form, Field } from "formik";
import { Fields, Button } from "components";
import { useDispatch } from "react-redux";
import moment from "moment";
const FilmFilter = ({ film, filmFilter }) => {
	const dispatch = useDispatch();
	const [filmValue, setFilmValue] = useState();
	const [data, setData] = useState();
	const [click, setClick] = useState(false);

	useEffect(() => {
		if (filmFilter === false) {
			setData(null);
		}

		if (click) {
			setClick(!click);
			dispatch(
				Actions.LoadDefault.request({
					url: `films/count-statistics`,
					version: "v2",
					params: {
						extra: {
							film_id: film ? film.id : "",
							start: filmValue ? filmValue.start[0] : "",
							end: filmValue ? filmValue.start[1] : ""
						}
					},

					cb: {
						success: (data, resetForm) => {
							setData(data);
							resetForm();
						},
						error: () => {},
						finally: () => {}
					}
				})
			);
		}
	}, [click, filmFilter]);
	return (
		<Formik
			initialValues={{
				start: []
			}}
			onSubmit={value => value}
			render={({ values, setFieldValue, handleSubmit }) => {
				if (filmFilter === false) {
					values.start = [];
					if (filmValue) {
						filmValue.start = [];
					}
				}

				return (
					<div className="d-flex align-center justify-between">
						<Form className="mr-5 d-flex ">
							<Field
								component={Fields.NewDatePicker}
								name="start"
								type="range"
								isClearable={true}
								label="Дата"
								maxDate={moment().toDate()}
								onChange={value => {
									setData(undefined);
									setFieldValue("start", value);
								}}
							/>

							{values.start.length > 0 && (
								<div style={{ marginTop: "27px" }}>
									<Button.Default
										className="ml-5"
										buttonType="submit"
										onClick={() => {
											setFilmValue({ start: [...values.start.slice(0, 1), values.start[1] + 86399] });
											setClick(!click);
										}}>
										Выбрать
									</Button.Default>
								</div>
							)}
						</Form>
						{values.start.length >= 2 && data >= 0 && (
							<div className="filmFilter">
								<p>{`Количество просмотров между выбранными днями: ${data}`}</p>
							</div>
						)}
					</div>
				);
			}}
		/>
	);
};

export default FilmFilter;
