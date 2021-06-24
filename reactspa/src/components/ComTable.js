/*
 * Common table component for PetsList && MyPets
*/

import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  Table,
  UncontrolledTooltip,
} from "reactstrap";
import classNames from 'classnames';
import ComPagination from './ComPagination';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

/*
 * Modify the original css to make it have a good effect in dark mode.
*/
const StyledTd = styled.td`
	a.btn:hover {
		box-shadow: 0 7px 14px rgba(0, 0, 30, 0.1), 0 3px 6px rgba(0, 0, 0, 0.2);
	}
`;

const ComTable = (props) => {
	const tbodyData = props.tbodyData;
	const tableItems = tbodyData.map((t, n) => {
		return (
			<tr key={t.id}>
				<td>
					<Badge color="" className="badge-dot mr-2">
						<i className=
							{t.owner !== null? "bg-light" : "bg-success"}
						/>
					</Badge>
					<span 
						className={classNames('avatar rounded-circle mr-3', {'bg-primary': t.owner === null})}
						id={`${t.type}-${t.id}`}
					>
						<i className={classNames('fa text-dary', `fa-${t.type}`)} />
					</span>
					<UncontrolledTooltip
						delay={0}
						target={`${t.type}-${t.id}`}
					>
						{`Pet ${t.type}`}
					</UncontrolledTooltip>
				</td>
				{props.tableHead.filter( field  => field !== 'type' && field !== '')
					.map((field, index) => {
						return (
							<td key={`tdItem${index}`}>
								{t[field] === null? 'N/A' : t[field]}
							</td>
						);
				})}
				<StyledTd className="text-right">
					{/* eslint-disable-next-line */}
					<a
						className={classNames('btn-icon-only text-light btn btn-sm mr-2', {disabled: t.owner !== null && !props.btnActive})}
						onClick={() => props.adpBtnHandler(t.id, n)}
					>
						<i className="fas fa-ellipsis-v" />
					</a>
				</StyledTd>
			</tr>	
		);
	});

	const [totalPage, setTotalPage] = useState(0);
	useEffect(() => {
		if(props.totalPage) {
			(async () => {
				const tp = await props.totalPage(); 
				setTotalPage(tp);
			})();
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Card 
			className={classNames("shadow", {'bg-default': props.dark})}
		>
			<CardHeader className="border-0 bg-transparent">
				<h3 className={classNames('mb-0', {'text-white': props.dark})}>{props.title}</h3>
			</CardHeader>
			<Table 
				className={classNames("align-items-center table-flush", {'table-dark': props.dark})}
				responsive
			>
				<thead className={classNames(props.dark? 'head-dark' : 'head-light')}>
					<tr>
						{ props.tableHead.map( (t, n) => {
								return (
									<th scope="col" key={`thIndex${n}`}>
										{t}
									</th>
								);
						}) }
					</tr>
				</thead>
				<tbody>
					{tableItems}
				</tbody>
			</Table>
			{ props.totalPage &&
				<CardFooter>
							<ComPagination 
								totalPage={totalPage}
								pageHandler={ props.pageHandler }
							/>
				</CardFooter>
			}
		</Card>

	);
};

export default ComTable;
