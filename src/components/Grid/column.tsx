import React, { ReactNode, FC } from "react";
import cx from "classnames";

type column = {
	xs: 2 | 3 | 4 | 6 | 8 | 12;
	sm: 1 | 2 | 3 | 4 | 6 | 8 | 9;
	md: 2 | 3 | 4 | 6 | 7 | 8 | 9;
	lg: 2 | 3 | 4 | 6 | 7 | 8 | 9;
	xl: 1 | 2 | 3 | 4 | 6 | 8 | 9 | 12;
	xxl: 2 | 3 | 5 | 6 | 9 | 10 | 12;
};

interface IColumnProps {
	children: string | ReactNode;
	className?: string;
	xs: column["xs"];
	sm?: column["sm"];
	md?: column["md"];
	lg?: column["lg"];
	xl?: column["xl"];
	xxl: column["xxl"];
	[x: string]: any;
}

const ColumnComponent: FC<IColumnProps> = ({ children, className, xs = 12, sm, md, lg, xl, xxl, ...otherProps }): JSX.Element => {
	const classNames = cx(
		`col-span-${xs}`,
		sm && `sm:col-span-${sm}`,
		md && `md:col-span-${md}`,
		lg && `lg:col-span-${lg}`,
		xl && `xl:col-span-${xl}`,
		xxl && `xxl:col-span-${xxl}`,
		className && className
	);

	return (
		<div className={classNames} {...otherProps}>
			{children}
		</div>
	);
};

export default ColumnComponent;
