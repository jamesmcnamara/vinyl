import gql from 'graphql-tag';

import {mutation} from '../../common/mutation';

interface $Variables {
	query: string;
}

export default mutation<$Variables>(gql`
	mutation SetSearch($query: String!) {
		updateQuery(query: $query) @client
	}
`);
