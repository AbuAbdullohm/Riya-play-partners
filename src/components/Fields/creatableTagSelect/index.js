import React, { useEffect, useState } from "react";
import { uniqBy } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import Actions from "modules/entity/actions";
import { useNotification } from "hooks";
import Select from "react-select";
import { get } from "lodash";
import cx from "classnames";

const Index = ({ setFieldValue, values, initialValue }) => {
	const { notification } = useNotification();
	const theme = useSelector(state => state.system.theme);
	const dispatch = useDispatch();
	const [tags, setTags] = useState(initialValue);
	const [val, setVal] = useState("");

	useEffect(() => {
		loadTags("");
	}, []);

	const handleKeyDown = (event) => {
		setVal(event.target.value);
		if (event && (event.keyCode === 13)) {
			createTag(event.target.value);
		} else {
			event && loadTags(event.target.value);
		}
	};
	const createTag = (title) => {
		dispatch(Actions.Form.request({
			method: "post",
			entity: "tags",
			name: "tags",
			url: "/tags",
			values: {
				status: 1,
				title: title
			},
			cb: {
				success: (data) => {
					notification("Успешно", {
						type: "success",
						delay: 2000
					});
					setVal("");
					setFieldValue("tags", [...values.tags, data]);
				},
				error: () => {
					notification("Что-то пошло не так", {
						type: "danger",
						delay: 2000
					});
				},
				finally: () => {
				}
			}
		}));
	};

	const customStyle = {
		container: (provided) => ({
			...provided,
			minHeight: "20px",
			minWidth: "150px"
		}),
		control: (provided) => ({
			...provided,
			cursor: "pointer",
			borderColor: "rgba(0,0,0,.1)",
			border: "1px solid #e1e2e6",
			backgroundColor: theme === "dark" ? "rgba(35, 42, 59, 1)" : "",
			padding: "2px 10px 2px 0",
			minHeight: "20px",
			zIndex: 1
		}),
		indicatorSeparator: (provided) => ({
			...provided,
			display: "none"
		}),

		indicatorsContainer: (provided) => ({
			...provided,
			height: "30px"
		}),
		option: (provided) => {
			return {
				...provided,
				fontSize: "14px",
				color: theme === "dark" ? "rgba(113, 128, 150, 1)" : "",
				backgroundColor: "initial",
				cursor: "pointer",
				"&:hover": {
					backgroundColor:
						theme === "dark" ? "#3f4865" : "#B2D4FF"
				}
			};
		},
		menuPortal: (provided) => ({
			...provided,
			zIndex: 9999
		}),
		menu: (provided) => ({
			...provided,
			backgroundColor:
				theme === "dark" ? "rgba(35, 42, 59, 1)" : "#fff",
			zIndex: 9999
		}),
		singleValue: (provided) => {
			return {
				...provided,
				color: theme === "dark" ? "rgba(113, 128, 150, 1)" : "#000"
				// backgroundColor: "initial"
			};
		},
		placeholder: (provided) => ({
			...provided,
			fontSize: "14px",
			fontFamily: "Roboto",
			whiteSpace: "nowrap",
			color: theme === "dark" ? "rgba(74, 85, 104, 1)" : "rgba(160, 174, 192, 1)",
			overflow: "hidden",
			textOverflow: "ellipsis"
		}),
		multiValue: (provided) => {
			return {
				...provided,
				backgroundColor: theme === "dark" ? "rgba(20, 46, 113, 1)" : "rgb(223, 227, 235)"
			};
		},
		multiValueLabel: (provided) => {
			return {
				...provided,
				color: theme === "dark" ? "white" : "black"
			};
		},
		multiValueRemove: (provided) => ({
			...provided,
			color: theme === "dark" ? "#797979" : "black"

		})
	};


	
	const loadTags = (searchValue) => {
		dispatch(Actions.LoadOne.request({
			id: "#searchTag",
			primaryKey: "#searchTag",
			entity: "tags",
			name: `tags`,
			url: `/tags`,
			dataKey: "data",
			params: {
				filter: { status: 1 },
				limit: 100,
				extra: { title: searchValue }
			},
			normalizeData: false,
			cb: {
				success: data => {
					setTags(uniqBy([...data.data, ...tags], "id"));
				},
				error: () => {
					notification("Что-то пошло не так", {
						type: "danger", delay: 1000
					});
				},
				finally: () => {
				}
			}
		}));
	};

	const classes = cx(
		"form-field-select mb-5",
	);

	return (
		<div className={classes}>
			<Select
				label={"Тег"}
				optionLabel={"title"}
				optionValue={"id"}
				inputValue={val}
				onInputChange={e => setVal(e)}
				options={tags}
				value={get(values, "tags")}
				onChange={(option) => {
					setFieldValue("tags", option);
				}}
				styles={customStyle}
				onKeyDown={handleKeyDown}
				placeholder={"Выберите тег"}
				isMulti={true}
				isSearchable={true}
				isClearable={true}
				getValue={(option) => option["id"]}
				getOptionLabel={(option) => option["title"]}
				getOptionValue={(option) => option["id"]}
			/>
		</div>
	);
};

export default Index;