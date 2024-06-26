import React, { FC } from "react";
import cx from "classnames";

function getBgColor(color: string) {
	switch (color) {
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

interface IProgressBarProps {
	className?: string;
	rounded?: boolean;
	valueMax: number;
	valueMin: number;
	valueNow: number;
	color?: "dark-blue" | "orange" | "yellow" | "red" | "green" | "blue";
	customColor?: string;
	height?: "small" | "medium" | "large";
	showValue?: boolean;
}

const ProgressBarComponent: FC<IProgressBarProps> = ({
	className,
	rounded = true,
	valueMax = 100,
	valueMin = 0,
	valueNow = 40,
	color = "blue",
	customColor,
	height = "large",
	showValue = true
}): JSX.Element => {
	const classNames = cx(
		"progress mt-3",
		rounded && "rounded",
		className && className,
		height === "medium" ? "h-3" : height === "large" ? "h-4" : ""
	);

	return (
		<div className={classNames}>
			<div
				className={`progress-bar 
                        ${rounded ? "rounded" : ""} 
                        ${color && getBgColor(color)}`}
				role="progressbar"
				aria-valuenow={valueNow}
				aria-valuemin={valueMin}
				aria-valuemax={valueMax}
				style={{
					width: `${valueNow}%`,
					background: `${customColor}`,
				}}>
				{showValue && <>{valueNow}%</>}
			</div>
		</div>
	);
};

export default ProgressBarComponent;
