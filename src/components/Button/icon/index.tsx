import React, { FC, ReactNode } from "react";
import cx from "classnames";
import Icon from "../../Icon";

interface IIconButtonProps {
	title: string;
	buttonType: "reset" | "button" | "submit";
	type?: "primary" | "secondary" | "success" | "warning" | "danger" | "dark";
	size?: "sm" | "md" | "lg";
	className?: string;
    rounded?: boolean,
	iconName: string;
	children: string | ReactNode;
	[x: string]: any;
}

const IconButtonComponent: FC<IIconButtonProps> = ({
	title = "",
	buttonType = "button",
	type = "primary",
	size = "md",
	className = "",
	rounded = false,
	iconName,
	children,
	...otherProps
}): JSX.Element => {
	const classNames = cx(
		"btn w-32 mr-2 mb-2",
		size === "md" ? "" : `btn-${size}`,
		rounded && `btn-rounded-${type}`,
		type && `btn-${type}`,
		className && className
	);

	return (
		<button type={buttonType} className={classNames} {...otherProps}>
			<Icon
				name={iconName}
				className={`mr-2 ${size === "lg" ? "w-5 h-5" : "w-4 h-4 "}`}
			/>{" "}
			{title && <>{title}</>} {children && <>{children}</>}
		</button>
	);
};

export default IconButtonComponent;
