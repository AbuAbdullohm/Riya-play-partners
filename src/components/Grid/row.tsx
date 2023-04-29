import React, { FC, ReactNode } from "react";
import cx from "classnames";

type row = {
	cols: 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9 | 12;
	gutter: 1 | 2 | 3 | 4 | 5 | 6;
	gutterX: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12;
	gutterY: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12;
};

interface IRowProps {
	children: string | ReactNode;
	className?: string;
	cols: row["cols"];
	gutter?: row["gutter"];
	gutterX?: row["gutterX"];
	gutterY?: row["gutterY"];
	[x: string]: any;
}

const RowComponent: FC<IRowProps> = ({
	children,
	className,
	cols = 12,
	gutter = 4,
	gutterX,
	gutterY = 3,
	...otherProps
}): JSX.Element => {
	const classNames = cx(
		"grid",
		cols && `grid-cols-${cols}`,
		gutter && `gap-${gutter}`,
		gutterX && `gap-x-${gutterX}`,
		gutterY && `gap-y-${gutterY}`,
		className && className
	);

	return (
		<div className={classNames} {...otherProps}>
			{children}
		</div>
	);
};

export default RowComponent;
