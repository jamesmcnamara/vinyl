import * as _f from 'lodash/fp';

import {$Result} from '../components/types';
import useSoundCloud from './useSoundCloud';
import useYoutube from './useYoutube';

const interleave = _f.pipe(
	_f.zip,
	_f.flatMap(_f.identity),
	_f.filter<$Result>(Boolean)
);

export default function useTrackSearch(search: string) {
	if (!search) {
		return [];
	}
	const youtubeResults = useYoutube(search);
	const soundcloudResults = useSoundCloud(search);
	return interleave(youtubeResults, soundcloudResults);
}
