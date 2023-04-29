import React, { FC } from "react";
import IconInner from "./IconInner";
import SpinnerIcon from "./spinner";

export interface IIcon {
	name: string;
	className?: string;
	size?: number;
	fill?: string;
	spinner?: boolean;
	strokeColor?: string;
	strokeWidth?: number;
	onClick?: Function;
	[x: string]: any;
}

const IconComponent: FC<IIcon> = ({
	name,
	className,
	size = 24,
	otherProps,
	fill = "none",
	strokeColor = "currentColor",
	strokeWidth = 2,
	spinner = false,
	onClick
}: IIcon): JSX.Element => {
	if (spinner)
		return <SpinnerIcon name={name} n={className} t={fill} size={size} />;
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill={fill}
			stroke={strokeColor}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			onClick={onClick ? () => onClick() : null}
			className={`feather feather-${name} ${className}`}
			{...otherProps}>
			<IconInner name={name} />
		</svg>
	);
};

export default IconComponent;
