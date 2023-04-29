import React from "react";
// import Header from "./components/Header";
import SideBar from "./components/Sidebar";
import { menu } from "./components/Sidebar/menu";
import Theme from "./components/theme";
import "./style.scss";

const Layout = (props: HTMLElement) => {
	const { children } = props;
	return (
		<>
			<div className="wrapper">
				<div className="wrapper-box">
					<SideBar menu={menu} />
					<div className="content">{children}</div>
				</div>
			</div>
			<Theme />
		</>
	);
};

export default Layout;
