import React from "react";
import { useHistory, useLocation } from "react-router";

const ErrorPage = () => {
	const history = useHistory();
	return (
		<div className="container">
			<div className="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left">
				<div className="-intro-x lg:mr-20">
					<img alt="ADMIN PANEL" className="h-48 lg:h-auto" src={require("assets/images/error-illustration.svg")} />
				</div>
				<div className="mt-10 lg:mt-0">
					<div className="intro-x text-8xl font-medium">404</div>
					<div className="intro-x text-xl lg:text-3xl font-medium mt-5">Oops. This page has gone missing.</div>
					<div className="intro-x text-lg mt-3">You may have mistyped the address or the page may have moved.</div>
					<button
						onClick={() => {
							history.goBack();
						}}
						className="intro-x btn py-3 px-4 dark:border-dark-5 dark:text-gray-300 mt-10">
						Back
					</button>
				</div>
			</div>
		</div>
	);
};

export default ErrorPage;
