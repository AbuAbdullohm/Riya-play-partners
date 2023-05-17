import React, { Component } from "react";

import { storage } from "services";
import config from "./config";
import systemActions from "store/actions/system";
import authActions from "store/actions/auth";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import i18next from "i18next";
import { withRouter } from "react-router";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null
		};
	}

	componentDidMount() {
		const { ChangeLanguage, GetMeRequest, ChangeTheme, GetDownloadFile, GetAddDay, auth } = this.props;

		if (auth.isAuthenticated) {
			GetDownloadFile();
			GetAddDay();
		}

		const workTime = JSON.parse(storage.get("workTime"));
		const token = storage.get("token");

		if (!token || !workTime || Object.values(workTime).length === 0) {
			storage.set("workTime", JSON.stringify({ active: false, time: 0 }));
		}

		GetMeRequest();

		if (!storage.get("theme")) {
			ChangeTheme(config.DEFAULT_THEME);
			storage.set("theme", config.DEFAULT_THEME);
			document.documentElement.className = config.DEFAULT_THEME;
		} else {
			ChangeTheme(storage.get("theme"));
			document.documentElement.className = storage.get("theme");
		}

		if (storage.get("language")) {
			ChangeLanguage(storage.get("language"));
			i18next.changeLanguage(storage.get("language"));
		} else {
			ChangeLanguage(config.DEFAULT_LANGUAGE);
			i18next.changeLanguage(config.DEFAULT_LANGUAGE);
		}
	}

	render() {
		const { children, auth } = this.props;
		const { error } = this.state;
		if (error) {
			return (
				<div className="error-page error-page__sentry">
					<div className="error-ico" />
					<div className="error-text">Something went wrong !!!</div>
					<span className="error-btn mx-btn btn-solid info">Report feedback</span>
				</div>
			);
		}

		return (
			<>
				<div id="custom-alert-zone" />
				{children(auth)}
			</>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth
});

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			ChangeLanguage: systemActions.ChangeLanguage,
			ChangeTheme: systemActions.ChangeTheme,
			GetMeRequest: authActions.GetMe,
			// GetRates: systemActions.GetRates
			GetDownloadFile: systemActions.GetDownloadFile,
			GetAddDay: systemActions.GetAddDay
		},
		dispatch
	);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
