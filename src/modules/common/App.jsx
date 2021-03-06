import 'react-toastify/dist/ReactToastify.css';

import {Route, Switch, BrowserRouter} from 'react-router-dom';
import * as React from 'react';
import {ToastContainer, toast, Slide} from 'react-toastify';

import {ROUTES} from '../routes/routes';
import Landing from '../landing/Landing';
import Nav from '../nav/NavContainer';
import ControlsContainer from '../controls/components/ControlsContainer';
import PlaylistContainer from '../playlist/components/PlaylistContainer';
import PlayerContainer from '../player/components/PlayerContainer';

export default function App() {
	return (
		<BrowserRouter>
			<div>
				<Nav />
				<Switch>
					<Route exact path={ROUTES.LANDING} component={Landing} />
					<Route path={ROUTES.PLAYER} component={PlaylistContainer} />
					<Route render={() => <div>Route does not exist!</div>} />
				</Switch>
				<ControlsContainer />
				<PlayerContainer />
				<ToastContainer
					position={toast.POSITION.BOTTOM_CENTER}
					transition={Slide}
					className="toast-container"
					toastClassName="toast"
					hideProgressBar
					closeButton={false}
					draggablePercent={60}
					autoClose={2500}
					duration={500}
				/>
			</div>
		</BrowserRouter>
	);
}
