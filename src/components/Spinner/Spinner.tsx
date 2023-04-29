import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import "./style.scss";
import { Icon } from "..";

interface ISpinnerProps {
	name?: string;
	color?: string;
	className?: string;
	isCenter?: boolean;
	tips?: string;
	[x: string]: unknown;
}

const SpinnerComponent: FC<ISpinnerProps> = ({
	name = "puff",
	color = "rgba(20, 46, 113, 1)",
	className = "w-14 h-14",
	isCenter = false,
	children,
	tips,
	...otherProps
}): JSX.Element => {
	const { t } = useTranslation();
	return (
		<div className={`spinner-container ${isCenter ? "spinner-center" : ""}`} {...otherProps}>
			<div className="spinner-position">
				<Icon spinner={true} name={name} fill={color} className={className} />
				{tips && (
					<div className="tips" style={{ color: color }}>
						{t(tips)}
					</div>
				)}
			</div>
		</div>
	);
};

export default SpinnerComponent;
