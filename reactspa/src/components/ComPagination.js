/*
 * A pagination component for pets table
*/

import { 
	Pagination,
	PaginationItem,
	PaginationLink,
} from 'reactstrap';
import useCallbackState from '../utilities/useCallbackState';
import classNames from 'classnames';

const ComPagination = ( props ) => {
	const [pnum, setPnum] = useCallbackState(1);

	const clickPage = (currPage) => {
		if(currPage === pnum) return;
		setPnum(currPage);
		props.pageHandler(currPage);
	};

	const prevPage = () => {
		if(pnum > 1 ) {
			setPnum(pnum - 1, (pnum) => {
				props.pageHandler(pnum);
			});
		}
	}

	const nextPage = () => {
		if(pnum < props.totalPage) {
			setPnum(pnum + 1, (pnum) => {
				props.pageHandler(pnum);
			});
		}
	}

	const pageEles = [];
	for( let i=1; i<=props.totalPage; i++ ) {
		pageEles.push(
			<PaginationItem 
				key={`pi${i}`}
				className={classNames({active: pnum === i})}
			>
				<PaginationLink
					onClick={ () => clickPage(i) }
				>
					{ i }
				</PaginationLink>
			</PaginationItem>
		);
	}

	return (
		<Pagination
			listClassName="justify-content-end mb-0"
		>
			<PaginationItem
				className={classNames({disabled: pnum <= 1})}
			>
				<PaginationLink
					onClick={ prevPage }
				>
					<i className="fas fa-angle-left" />
				</PaginationLink>
			</PaginationItem>
			{ pageEles }
			<PaginationItem
				className={classNames({disabled: pnum >= props.totalPage})}
			>
				<PaginationLink
					onClick={ nextPage }
				>
					<i className="fas fa-angle-right" />
				</PaginationLink>
			</PaginationItem>	
		</Pagination>
	);
};

export default ComPagination;
