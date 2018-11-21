import * as React from 'react';
import {toast} from 'react-toastify';

import Toast from '../../common/components/Toast';
import usePlaylistName from '../../common/hooks/usePlaylistName';
import {useStore} from '../../store';
import useTrackSearch from '../hooks/useTrackSearch';
import useAddToPlaylist from '../mutations/AddToPlaylist';
import Search from './Search';

export default function SearchContainer() {
	const {
		state: {
			search: {query, isSearchOpen}
		},
		actions: {
			search: {toggle, setter}
		}
	} = useStore();

	const addToPlaylist = useAddToPlaylist();

	const playlist = usePlaylistName();

	if (!playlist) {
		return null;
	}

	const results = useTrackSearch(query);

	return (
		<Search
			isSearchOpen={isSearchOpen}
			toggleSearch={toggle('isSearchOpen')}
			query={query}
			results={results}
			setSearch={setter('query')}
			enqueue={track => {
				addToPlaylist(track, playlist);
				toast(<Toast message="Song Added!" />);
			}}
			clearSearch={() => setter('query')('')}
		/>
	);
}
