import React, { FC, ReactNode } from "react";
import cx from "classnames";
import Icon from "../../Icon";
interface IDefaultButtonProps {
	title?: string;
	buttonType?: "reset" | "button" | "submit";
	type?: "primary" | "secondary" | "success" | "warning" | "danger" | "dark";
	size?: "sm" | "md" | "lg";
	rounded?: boolean;
	className?: string;
	children: string | ReactNode;
	loading?: boolean;
	loadingIcon?: "oval" | "spinning-circles" | "three-dots" | "puff";
	tooltip?: string;
	[x: string]: any;
}

const DefaultButtonComponent: FC<IDefaultButtonProps> = ({
	title = "",
	buttonType = "button",
	type = "primary",
	size = "md",
	className = "",
	rounded = false,
	loading = false,
	loadingIcon = "oval",
	tooltip,
	children,
	...otherProps
}): JSX.Element => {
	const classNames = cx("btn mr-2", size === "md" ? "" : `btn-${size}`, rounded && `btn-rounded-${type}`, type && `btn-${type}`, className && className);

	return (
		<button type={buttonType} className={classNames} {...otherProps} disabled={loading} title={tooltip}>
			{title && <>{title}</>} {children && <>{children}</>}{" "}
			{loading && <Icon name={loadingIcon} spinner={loading} fill="#fff" className={`ml-2 ${size === "lg" ? "w-5 h-5" : "w-4 h-4 "}`} />}
		</button>
	);
};

export default DefaultButtonComponent;
