import React from "react";

const Sidebar = () => {
	return (
		<div className="navigation-skeleton">
			{[...Array(8)].map((item, index)=> (
				<div key={index} className="menu-skeleton">
					<div className="icon_menu skeleton-placeholder"/>
					<div className="menu_item skeleton-placeholder"/>
				</div>
			))}
		</div>
	);
};

export default Sidebar;