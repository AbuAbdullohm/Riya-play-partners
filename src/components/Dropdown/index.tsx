import React, { FC, ReactNode } from "react";
import cx from "classnames";

// function getPosition(position: string) {
// 	switch (position) {
// 		case "top-start":
// 			return "auto auto 110% 0";
// 		case "top-end":
// 			return "auto 0 110% auto";
// 		case "bottom-start":
// 			return "90% auto auto 0";
// 		case "bottom-end":
// 		default:
// 			return "90% 0 auto auto";
// 	}
// }

interface IDropdownProps {
	className?: string;
	header?: string | ReactNode;
	footer?: string | ReactNode;
	children: ReactNode;
	toggle: boolean;
	width?:
		| "w-32"
		| "w-56"
		| "w-48"
		| "w-44"
		| "w-64"
		| "w-72"
		| "w-52"
		| "w-40";
	// position?: "top-start" | "top-end" | "bottom-start" | "bottom-end";
	[x: string]: any;
}

const DropdownComponent: FC<IDropdownProps> = ({
	className,
	header,
	footer,
	children,
	toggle = false,
	width = "w-40",
	// position = "bottom-end",
	...otherProps
}): JSX.Element => {
	const classNames = cx(
		"dropdown-menu",
		className && className,
		toggle ? "show" : "",
		width && width
	);

	return (
		<div
			className={classNames}
			style={{
				inset: `100% 0 auto auto`
			}}
			{...otherProps}>
			<div className="dropdown-menu__content box dark:bg-dark-1">
				{header && (
					<div className="p-3 border-b border-gray-200 dark:border-dark-5 font-medium flex">
						{header}
					</div>
				)}
				<div className="p-2">{children}</div>
				{footer && (
					<div className="p-3 border-t border-gray-200 dark:border-dark-5 font-medium flex">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
};

export default DropdownComponent;
