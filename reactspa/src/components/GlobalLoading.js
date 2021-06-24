import React, { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import classNames from 'classnames';
import loadingCounter from '../utilities/loadingCounter';

const GlobalLoading = ({color = 'primary', pointerEvents = 'auto', ...props}) => {
	//default primary color && pointer-events none style
	const [count, setCount] = useState(0);

	useEffect(() => {
		const injectId = loadingCounter.inject((_count) => {
			setCount(_count);
		});
		return () => {
			loadingCounter.unInject(injectId);
		};
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div 
			className={classNames('mask d-none justify-content-center align-items-center fixed-top', {'d-flex': count > 0})}
			style={{'pointerEvents': pointerEvents, 'zIndex': 9999, position: 'fixed'}}
		>
			<Spinner
				color={color}
				{...props}
			/>
		</div>
	);
}

export default GlobalLoading;
