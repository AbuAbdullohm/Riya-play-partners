import React, { FC } from "react";
import cx from "classnames";

type TSeparatorProps = {
	border: "solid" | "dashed";
};

const SeparatorComponent: FC<TSeparatorProps> = ({
	border = "solid"
}): JSX.Element => {
	const classNames = cx(
		"w-full border-t border-gray-200 dark:border-dark-5 mt-5",
		border === "dashed" ? "border-dashed" : ""
	);

	return <div className={classNames}></div>;
};

export default SeparatorComponent;
