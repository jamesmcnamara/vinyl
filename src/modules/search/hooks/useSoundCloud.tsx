import {DocumentNode} from 'graphql';
import gql from 'graphql-tag';
import {useQuery} from 'react-apollo-hooks';

import {toQueryString} from '../../common/utils';

const SOUNDCLOUD_API_KEY = '32eb3539260715fa1251fcf9989263f2';

function getSoundCloudUrl(query: string) {
	return toQueryString({
		q: query,
		limit: 10,
		client_id: SOUNDCLOUD_API_KEY
	});
}

const SOUNDCLOUD_QUERY: DocumentNode = gql`
	query SOUNDCLOUD_API_KEY($path: String!) {
		soundCloudResults @rest(type: "SoundCloudResult", endpoint: "soundcloud", path: $path) {
			id
			title
			description
			thumbnail: artwork_url
			url: permalink_url
		}
	}
`;

interface $QueryData {
	soundCloudResults: $SoundCloudResult[];
}

export interface $SoundCloudResult {
	__typename: 'SoundCloudResult';
	id: number;
	title: string;
	description: string;
	thumbnail: string | null;
	url: string;
}

export default function useSoundCloud(query: string) {
	const {data: {soundCloudResults} = {soundCloudResults: []}} = useQuery<$QueryData>(
		SOUNDCLOUD_QUERY,
		{
			variables: {path: getSoundCloudUrl(query)},
			context: {debounceKey: 'SoundCloudSearch'},
			fetchPolicy: 'network-only',
			suspend: false
		}
	);
	return soundCloudResults;
}
