import {DocumentNode} from 'graphql';
import gql from 'graphql-tag';
import * as React from 'react';
import {Query} from 'react-apollo';

import {toQueryString} from '../../common/utils';

const SOUNDCLOUD_API_KEY = '32eb3539260715fa1251fcf9989263f2';

function getSoundCloudUrl(query: string) {
	return toQueryString({
		q: query,
		limit: 10,
		client_id: SOUNDCLOUD_API_KEY
	});
}

const query: DocumentNode = gql`
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
export interface $SoundCloudResult {
	__typename: 'SoundCloudResult';
	id: string;
	title: string;
	description: string;
	thumbnail: string | null;
	url: string;
}

interface $Props {
	search: string;
	children(data: $SoundCloudResult[]): React.ReactNode;
}

export default function SoundCloudQueryContainer({search, children}: $Props) {
	if (!search) {
		return <>{children([])}</>;
	}
	return (
		<Query
			query={query}
			variables={{path: getSoundCloudUrl(search)}}
			context={{debounceKey: 'SoundCloudSearch'}}
			fetchPolicy="network-only"
		>
			{({data}) => children(data ? data.soundCloudResults : [])}
		</Query>
	);
}
