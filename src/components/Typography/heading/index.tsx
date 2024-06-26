import React, { FC } from "react";
import cx from "classnames";

function getHeadingType(type: number) {
	switch (type) {
		case 2:
			return "text-3xl";
		case 3:
			return "text-2xl";
		case 4:
			return "text-xl";
		case 5:
			return "text-lg";
		case 6:
			return "";
		case 1:
		default:
			return "text-4xl";
	}
}

function getColor(color: string) {
	switch (color) {
		case "dark-grey":
			return "text-gray-700 dark:text-gray-600";
		case "grey":
			return "text-gray-600";
		case "yellow":
			return "text-theme-23";
		case "red":
			return "text-theme-24";
		case "green":
			return "text-theme-10";
		case "blue":
			return "text-theme-17";
		case "black":
		default:
			return "";
	}
}

interface IHeadingProps {
	type: 1 | 2 | 3 | 4 | 5 | 6;
	color?:
		| "dark-grey"
		| "grey"
		| "yellow"
		| "red"
		| "green"
		| "blue"
		| "black";
	className?: string;
	children: string;
	[x: string]: any;
}

const HeadingComponent: FC<IHeadingProps> = ({
	type = 1,
	color = "black",
	className,
	children,
	...otherProps
}): JSX.Element => {
	const classNames = cx(
		"font-medium",
		className && className,
		getHeadingType(type),
		getColor(color)
	);

	if (type === 2) {
		return (
			<h2 className={classNames} {...otherProps}>
				{children}
			</h2>
		);
	} else if (type === 3) {
		return (
			<h3 className={classNames} {...otherProps}>
				{children}
			</h3>
		);
	} else if (type === 4) {
		return (
			<h4 className={classNames} {...otherProps}>
				{children}
			</h4>
		);
	} else if (type === 5) {
		return (
			<h5 className={classNames} {...otherProps}>
				{children}
			</h5>
		);
	} else if (type === 6) {
		return (
			<h6 className={classNames} {...otherProps}>
				{children}
			</h6>
		);
	}

	return (
		<h1 className={classNames} {...otherProps}>
			{children}
		</h1>
	);
};

export default HeadingComponent;
