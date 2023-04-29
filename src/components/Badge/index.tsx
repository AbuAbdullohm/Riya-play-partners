import React, { FC, ReactNode } from "react";
import cx from "classnames";

interface IBadgeProps {
	type: "rounded" | "squared";
	children: string | ReactNode;
	className?: string;
	outlined?: boolean;
	size: "xs" | "sm" | "md" | "lg";
	color: "white" | "grey" | "yellow" | "red" | "green" | "blue";
	[x: string]: any;
}

function getColor(color: string, outlined: boolean) {
	switch (color) {
		case "white":
			return "text-gray-700 dark:text-gray-600 dark:border-dark-5";
		case "grey":
			return "bg-gray-200 text-gray-600";
		case "yellow":
			return outlined
				? "border-theme-23 text-theme-12 dark:border-theme-12"
				: "bg-theme-23 text-white";
		case "red":
			return outlined
				? "border-theme-24 text-theme-6 dark:border-theme-6"
				: "bg-theme-24 text-white";
		case "green":
			return outlined
				? "border-theme-10 text-theme-9 dark:border-theme-9"
				: "bg-theme-10 text-white";
		case "blue":
			return outlined
				? "border-theme-17 text-theme-1 dark:text-theme-10 dark:border-theme-10"
				: "bg-theme-17 text-white";
		default:
			return "";
	}
}

function getSize(size: string) {
	switch (size) {
		case "xs":
			return "text-xs";
		case "md":
			return "px-2 py-2";
		case "lg":
			return "px-3 py-3";
		case "sm":
		default:
			return "px-1 py-1";
	}
}

const BadgeComponent: FC<IBadgeProps> = ({
	children,
	className,
	type = "rounded",
	size = "sm",
	color = "blue",
	outlined = false,
	...otherProps
}): JSX.Element => {
	const classNames = cx(
		"border",
		type === "rounded" ? "rounded-full" : "",
		className && className,
		getColor(color, outlined),
		getSize(size)
	);

	return (
		<span className={classNames} {...otherProps}>
			{children}
		</span>
	);
};

export default BadgeComponent;
