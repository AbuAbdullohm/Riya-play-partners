import React, { FC } from "react";
import avatar from "./avatar.svg";
import pattern from "assets/images/pattern.jpg";
import "./style.scss";
import cx from "classnames";

interface IAvatarProps {
	className?: string;
	size?: "lg" | "md";
	src: string;
	isProduct?: boolean;
	isRectangle?: boolean;
	hasBadge?: boolean;
	zoomIn?: boolean
}

const AvatarComponent: FC<IAvatarProps> = ({
	className = "",
	size = "md",
	src,
	hasBadge,
	isProduct,
	isRectangle,
	zoomIn = true,
}): JSX.Element => {
	const classNames = cx(
		"avatar",
		`avatar--${size}`,
		isRectangle ? "avatar--rectangle" : "",
		zoomIn ? "zoom-in" : "",
		className
	);

	return (
		<div className={classNames}>
			{isProduct ? (
				<img src={src ? src : pattern} alt="" />
			) : (
				<img src={src ? src : avatar} alt="" />
			)}

			{hasBadge ? <span className="avatar__badge" /> : null}
		</div>
	);
};

export default AvatarComponent;
