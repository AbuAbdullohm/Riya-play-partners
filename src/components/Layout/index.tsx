import React from "react";
// import Header from "./components/Header";
import Profile from "components/Profile";
import SideBar from "./components/Sidebar";
import { menu } from "./components/Sidebar/menu";
import "./style.scss";

const Layout = (props: HTMLElement) => {
	const { children } = props;
	return (
		<>
			<div className="wrapper">
				<div className="wrapper-box">
					<Profile />
					<SideBar menu={menu} />
					<div className="content">{children}</div>
				</div>
			</div>
		</>
	);
};

export default Layout;
