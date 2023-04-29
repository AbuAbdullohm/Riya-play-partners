import React, { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";

interface IUrlProps {
	id: string | number;
	title: string;
	url: string;
	icon?: ReactNode;
	className?: string;
}

interface ITabProps {
	className?: string;
	urls: IUrlProps[];
	children: ReactNode;
}

const TabComponent: FC<ITabProps> = ({
	className,
	urls,
	children
}): JSX.Element => {
	const classNames = cx(
		"nav nav-tabs flex-col sm:flex-row justify-center lg:justify-start",
		className && className
	);
	return (
		<div className={classNames}>
			{urls &&
				urls.map(item => (
					<Link
						key={item.id}
						to={item.url}
						className={`py-3 px-3 sm:mr-8 ${item.className}`}>
						{item.title}
					</Link>
				))}
			{children && <>children</>}
		</div>
	);
};

export default TabComponent;
