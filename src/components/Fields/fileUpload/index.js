import React, { useState } from "react";
import { ReactComponent as FileIcon } from "./fileIcon.svg";
import File from "./file";
import SystemActions from "store/actions/system";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { Loader } from "components";
import { get } from "lodash";

const Index = ({
	isDoc = false,
	onlyOneType = "",
	multiple = false,
	onChangeHandler = () => {},
	onDeleteHandler = () => {},
	limit = 1,
	items = [],
	label = "",
	activeFolder,
	field,
	form,
	version = "v1"
}) => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const fileHandler = files => {
		setLoading(true);
		let formData = new FormData();
		files.forEach((file, i) => formData.append(`files[${i}]`, file));
		if (activeFolder) {
			formData.append("folder_id", activeFolder.id);
		}

		const cb = {
			success: uploadedFiles => {
				onChangeHandler([...items, ...Object.values(uploadedFiles)]);
			},
			failure: err => {
				console.log(err);
			},
			finally: () => {
				setLoading(false);
			}
		};

		dispatch(SystemActions.UploadFile({ files: formData, cb, version }));
	};

	const deleteHandler = file => {
		const id = get(file, "id");

		const newItems = items.filter(item => item.id !== file.id);
		onDeleteHandler(id, newItems);
		// onChangeHandler(newItems);
		const cb = {
			success: uploadedFiles => {
				onChangeHandler(newItems);
			},
			failure: err => {
				// setError(err);
			},
			finally: () => {
				setLoading(false);
			}
		};

		dispatch(SystemActions.DeleteFile({ id, cb }));
	};

	const { getRootProps, getInputProps } = useDropzone({
		accept:
			isDoc && onlyOneType
				? onlyOneType
				: isDoc && !onlyOneType
				? ".jpeg,.jpg,.svg,.png,.doc,.docx,.xls,.xlsx,.pdf,.zip,.rar,.mp4,.avi,.bmp,.mov,.qt,.mkv,.mpeg2,.mpeg4,.mxf,.mts/* "
				: "image/*",
		onDrop: files => fileHandler(files)
	});

	return (
		<div className={`mb-5`}>
			{label && <label className="form-label">{label}</label>}
			<div
				className={`
            border-2 border-dashed rounded-md pt-4 relative
            ${field && form && form.touched[field.name] && form.errors[field.name] ? "border-theme-24" : "dark:border-dark-5"}
            `}>
				{items && items.length > 0 && (
					<div className="flex flex-wrap px-4">
						{items &&
							items.length > 0 &&
							items.map((item, index) => {
								return <File {...{ item, isDoc, deleteHandler }} key={index} />;
							})}
					</div>
				)}
				{items.length < limit && (
					<div {...getRootProps({})}>
						<input {...getInputProps()} multiple={multiple} />
						<div className="px-4 pb-4 flex items-center cursor-pointer relative dark:text-gray-500" style={{ outline: "0!important" }}>
							<FileIcon />
							<span className="text-theme-1 dark:text-gray-300 mr-1">Upload a file</span> or drag and drop
						</div>
					</div>
				)}

				{loading && <Loader />}
			</div>
		</div>
	);
};

export default Index;
