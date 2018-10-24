import * as _f from 'lodash/fp';
import * as React from 'react';

import SoundCloudQueryContainer from './SoundCloudQueryContainer';
import {$Result} from './types';
import YoutubeQueryContainer from './YoutubeQueryContainer';

const interleave = _f.pipe(
	_f.zip,
	_f.flatMap(_f.identity),
	_f.filter<$Result>(Boolean)
);

interface $Props {
	search: string;
	children(results: $Result[]): React.ReactNode;
}

export default function TrackSearchContainer({search, children}: $Props) {
	if (!search) {
		return <>{children([])}</>;
	}
	return (
		<YoutubeQueryContainer search={search}>
			{youtubeResults => (
				<SoundCloudQueryContainer search={search}>
					{soundcloudResults => children(interleave(youtubeResults, soundcloudResults))}
				</SoundCloudQueryContainer>
			)}
		</YoutubeQueryContainer>
	);
}
