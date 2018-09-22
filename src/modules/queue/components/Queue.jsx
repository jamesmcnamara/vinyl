import React from 'react';
import styled from 'styled-components';

import Track from '../../search/components/Track';

export default function Queue({tracks, updatePlaying, currentlyPlayingId}) {
	return (
		<QueueList>
			{tracks.map(track => (
				<Track
					{...track.info}
					key={track.id}
					onClick={() => updatePlaying(track)}
					playing={currentlyPlayingId === track.id}
					highRes
				/>
			))}
		</QueueList>
	);
}

const QueueList = styled.div`
	overflow: hidden;
	overflow-y: scroll;
	width: 100%;
	max-height: 30rem;

	::-webkit-scrollbar {
		display: none;
	}
`;
