import React, { FC, ReactNode } from "react";
import cx from "classnames";

interface IPanelProps {
	className?: string;
	children: string | ReactNode;
	slideFrom?: "y" | "x";
	header?: string | ReactNode;
	headerClass?: string;
	footer?: string | ReactNode;
	footerClass?: string;
	bodyClass?: string;
	pad?: string;
	[x: string]: any;
}

const PanelComponent: FC<IPanelProps> = ({
	slideFrom = "y",
	className,
	children,
	header,
	headerClass,
	footer,
	footerClass,
	bodyClass,
	pad = "p-5",
	...otherProps
}): JSX.Element => {
	const classNames = cx(`intro-${slideFrom} box`, className && className);

	return (
		<div className={classNames} {...otherProps}>
			{header && (
				<div className={`flex items-center justify-between p-5 border-b border-gray-200 dark:border-dark-5 ${headerClass ? headerClass : ""}`}>
					{header}
				</div>
			)}
			<div className={`preview ${pad} ${bodyClass ? bodyClass : ""}`}>{children}</div>
			{footer && (
				<div className={`flex items-center justify-between p-5 border-t border-gray-200 dark:border-dark-5 ${footerClass ? footerClass : ""}`}>
					{footer}
				</div>
			)}
		</div>
	);
};

export default PanelComponent;
