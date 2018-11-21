import {DocumentNode} from 'graphql';
import gql from 'graphql-tag';
import {useQuery} from 'react-apollo-hooks';

import {toQueryString} from '../../common/utils';

const YOUTUBE_API_KEY = 'AIzaSyCum4fCWhpcRNIh8VzD3Fhny5nxYYJrlTI';

function getYoutubeURL(query: string) {
	return toQueryString({
		q: query,
		key: YOUTUBE_API_KEY,
		part: 'snippet',
		type: 'video',
		videoEmbeddable: true,
		maxResults: 10,
		fields: 'items(snippet,id)'
	});
}

const YOUTUBE_QUERY: DocumentNode = gql`
	query Youtube($path: String!) {
		youtubeResults @rest(type: "YoutubePayload", endpoint: "youtube", path: $path) {
			items @type(name: "YoutubeResult") {
				id @type(name: "YoutubeId") {
					videoId
				}
				snippet @type(name: "YoutubeSnippet") {
					title
					thumbnails @type(name: "YoutubeThumbails") {
						default @type(name: "YoutubeThumbnailDefault") {
							url
						}
						high @type(name: "YoutubeThumbnailHigh") {
							url
						}
					}
				}
			}
		}
	}
`;

interface $QueryData {
	youtubeResults: {
		items: $YoutubeResult[];
	};
}

export interface $YoutubeResult {
	__typename: 'YoutubeResult';
	id: {
		videoId: string;
	};
	snippet: {
		title: string;
		thumbnails: {
			default: {
				url: string;
			};
			high: {
				url: string;
			};
		};
	};
}
export default function useYoutube(query: string) {
	const {data} = useQuery<$QueryData>(YOUTUBE_QUERY, {
		fetchPolicy: 'network-only',
		context: {debounceKey: 'YoutubeSearch'},
		variables: {path: getYoutubeURL(query)},
		suspend: false
	});

	return (data && data.youtubeResults && data.youtubeResults.items) || [];
}
