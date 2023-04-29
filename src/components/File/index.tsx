import React, { FC, ReactNode } from "react";
import { get, truncate } from "lodash";
import cx from "classnames";
import { Icon } from "../";
import { helpers } from "services";
import DefaultPhoto from "assets/images/preview.jpg";

function getFileType(fileType: string) {
	switch (fileType) {
		case "file":
			return "directory";
		case "image":
			return "image";
		case "video":
		case "music":
		default:
			return "file";
	}
}

function getBgColor(color: string | undefined) {
	switch (color) {
		case "light-grey":
			return "bg-gray-200";
		case "grey":
			return "bg-gray-400";
		case "dark-grey":
			return "bg-gray-700";
		case "dark-blue":
			return "bg-theme-1";
		case "orange":
			return "bg-theme-22";
		case "yellow":
			return "bg-theme-23";
		case "red":
			return "bg-theme-24";
		case "green":
			return "bg-theme-10";
		case "blue":
		default:
			return "bg-theme-17";
	}
}

type TMedia = "file" | "music" | "image" | "video";
type TBgColors =
	| "dark-blue"
	| "orange"
	| "yellow"
	| "red"
	| "green"
	| "blue"
	| "light-grey"
	| "grey"
	| "dark-grey";

interface IFileProps {
	item: any;
	size?: "small" | "large";
	mediaType?: TMedia;
	hasSelect?: boolean;
	hasMenu?: boolean;
	menu?: ReactNode;
	bgColor?: TBgColors;
	isDownload?: boolean;
	zoomIn?: boolean;
	removable?: string | ReactNode;
	className?: string;
	[x: string]: any;
}

const FileComponent: FC<IFileProps> = ({
	item,
	mediaType = "file",
	size = "large",
	hasSelect = false,
	hasMenu = false,
	menu,
	bgColor = "light-grey",
	isDownload = true,
	zoomIn = true,
	removable,
	className,
	...otherProps
}): JSX.Element => {
	const classNames = cx(
		`file box rounded-md ${
			size === "large" ? "px-5 pt-8 pb-5 px-3 sm:px-5" : "w-44 pt-5 pb-5"
		} relative ${zoomIn ? "zoom-in" : ""} ${getBgColor(bgColor)}`,
		className && className
	);
	const file = get(item, "thumbnails.small.src");
	return (
		<div className={classNames} {...otherProps}>
			{hasSelect && (
				<div className="absolute left-0 top-0 mt-3 ml-3">
					<input
						className="form-check-input border-theme-17"
						type="checkbox"
					/>
				</div>
			)}
			<a
				href={isDownload ? file : null}
				target="_blank"
				className={`w-3/5 file__icon file__icon--${getFileType(
					mediaType
				)} mx-auto`}>
				{mediaType === "image" ? (
					<div className="file__icon--image__preview image-fit">
						<img alt="" src={file ? file : DefaultPhoto} />
					</div>
				) : (
					<div className="file__icon__file-name">
						{get(item, "ext")}
					</div>
				)}
			</a>
			<a
				href={isDownload ? file : null}
				target="_blank"
				className="block font-medium mt-4 text-center truncate">
				{truncate(get(item, "title"), { length: 15 })}
			</a>
			<div className="text-gray-600 text-xs text-center mt-0.5">
				{helpers.formatBytes(get(item, "size"))}
			</div>
			{hasMenu && (
				<div className="absolute top-0 right-0 mr-2 mt-2 dropdown ml-auto">
					<a className="dropdown-toggle w-5 h-5 block">
						<Icon
							name="more-vertical"
							className="w-5 h-5 text-gray-600"
						/>
					</a>
					<div className="dropdown-menu w-40">
						<div className="dropdown-menu__content box dark:bg-dark-1 p-2">
							{menu}
						</div>
					</div>
				</div>
			)}
			{removable && removable}
		</div>
	);
};

export default FileComponent;
