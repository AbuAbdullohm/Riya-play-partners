import React, { FC, useState } from "react";
import SystemActions from "../../../store/actions/system";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { helpers } from "services";
import { get, isEmpty } from "lodash";
import { Icon, Typography, File, Spinner } from "../../";
import { useTranslation } from "react-i18next";
interface IFieldProps {
	name: string;
	value: string[] | number[];
}

interface IFormProps {
	setFieldValue: Function;
}

interface IUploadProps {
	view: 1 | 2;
	isDoc?: boolean;
	multiple?: boolean;
	field: IFieldProps;
	label?: string;
	form: IFormProps;
}

const UploadComponent: FC<IUploadProps> = (props: IUploadProps) => {
	const {
		isDoc,
		view = 1,
		multiple = false,
		field = { name: "", value: [] },
		label,
		form: { setFieldValue }
	} = props;
	const { getRootProps, getInputProps } = useDropzone({
		accept: isDoc ? ".jpeg,.jpg,.svg,.png,.doc,.docx,.xls,.xlsx,.pdf,.zip,.rar,.mp4,.avi,.bmp,.mov,.qt,.mkv,.mpeg2,.mpeg4,.mxf,.mts" : "image/*",
		onDrop: (files: any) => fileHandler(files)
	});
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [file, setFile] = useState<any>(!isEmpty(field.value) ? field.value : null);
	const deleteFile = (id: number) => {
		setLoading(true);
		const cb = {
			success: () => {
				setFile(null);
			},
			failure: (err: any) => {
				setError(err);
			},
			finally: () => {
				setLoading(false);
			}
		};
		dispatch(SystemActions.DeleteFile({ id, cb }));
	};
	const fileHandler = (files: any) => {
		setLoading(true);
		let formData = new FormData();
		files.forEach((file: any, i: string) => formData.append(`files[${i}]`, file));

		const cb = {
			success: (uploadedFiles: any) => {
				setFile(uploadedFiles[0]);
				setFieldValue(field.name, uploadedFiles[0]);
			},
			failure: (err: any) => {
				setError(err);
			},
			finally: () => {
				setLoading(false);
			}
		};

		dispatch(SystemActions.UploadFile({ files: formData, cb }));
	};
	return (
		<div className="mb-5">
			{label && (
				<div className="flex justify-between">
					<label htmlFor={field.name} className="form-label">
						{t(label)}
					</label>
					{isDoc && file && (
						<Typography.Link type="Anchor" url={get(file, "thumbnails.small.src")}>
							{t("Скачать файл")}
						</Typography.Link>
					)}
				</div>
			)}
			<div className={`${view === 1 && file ? "relative" : "dropzone relative"}`}>
				{loading && <Spinner isCenter />}
				{!file && (
					<div>
						<input {...getInputProps()} name={field.name} multiple={multiple} />
					</div>
				)}
				<div className="dz-message" {...getRootProps({})}>
					{file && view === 2 ? (
						<div className="dz-preview dz-file-preview dz-processing dz-error dz-complete">
							<div className="dz-image">
								<img src={get(file, "thumbnails.small.src")} alt="" />
							</div>
							<div className="dz-details">
								<div className="dz-size">
									<span>{helpers.formatBytes(file.size)}</span>
								</div>
								{get(file, "title") && (
									<div className="dz-filename">
										<span>{file.title}</span>
									</div>
								)}
							</div>
							<div className="dz-progress">
								<span className="dz-upload"></span>
							</div>
							{error && (
								<div className="dz-error-message">
									<span>{error.toString()}</span>
								</div>
							)}
							<div
								title="Remove this image?"
								onClick={() => deleteFile(file.id)}
								className="tooltip w-5 h-5 flex items-center dropzone-remove-file justify-center absolute rounded-full text-white bg-theme-24 right-0 top-0 -mr-2 -mt-2 cursor-pointer">
								<Icon name="x" className="w-4 h-4" />
							</div>
						</div>
					) : file && view === 1 ? (
						<File
							item={file}
							mediaType="image"
							size="small"
							className="mt-5"
							bgColor="light-grey"
							isDownload={false}
							zoomIn={false}
							removable={
								<div
									title="Remove this image?"
									onClick={() => deleteFile(file.id)}
									className="tooltip w-5 h-5 flex items-center dropzone-remove-file justify-center absolute rounded-full text-white bg-theme-24 right-0 top-0 -mr-2 -mt-2 cursor-pointer">
									<Icon name="x" className="w-4 h-4" />
								</div>
							}
						/>
					) : (
						<div className="text-base font-medium cursor-pointer">{t("Поместите файлы сюда или нажмите, чтобы загрузить.")}</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default UploadComponent;
