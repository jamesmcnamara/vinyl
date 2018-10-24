import gql from 'graphql-tag';

import {mutation} from '../mutation';

interface $Variables {
	isOpen: boolean;
}

export default mutation<$Variables>(gql`
	mutation ToggleSearch($isOpen: Boolean) {
		toggleSearch(isOpen: $isOpen) @client
	}
`);
