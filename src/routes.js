import React, { lazy, Suspense } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { history } from "store";
import { Layout } from "components";
import { get } from "lodash";

import App from "./App";

const Login = lazy(() => import("./pages/auth/login"));
const Logout = lazy(() => import("./pages/auth/logout"));
const Confirm = lazy(() => import("./pages/auth/confirm"));

const Posts = lazy(() => import("./pages/posts"));
const PostsCreate = lazy(() => import("./pages/posts/create"));
const PostsUpdate = lazy(() => import("./pages/posts/update"));

const Advertising = lazy(() => import("./pages/advertising"));
const AdvertisingCreate = lazy(() => import("./pages/advertising/create"));
const AdvertisingUpdate = lazy(() => import("./pages/advertising/update"));

const Series = lazy(() => import("./pages/series"));
const SeriesCreate = lazy(() => import("./pages/series/create"));
const SeriesUpdate = lazy(() => import("./pages/series/update"));

const Users = lazy(() => import("./pages/users"));
const User = lazy(() => import("./pages/user"));
// const UsersCreate = lazy(() => import("./pages/users/create"));
const UsersUpdate = lazy(() => import("./pages/users/update"));

const ForeignUser = lazy(() => import("./pages/foreignUser"));
const ForeignUserCreate = lazy(() => import("./pages/foreignUser/create"));
const ForeignUserUpdate = lazy(() => import("./pages/foreignUser/update"));

const Actors = lazy(() => import("./pages/actors"));
const ActorsCreate = lazy(() => import("./pages/actors/create"));
const ActorsUpdate = lazy(() => import("./pages/actors/update"));

const Promocode = lazy(() => import("./pages/promocode"));
const PromocodeCreate = lazy(() => import("./pages/promocode/create"));
const PromocodeUpdate = lazy(() => import("./pages/promocode/update"));

const Makers = lazy(() => import("./pages/makers"));
const MakersCreate = lazy(() => import("./pages/makers/create"));
const MakersUpdate = lazy(() => import("./pages/makers/update"));

const Settings = lazy(() => import("./pages/settings"));
const SettingsCreate = lazy(() => import("./pages/settings/create"));
const SettingsUpdate = lazy(() => import("./pages/settings/update"));

const Pages = lazy(() => import("./pages/pages"));
const PagesCreate = lazy(() => import("./pages/pages/create"));
const PagesUpdate = lazy(() => import("./pages/pages/update"));

const Banners = lazy(() => import("./pages/banners"));
const BannersCreate = lazy(() => import("./pages/banners/create"));
const BannersUpdate = lazy(() => import("./pages/banners/update"));

const Category = lazy(() => import("./pages/categories"));
const Seasons = lazy(() => import("./pages/seasons"));
const Tags = lazy(() => import("./pages/tags"));
const Review = lazy(() => import("./pages/review"));
const Translation = lazy(() => import("./pages/translations"));

const Films = lazy(() => import("./pages/films"));
const FilmsCreate = lazy(() => import("./pages/films/create"));
const FilmsUpdate = lazy(() => import("./pages/films/update"));

const Genres = lazy(() => import("./pages/genres"));
const GenresCreate = lazy(() => import("./pages/genres/create"));
const GenresUpdate = lazy(() => import("./pages/genres/update"));

const Types = lazy(() => import("./pages/types"));
const TypesCreate = lazy(() => import("./pages/types/create"));
const TypesUpdate = lazy(() => import("./pages/types/update"));

const Rates = lazy(() => import("./pages/rates"));
const RatesCreate = lazy(() => import("./pages/rates/create"));
const RatesUpdate = lazy(() => import("./pages/rates/update"));

const Notifications = lazy(() => import("./pages/notifications"));
const NotificationsCreate = lazy(() => import("./pages/notifications/create"));
const NotificationsUpdate = lazy(() => import("./pages/notifications/update"));

const ReasonForBlocking = lazy(() => import("./pages/ReasonForBlocking"));
const Profile = lazy(() => import("./pages/profile"));

const Spisalice = lazy(() => import("./pages/spisalice"));
const SpisaliceCreate = lazy(() => import("./pages/spisalice/create"));
const SpisaliceUpdate = lazy(() => import("./pages/spisalice/update"));

const Logs = lazy(() => import("./pages/logs"));
const Buggalter = lazy(() => import("./pages/buggalter"));

const Menu = lazy(() => import("./pages/menu"));
const MenuView = lazy(() => import("./pages/menu/view"));

const Reklama = lazy(() => import("./pages/reklama"));
const ReklamaCreate = lazy(() => import("./pages/reklama/create"));
const ReklamaUpdate = lazy(() => import("./pages/reklama/update"));

const ReklamaSettings = lazy(() => import("./pages/reklamaSettings"));
const ReklamaSettingsCreate = lazy(() => import("./pages/reklamaSettings/create"));
const ReklamaSettingsUpdate = lazy(() => import("./pages/reklamaSettings/update"));

const Version = lazy(() => import("./pages/version"));
const VersionCreate = lazy(() => import("./pages/version/create"));
const VersionUpdate = lazy(() => import("./pages/version/update"));

const Dashboard = lazy(() => import("./pages/dashboard2"));
// const Dashboard2 = lazy(() => import("./pages/dashboard2"));

const routes = [
	{ path: "/", exact: true, component: Dashboard, access: ["super_admin"] },
	{ path: "/", exact: true, component: Films, access: ["admin", "moderator"] },
	{ path: "/", exact: true, component: Review, access: ["redactor"] },
	{ path: "/", exact: true, component: Buggalter, access: ["bookkeeping"] },

	{ path: "/films", exact: true, component: Films, access: ["super_admin", "admin", "moderator"] },
	{ path: "/films/create", exact: true, component: FilmsCreate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/films/update/:id", exact: true, component: FilmsUpdate, access: ["super_admin", "admin", "moderator"] },

	{ path: "/advertising", exact: true, component: Advertising, access: ["super_admin", "admin", "moderator"] },
	{ path: "/advertising/create", exact: true, component: AdvertisingCreate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/advertising/update/:id", exact: true, component: AdvertisingUpdate, access: ["super_admin", "admin", "moderator"] },

	{ path: "/posts", exact: true, component: Posts, access: ["super_admin", "admin", "moderator"] },
	{ path: "/posts/create", exact: true, component: PostsCreate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/posts/update/:id", exact: true, component: PostsUpdate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/logout", exact: true, component: Logout, access: ["super_admin", "admin", "moderator", "bookkeeping", "redactor"] },

	{ path: "/series", exact: true, component: Series, access: ["super_admin", "admin", "moderator"] },
	{ path: "/series/create", exact: true, component: SeriesCreate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/series/update/:id", exact: true, component: SeriesUpdate, access: ["super_admin", "admin", "moderator"] },

	{ path: "/settings", exact: true, component: Settings, access: ["super_admin", "admin", "moderator"] },
	{ path: "/settings/create", exact: true, component: SettingsCreate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/settings/update/:id", exact: true, component: SettingsUpdate, access: ["super_admin", "admin", "moderator"] },

	{ path: "/users", exact: true, component: Users, access: ["super_admin", "admin", "moderator"] },
	{ path: "/user/:id", exact: true, component: User, access: ["super_admin", "admin", "moderator"] },
	// { path: "/users/create", exact: true, component: UsersCreate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/users/update/:id", exact: true, component: UsersUpdate, access: ["super_admin", "admin", "moderator"] },

	{ path: "/foreign-user", exact: true, component: ForeignUser, access: ["super_admin", "admin", "moderator"] },
	{ path: "/foreign-user/create", exact: true, component: ForeignUserCreate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/foreign-user/update/:id", exact: true, component: ForeignUserUpdate, access: ["super_admin", "admin", "moderator"] },

	{ path: "/actors", exact: true, component: Actors, access: ["super_admin", "admin", "moderator"] },
	{ path: "/actors/create", exact: true, component: ActorsCreate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/actors/update/:id", exact: true, component: ActorsUpdate, access: ["super_admin", "admin", "moderator"] },

	{ path: "/promo-code", exact: true, component: Promocode, access: ["super_admin"] },
	{ path: "/promo-code/create", exact: true, component: PromocodeCreate, access: ["super_admin"] },
	{ path: "/promo-code/update/:id", exact: true, component: PromocodeUpdate, access: ["super_admin"] },

	{ path: "/makers", exact: true, component: Makers, access: ["super_admin", "admin", "moderator"] },
	{ path: "/makers/create", exact: true, component: MakersCreate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/makers/update/:id", exact: true, component: MakersUpdate, access: ["super_admin", "admin", "moderator"] },

	{ path: "/pages", exact: true, component: Pages, access: ["super_admin"] },
	{ path: "/pages/create", exact: true, component: PagesCreate, access: ["super_admin"] },
	{ path: "/pages/update/:id", exact: true, component: PagesUpdate, access: ["super_admin"] },

	{ path: "/banners", exact: true, component: Banners, access: ["super_admin", "admin", "moderator"] },
	{ path: "/banners/create", exact: true, component: BannersCreate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/banners/update/:id", exact: true, component: BannersUpdate, access: ["super_admin", "admin", "moderator"] },

	{ path: "/translation", exact: true, component: Translation, access: ["super_admin", "admin", "moderator"] },
	{ path: "/categories", exact: true, component: Category, access: ["super_admin", "admin", "moderator"] },
	{ path: "/seasons", exact: true, component: Seasons, access: ["super_admin", "admin", "moderator"] },
	{ path: "/tags", exact: true, component: Tags, access: ["super_admin", "admin", "moderator"] },
	{ path: "/review", exact: true, component: Review, access: ["super_admin", "admin", "moderator", "redactor"] },
	{ path: "/profile", exact: true, component: Profile, access: ["super_admin", "admin", "moderator", "bookkeeping", "redactor"] },

	{ path: "/genres", exact: true, component: Genres, access: ["super_admin", "admin", "moderator"] },
	{ path: "/genres/create", exact: true, component: GenresCreate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/genres/update/:id", exact: true, component: GenresUpdate, access: ["super_admin", "admin", "moderator"] },

	{ path: "/types", exact: true, component: Types, access: ["super_admin", "admin", "moderator"] },
	{ path: "/types/create", exact: true, component: TypesCreate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/types/update/:id", exact: true, component: TypesUpdate, access: ["super_admin", "admin", "moderator"] },

	{ path: "/rates", exact: true, component: Rates, access: ["super_admin", "admin", "moderator", "bookkeeping"] },
	{ path: "/rates/create", exact: true, component: RatesCreate, access: ["super_admin", "admin", "moderator", "bookkeeping"] },
	{ path: "/rates/update/:id", exact: true, component: RatesUpdate, access: ["super_admin", "admin", "moderator", "bookkeeping"] },

	{ path: "/notifications", exact: true, component: Notifications, access: ["super_admin", "admin"] },
	{ path: "/notifications/create", exact: true, component: NotificationsCreate, access: ["super_admin", "admin"] },
	{ path: "/notifications/update/:notification_id", exact: true, component: NotificationsUpdate, access: ["super_admin", "admin"] },

	{ path: "/reason-for-blocking-user", exact: true, component: ReasonForBlocking, access: ["super_admin", "admin", "moderator"] },
	{ path: "/spisalice", exact: true, component: Spisalice, access: ["super_admin", "admin", "moderator"] },
	{ path: "/spisalice/create", exact: true, component: SpisaliceCreate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/spisalice/update/:id", exact: true, component: SpisaliceUpdate, access: ["super_admin", "admin", "moderator"] },
	{ path: "/logs", exact: true, component: Logs, access: ["super_admin", "admin", "moderator"] },

	{ path: "/buggalter", exact: true, component: Buggalter, access: ["super_admin", "bookkeeping"] },

	{ path: "/menu", exact: true, component: Menu, access: ["super_admin", "admin"] },
	{ path: "/menu/view/:id", exact: true, component: MenuView, access: ["super_admin", "admin"] },

	{ path: "/reklama", exact: true, component: Reklama, access: ["super_admin", "admin"] },
	{ path: "/reklama/create", exact: true, component: ReklamaCreate, access: ["super_admin", "admin"] },
	{ path: "/reklama/update/:id", exact: true, component: ReklamaUpdate, access: ["super_admin", "admin"] },

	{ path: "/reklamaSettings", exact: true, component: ReklamaSettings, access: ["super_admin", "admin"] },
	{ path: "/reklamaSettings/create", exact: true, component: ReklamaSettingsCreate, access: ["super_admin", "admin"] },
	{ path: "/reklamaSettings/update/:id", exact: true, component: ReklamaSettingsUpdate, access: ["super_admin", "admin"] },

	{ path: "/version", exact: true, component: Version, access: ["super_admin", "admin"] },
	{ path: "/version/create", exact: true, component: VersionCreate, access: ["super_admin", "admin"] },
	{ path: "/version/update/:id", exact: true, component: VersionUpdate, access: ["super_admin", "admin"] },

	{ path: "/dashboard", exact: true, component: Dashboard, access: ["super_admin"] }
	// { path: "/dashboard2", exact: true, component: Dashboard2, access: ["super_admin", "admin"] }

	// { path: "/notifications/create", exact: true, component: NotificationsCreate },
	// { path: "/notifications/update/:notification_id", exact: true, component: NotificationsUpdate }
];

const super_admin = routes.filter(route => route.access.includes("super_admin"));
const admin = routes.filter(route => route.access.includes("admin"));
const moderator = routes.filter(route => route.access.includes("moderator"));
const bookkeeping = routes.filter(route => route.access.includes("bookkeeping"));
const redactor = routes.filter(route => route.access.includes("redactor"));

const getRole = role => {
	if (role === "admin") return admin;
	else if (role === "super_admin") return super_admin;
	else if (role === "bookkeeping") return bookkeeping;
	else if (role === "redactor") return redactor;
	else return moderator;
};

export default () => (
	<Router {...{ history }}>
		<App>
			{({ isAuthenticated, isFetched, data }) => {
				return isFetched && isAuthenticated ? (
					<Layout>
						<Suspense fallback={""}>
							<Switch>
								{getRole(get(data, "role", "moderator")).map((route, key) => (
									<Route key={key} exact={route.exact} component={route.component} path={route.path} />
								))}
								{/* <Redirect to="/" /> */}
							</Switch>
						</Suspense>
					</Layout>
				) : (
					<Suspense fallback={""}>
						<Switch>
							<Route path="/" component={Login} exact />
							<Route path="/confirm/:code" component={Confirm} exact />
							<Redirect from="*" to="/" />
						</Switch>
					</Suspense>
				);
			}}
		</App>
	</Router>
);
