import React, { FC, ReactNode } from "react";
import cx from "classnames";
interface ILinkButtonProps {
	title: string;
	type?: "primary" | "secondary" | "success" | "warning" | "danger" | "dark";
	size?: "sm" | "md" | "lg";
	url?: string;
	rounded?: boolean;
	className?: string;
	tooltip?: string,
	children: string | ReactNode;
	[x: string]: any;
}

const LinkButtonComponent: FC<ILinkButtonProps> = ({
	title = "",
	type = "primary",
	url,
	size = "md",
	className = "",
	rounded = false,
	children,
	tooltip,
	...otherProps
}): JSX.Element => {
	const classNames = cx(
		"btn mr-2 mb-2",
		type && `btn-${type}`,
		size === "md" ? "" : `btn-${size}`,
		rounded && ` btn-rounded-${type}`,
		className && className
	);

	return (
		<a
			href={url}
			className={classNames}
			target="_blank"
			rel="noopener noreferrer"
			{...otherProps}
			title={tooltip}
			>
			{title && <>{title}</>} {children && <>{children}</>}
		</a>
	);
};

export default LinkButtonComponent;
