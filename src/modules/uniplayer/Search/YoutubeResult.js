import styled from 'styled-components';
import React from 'react';

export default function YoutubeResult({
	onClick,
	highRes,
	snippet: {
		title,
		thumbnails: {
			default: {url: defaultUrl},
			high: {url: highUrl}
		}
	}
}) {
	return (
		<StyledResult onClick={onClick}>
			<ImageHolder>
				<img src={highRes && highUrl ? highUrl : defaultUrl} />
			</ImageHolder>
			<h4>{title}</h4>
		</StyledResult>
	);
}

const StyledResult = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0.5rem 1rem;
	transition: background-color 0.1s linear;

	&:hover {
		background-color: #d5d5d5;

		h4 {
			color: rgba(0, 0, 0, 1);
		}
	}

	h4 {
		overflow: hidden;
		color: rgba(0, 0, 0, 0.8);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		transition: color 0.1s linear;
	}
`;

const ImageHolder = styled.div`
	display: inline-block;
	position: relative;
	height: 4.125rem;
	overflow: hidden;
	margin-right: 0.75rem;
	min-width: 7.5rem;

	img {
		height: 5.625rem;
		position: absolute;
		top: -0.75rem;
		width: 7.5rem;
	}
`;
