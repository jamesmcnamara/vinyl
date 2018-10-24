import gql from 'graphql-tag';
import * as React from 'react';
import {Query} from 'react-apollo';

import adapt from '../../common/components/Adapt';
import TrackFragments from '../../common/fragments/TrackFragments';
import {PlayNext} from '../../common/mutations/ChangeSong';
import SetDuration from '../../common/mutations/SetDuration';
import SetPlayed from '../../common/mutations/SetPlayed';
import ToggleExpanded from '../../common/mutations/ToggleExpanded';
import PlayerBox from './PlayerBox';

const query = gql`
	query PlayerContainer {
		player @client {
			currentlyPlaying {
				...AllTrack
			}
			playing
			played
			duration
			expanded
		}
	}
	${TrackFragments.all}
`;

const Composed = adapt({
	playNext: <PlayNext />,
	toggleExpanded: <ToggleExpanded toggle="maybeValue" />,
	setPlayed: <SetPlayed variable="played" />,
	setDuration: <SetDuration variable="duration" />,
	data: ({children}) => <Query query={query}>{({data}) => children(data)}</Query>
});

export default function PlayerContainer() {
	return (
		<Composed>
			{({
				data: {
					player: {currentlyPlaying, playing, played, duration, expanded}
				},
				playNext,
				toggleExpanded,
				setPlayed,
				setDuration
			}) => (
				<PlayerBox
					expanded={expanded}
					currentlyPlaying={currentlyPlaying}
					playing={playing}
					played={played}
					duration={duration}
					toggleExpanded={toggleExpanded}
					playNext={playNext}
					setPlayed={setPlayed}
					setDuration={setDuration}
				/>
			)}
		</Composed>
	);
}
