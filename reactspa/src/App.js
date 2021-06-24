import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from "react-router-dom";

import MainLayout from './layouts/Main.js';
import AuthLayout from './layouts/Auth.js';
import GlobalLoading from './components/GlobalLoading';

function App() {
  return (
		<>
			<GlobalLoading />
		<Router>
			<Switch>
				<Route path="/main" component={MainLayout} />
				<Route path="/auth" component={AuthLayout} />
				<Redirect from="/" to="/main/index" />
			</Switch>
		</Router>
		</>
	);
}

export default App;
