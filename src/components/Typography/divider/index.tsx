import React, { FC, ReactNode } from "react";

type TDividerProps = {
	children: string | ReactNode;
};

const DividerComponent: FC<TDividerProps> = ({ children }): JSX.Element => {
	return (
		<div className="w-full flex justify-center border-t border-gray-200 dark:border-dark-5 mt-2">
			<div className="bg-white dark:bg-dark-3 px-5 -mt-3 text-gray-600">
				{children}
			</div>
		</div>
	);
};

export default DividerComponent;
