import {DocumentNode} from 'graphql';
import * as React from 'react';
import {Mutation} from 'react-apollo';

type $SFCWithRenderProp<T> = React.SFC<{children(f: T): React.ReactNode}>;

interface $FastMutation<T> {
	thunk(): $SFCWithRenderProp<() => void>;

	toggle(name: keyof T): $SFCWithRenderProp<(value?: boolean) => void>;

	simple(): $SFCWithRenderProp<(value: T) => void>;

	variable<S extends keyof T>(name: S): $SFCWithRenderProp<(value: T[S]) => void>;
}

export function mutation<T>(mutationQL: DocumentNode): $FastMutation<T> {
	return {
		thunk() {
			return ({children}) => (
				<Mutation mutation={mutationQL}>{mutationFunc => children(() => mutationFunc())}</Mutation>
			);
		},

		toggle(name) {
			return ({children}) => (
				<Mutation mutation={mutationQL}>
					{mutationFunc =>
						children((maybeValue?: boolean) =>
							mutationFunc({
								variables: {[name]: typeof maybeValue === 'boolean' ? maybeValue : undefined}
							})
						)
					}
				</Mutation>
			);
		},

		simple() {
			return ({children}) => (
				<Mutation mutation={mutationQL}>
					{mutationFunc => children(value => mutationFunc({variables: value}))}
				</Mutation>
			);
		},

		variable(name) {
			return ({children}) => (
				<Mutation mutation={mutationQL}>
					{mutationFunc => children(value => mutationFunc({variables: {[name]: value}}))}
				</Mutation>
			);
		}
	};
}
