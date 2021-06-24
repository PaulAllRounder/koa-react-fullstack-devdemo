/*
 * A useState hook wrapper with callback
 * Because useState don't support 2nd callback argument anymore, so use this wrapper instead.
 * Now you can use state value synchornous in callback function.
 * Note:
 * core concept -- ref.current is a kinda 'All-purpos adhesive' :-)
*/
import { 
	useEffect,
	useState,
	useRef,
} from 'react';

const useCallbackState = (initStateVal) => {
	const callbackRef = useRef();
	const [stateData, setStateData] = useState(initStateVal);

	useEffect(() => {
		callbackRef.current && callbackRef.current(stateData);
	}, [stateData]);

	return [stateData, (val, callback) => {
		callbackRef.current = callback;
		setStateData(val);
	}];
};

export default useCallbackState;
