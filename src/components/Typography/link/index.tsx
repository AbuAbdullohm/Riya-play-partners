import React, { FC, ReactNode } from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

interface ILinkComponent {
	type?: "Anchor" | "Link";
	url: string;
	weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
	color?:
		| "dark-grey"
		| "grey"
		| "yellow"
		| "red"
		| "green"
		| "blue"
		| "black";
	children: string | ReactNode;
	className?: string;
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

const LinkComponent: FC<ILinkComponent> = ({
	type = "link",
	url,
	weight = "normal",
	color="",
	children,
	className
}): JSX.Element => {
	const classNames = cx(
		`font-${weight} block`,
		getColor(color),
		className && className
	);

	if (type === "anchor")
		return (
			<a href={url} className={classNames}>
				{children}
			</a>
		);

	return (
		<Link to={url} className={classNames}>
			{children}
		</Link>
	);
};

export default LinkComponent;
