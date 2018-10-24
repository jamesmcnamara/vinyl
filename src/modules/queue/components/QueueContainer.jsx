import gql from 'graphql-tag';
import * as React from 'react';
import {Subscription} from 'react-apollo';
import {toast} from 'react-toastify';

import adapt from '../../common/components/Adapt';
import SpinnerQuery from '../../common/components/SpinnerQuery';
import Toast from '../../common/components/Toast';
import WithPlaylistId from '../../common/components/WithPlaylistId';
import PlaylistFragments from '../../common/fragments/PlaylistFragments';
import TogglePlaying from '../../common/mutations/TogglePlaying';
import {nullToUndefined} from '../../common/utils';
import DeleteTrack from '../mutations/DeleteTrack';
import UpdatePlaying from '../mutations/UpdatePlaying';
import Queue from './Queue';

const query = gql`
	query Queue($playlist: String!) {
		playlist(where: {name: $playlist}) {
			...AllPlaylist
		}

		player @client {
			currentlyPlaying {
				id
			}
			playing
		}
	}
	${PlaylistFragments.all}
`;

const ON_TRACK_ADDED = gql`
	subscription OnTrackAdded($playlist: String!) {
		playlist(where: {node: {name: $playlist}}) {
			node {
				...AllPlaylist
			}
		}
	}
	${PlaylistFragments.all}
`;

const Composed = adapt(
	{
		playlist: <WithPlaylistId />,
		updatePlaying: <UpdatePlaying variable="track" />,
		deleteTrack: <DeleteTrack simple />,
		togglePlaying: <TogglePlaying toggle="played" />
	},
	{
		_: ({children, playlist}) => (
			<Subscription subscription={ON_TRACK_ADDED} variables={{playlist}}>
				{children}
			</Subscription>
		),
		data: ({children, playlist}) => (
			<SpinnerQuery query={query} variables={{playlist}} postProcess={nullToUndefined}>
				{({data}) => children(data)}
			</SpinnerQuery>
		)
	}
);

export default function QueueContainer() {
	return (
		<Composed>
			{({
				data: {
					playlist: {tracks} = {tracks: []},
					player: {currentlyPlaying, playing}
				},
				playlist,
				updatePlaying,
				deleteTrack,
				togglePlaying
			}) => (
				<Queue
					tracks={tracks}
					playing={playing}
					togglePlaying={togglePlaying}
					updatePlaying={track => {
						// Need to check if it's already playing, otherwise it actually
						// stops playback
						if (!playing) {
							togglePlaying(true);
						}
						updatePlaying(track);
					}}
					deleteTrack={track => {
						deleteTrack({playlist, trackId: track.id});
						toast(<Toast message="Song Deleted" />);
					}}
					currentlyPlayingId={currentlyPlaying && currentlyPlaying.id}
				/>
			)}
		</Composed>
	);
}
