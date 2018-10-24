import gql from 'graphql-tag';
import * as React from 'react';
import {Query} from 'react-apollo';
import {toast} from 'react-toastify';

import adapt from '../../common/components/Adopt';
import Toast from '../../common/components/Toast';
import WithPlaylistId from '../../common/components/WithPlaylistId';
import ToggleSearch from '../../common/mutations/ToggleSearch';
import AddToPlaylist, {variablesForAddToPlaylist} from '../mutations/AddToPlaylist';
import SetSearch from '../mutations/SetSearch';
import Search from './Search';
import TrackSearchContainer from './TrackSearchContainer';

const SEARCH_QUERY = gql`
	query SearchContainer {
		search @client {
			query
			isSearchOpen
		}
	}
`;
interface $QueryData {
	search: {
		query: string;
		isSearchOpen: boolean;
	};
}

interface $RenderProp<T> {
	children(args: T): React.ReactNode;
}

const Composed = adapt(
	{
		toggleSearch: ToggleSearch.thunk(),
		playlist: ({children}: $RenderProp<string>) => <WithPlaylistId>{children}</WithPlaylistId>,
		setSearch: SetSearch.variable('query'),
		addToPlaylist: AddToPlaylist.simple(),
		data: ({children}: $RenderProp<$QueryData>) => (
			<Query query={SEARCH_QUERY}>{props => children(props.data)}</Query>
		)
	},
	{
		results: ({data, children}) => (
			<TrackSearchContainer search={data.search.query}>{children}</TrackSearchContainer>
		)
	}
);

export default function SearchContainer() {
	return (
		<Composed>
			{({
				data: {
					search: {query, isSearchOpen}
				},
				playlist,
				results,
				setSearch,
				addToPlaylist,
				toggleSearch
			}) => (
				<Search
					isSearchOpen={isSearchOpen}
					toggleSearch={toggleSearch}
					query={query}
					results={results}
					setSearch={setSearch}
					enqueue={track => {
						addToPlaylist(variablesForAddToPlaylist(track, playlist));
						toast(<Toast message="Song Added!" />);
					}}
					clearSearch={() => setSearch('')}
				/>
			)}
		</Composed>
	);
}
