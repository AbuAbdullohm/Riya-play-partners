import React, { FC, ReactNode } from "react";
import cx from "classnames";

interface IBoardProps {
	className?: string;
	children: string | ReactNode;
	height?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
	[x: string]: any;
}

const BoardComponent: FC<IBoardProps> = ({
	className,
	children,
	height=7,
	...otherProps
}): JSX.Element => {
	const classNames = cx(`h-full`, className && className);
	return (
		<div className={`intro-y chat mt-5`} {...otherProps}>
			<div
				className={`chat__box box`}
				style={{ height: `calc(10vh + ${height}0vh)` }}>
				<div className={classNames}>{children}</div>
			</div>
		</div>
	);
};

export default BoardComponent;
