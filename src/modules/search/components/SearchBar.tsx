import * as React from 'react';
import styled from 'styled-components';

const StyledSearchBar = styled.input`
	background-color: rgb(36, 36, 36);
	border: 0;
	border-radius: 0;
	box-sizing: border-box;
	color: #f2f2f2;
	display: block;
	font-size: 1.25rem;
	outline: none;
	padding: 1rem 1rem;
	position: relative;
	width: 100%;
	caret-color: rgb(156, 77, 157);

	&::placeholder {
		color: rgba(255, 255, 255, 0.6);
	}
`;

interface $Props {
	query: string;
	onChange(query: string): void;
}

// Hack to make typing feel faster. Having the query flow through the whole mutation process
// takes almost 120ms, but doing a local state update takes 5ms
// Would be nice to do some performance auditing and find exactly why the update is so slow
// but this is fine for now (and likely forever)
export default class SearchBar extends React.Component<$Props> {
	state = {
		query: this.props.query
	};

	updateQuery = ({target: {value: query}}: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({query});
		setTimeout(() => this.props.onChange(query), 0);
	};

	render() {
		return (
			<StyledSearchBar
				data-id="search-bar-target"
				type="text"
				value={this.state.query}
				autoFocus
				placeholder="Start typing..."
				onChange={this.updateQuery}
			/>
		);
	}
}
