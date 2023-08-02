import React, { FC, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import "./style.scss";
import { Icon, Loader } from "components";
import cx from "classnames";
import { boolean } from "yup";
interface IColumnProps {
	title: string;
	dataIndex: string;
	className?: string;
	isClickable?: boolean;
	render: Function;
	onHeaderClick?: Function;
}

interface ITableProps {
	items: [];
	rowKey?: string;
	actions?: boolean | ReactNode;
	columns: IColumnProps[];
	isFetched?: boolean;
	emptyUiText?: string;
	onRowClick?: Function;
	hasDelete?: boolean;
	deleteAction?: Function;
	hasEdit?: boolean;
	editIcon?: ReactNode;
	editAction?: Function;
	className?: string;
}

const TableComponent: FC<ITableProps> = ({
	items = [],
	rowKey = "id",
	columns = [],
	actions = false,
	isFetched = false,
	hasEdit = true,
	editAction,
	hasDelete = true,
	deleteAction,
	emptyUiText = "No data",
	className,
	onRowClick,
	editIcon
}): JSX.Element => {
	const classes = cx(
		`intro-y col-span-12 table-container overflow-auto ${onRowClick ? "cursor-pointer" : ""}`,
		!isFetched && "--loading",
		className && className
	);

	const { t } = useTranslation();

	return (
		<>
			<div className={classes}>
				{!isFetched && (
					<div className="--loading table-overlay">
						<div className="table-loader">
							<Loader />
						</div>
					</div>
				)}

				<table className="table table-report">
					<thead className="primary">
						<tr className="bg-gray-700 dark:bg-dark-1 text-white">
							{columns.map((col, i) => (
								<th
									key={i}
									className={`whitespace-nowrap ${get(col, "className")}`}
									onClick={() => {
										typeof col.onHeaderClick === "function" ? col.onHeaderClick(col) : null;
									}}>
									{get(col, "title")}
								</th>
							))}
							{actions ? <th className={`whitespace-nowrap`}></th> : null}
							{(hasEdit || hasDelete) && <th className="whitespace-nowrap" />}
						</tr>
					</thead>

					{items.length > 0 && (
						<tbody>
							{items.map(item => {
								return (
									<tr key={item[rowKey]} className="intro-y">
										{columns.map((col, id) => {
											return (
												<td
													key={id}
													className={get(col, "className")}
													onClick={() => {
														if (!get(col, "isClickable") && onRowClick) {
															onRowClick(item);
														}
													}}>
													{col.render(item[col.dataIndex], item)}
												</td>
											);
										})}
										{(hasEdit || hasDelete) && (
											<td className="table-report__action w-20">
												<div className="flex">
													{hasEdit && editAction && (
														<div className="flex items-center mr-3 cursor-pointer" onClick={() => editAction(item)}>
															{editIcon ? editIcon : <Icon name="edit" className="w-5 h-5 mr-1" />}
														</div>
													)}
													{hasDelete && deleteAction && (
														<div className="flex items-center text-theme-24 cursor-pointer" onClick={() => deleteAction(item)}>
															<Icon name="trash-2" className="w-5 h-5 mr-1" />
														</div>
													)}
												</div>
											</td>
										)}
									</tr>
								);
							})}
						</tbody>
					)}
				</table>

				{isFetched && items.length < 1 && <div className="text-center p-4 table__no-data">{t(emptyUiText)}</div>}
			</div>
		</>
	);
};

export default TableComponent;
