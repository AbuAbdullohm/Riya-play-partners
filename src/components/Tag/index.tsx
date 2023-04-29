import React, { FC, ReactNode } from "react";
import cx from "classnames";
import "./style.scss";

interface ITagProps {
	children: string | ReactNode;
	className?: string;
	color: "green" | "blue" | "red" | "black" | "purple" | "orange";
	bg: "green" | "blue" | "red" | "black" | "purple" | "orange";
}

const TagComponent: FC<ITagProps> = (props): JSX.Element => {
	const { children, className, color, bg } = props;
	const classNames = cx("d-tag", className, `d-tag--${color}`, `d-tag-bg-${bg}`);

	return <div className={classNames}>{children}</div>;
};

export default TagComponent;
