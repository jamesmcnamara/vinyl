import * as React from 'react';
import {has} from 'shades';
import styled from 'styled-components';
import {VelocityTransitionGroup} from 'velocity-react';

import {device} from '../../../styles/utilities/device';
import * as animations from '../../common/animations';
import ArrowNavigation from '../../common/components/ArrowNavigation';
import Track from '../../search/components/Track';

export default function Queue({
	color,
	tracks,
	updatePlaying,
	togglePlaying,
	currentlyPlayingId,
	playing,
	deleteTrack
}) {
	const isCurrentSong = has({id: currentlyPlayingId});

	return (
		<QueueList>
			<ArrowNavigation priority={ArrowNavigation.PRIORITY_MAP.QUEUE} childIsWrapped>
				<VelocityTransitionGroup
					enter={{
						animation: animations.rotate3d.in,
						display: 'flex',
						stagger: 90,
						duration: 850
					}}
					leave={{animation: animations.rotate3d.out, display: 'flex'}}
					runOnMount
				>
					{tracks.map(track => (
						<Track
							{...track.info}
							color={color}
							key={track.id}
							onClick={isCurrentSong(track) ? togglePlaying : () => updatePlaying(track)}
							deleteTrack={() => deleteTrack(track)}
							playing={playing}
							isCurrentSong={isCurrentSong(track)}
							highRes
						/>
					))}
				</VelocityTransitionGroup>
			</ArrowNavigation>
		</QueueList>
	);
}

const QueueList = styled.div`
	margin-bottom: 5rem;

	@media ${device.small} {
		margin-bottom: 10.25rem;
	}

	::-webkit-scrollbar {
		display: none;
	}
`;
