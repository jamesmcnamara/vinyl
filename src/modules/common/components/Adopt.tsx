import * as React from 'react';
import {set} from 'shades';

type $Composed<RP> = React.SFC<{children: React.SFC<MapToInputProp<RP>>}>;

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

function adaptReducer<RP, P extends keyof RP & string>(
	Component: $Composed<RP>,
	[propName, Instance]: [P, React.SFC<{children(arg: RP[P]): React.ReactNode}>]
): $Composed<RP> {
	const out: $Composed<RP> = ({children}) => (
		<Component>
			{(propObject: MapToInputProp<RP>) => {
				const childFn = (renderProp: RP[P]) => children(set(propName)(renderProp)(propObject));

				return <Instance {...propObject}>{childFn}</Instance>;
			}}
		</Component>
	);

	out.displayName = capitalize(propName);
	return out;
}

type RenderPropsInput<T> = T extends (params: {children(params: infer P): React.ReactNode}) => any
	? P
	: never;

type MapToInputProp<RP> = {[P in keyof RP]: RenderPropsInput<RP[P]>};

type AdaptInput = {[name: string]: React.SFC<{children: (input: {}) => React.ReactNode}>};
// Extension of React-Adopt (https://github.com/pedronauck/react-adopt)
// instead of taking a single map of objects, adapt can take multiple
// maps, and passes all the props collected from the 1->nth maps
// into each function/component of the n+1th map
// Allows later components to depend on earlier ones
function adapt<RP1 extends AdaptInput>(mapping: RP1): $Composed<RP1>;
function adapt<
	RP1 extends AdaptInput,
	RP2 extends {
		[name: string]: React.SFC<MapToInputProp<RP1> & {children(input: any): React.ReactNode}>;
	}
>(mapping1: RP1, mapping2: RP2): $Composed<RP1 & RP2>;
function adapt(...mappings: any[]): $Composed<any> {
	return mappings.reduce(
		(Comp, mapping) => Object.entries(mapping).reduce(adaptReducer, Comp),
		({children, ...rest}: any) => children(rest)
	);
}

export default adapt;
