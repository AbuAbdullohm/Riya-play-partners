import React, { FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePortal } from "hooks";

interface IPortalProps {
	children: ReactNode;
	className?: string;
	[x: string]: any;
}

const PortalComponent: FC<IPortalProps> = ({
	children,
	className,
	...otherProps
}) => {
	const target = usePortal("wrapper");

	const container = (
		<div className={className} {...otherProps}>
			{children}
		</div>
	);

	return createPortal(container, target);
};

export default PortalComponent;
