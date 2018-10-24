import gql from 'graphql-tag';
import * as React from 'react';
import {Query} from 'react-apollo';

import adapt from '../../common/components/Adapt';
import WithPlaylistId from '../../common/components/WithPlaylistId';
import ToggleSearch from '../../common/mutations/ToggleSearch';
import {nullToUndefined} from '../../common/utils';
import CreatePlaylist, {createPlaylistUpdate} from '../mutations/CreatePlaylist';
import Playlist from './Playlist';

const query = gql`
	query PlaylistQuery($playlist: String!) {
		search @client {
			isSearchOpen
		}

		playlist(where: {name: $playlist}) {
			id
			tracks {
				id
			}
		}
	}
`;

const Composed = adapt(
	{
		toggleSearch: ToggleSearch.thunk(),
		playlist: <WithPlaylistId />
	},
	{
		data: ({children, playlist}) => (
			<Query query={query} variables={{playlist}}>
				{props => children(nullToUndefined(props.data))}
			</Query>
		),
		createPlaylist: ({children, playlist}) => (
			<CreatePlaylist variables={{playlist}} update={createPlaylistUpdate(playlist)}>
				{children}
			</CreatePlaylist>
		)
	}
);

export default function PlaylistContainer() {
	return (
		<Composed>
			{({
				data: {search: {isSearchOpen} = {isSearchOpen: false}, playlist: {tracks} = {tracks: []}},
				toggleSearch,
				playlist,
				createPlaylist
			}) => (
				<Playlist
					playlist={playlist}
					isSearchOpen={isSearchOpen}
					toggleSearch={toggleSearch}
					trackCount={tracks.length}
					createPlaylist={createPlaylist}
				/>
			)}
		</Composed>
	);
}
