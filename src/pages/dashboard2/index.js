import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { get } from "lodash";
import moment from "moment";
import qs from "qs";

import Actions from "modules/entity/actions";
import { Fields, Button, Panel, Loader } from "components";
import { helpers } from "services";
import CardBox from "./components/CardBox";
import Table from "./components/Table";
import Chart from "./components/Chart";

import "./style.scss";

import { ReactComponent as ContactIcon } from "assets/images/icons/icons-dashboard/Group 1.svg";
import { ReactComponent as MoneyTransaction } from "assets/images/icons/icons-dashboard/moneyTranzaksion.svg";
import { ReactComponent as Karmang } from "assets/images/icons/icons-dashboard/karman.svg";
import { ReactComponent as Shop } from "assets/images/icons/icons-dashboard/shop.svg";
import { ReactComponent as SMS } from "assets/images/icons/icons-dashboard/sms.svg";

const List = ({ history, location }) => {
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const ratesData = useSelector(state => state.system.rates);
	const [filterValue, setFilterValue] = useState(false);
	const [items, setItems] = useState([]);

	const [allSumm, setAllSumm] = useState(0);
	const [ratesSum, setRatesSum] = useState();
	const [transaction, setTransaction] = useState();
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	// const sumFunc = data => {
	// 	delete data.trnCount;
	// 	delete data.comming;
	// 	delete data.expanse;

	// 	const newData = Object.keys(data).map((item, idx) => ({
	// 		amount: get(data, item),
	// 		payment_method: item
	// 	}));

	// 	const qiy = newData.reduce((total, count) => (total += Number(count.amount)), 0);

	// 	const procentSum = newData.map(item => round((Number(item.amount) / qiy) * 100, 1) + "%");
	// 	const colorIncomes = {
	// 		apelsin: "#F25F2E",
	// 		payme: "#33CCCC",
	// 		paynet: "#00B427",
	// 		click: "#3F8CFF",
	// 		cash: "#333",
	// 		apelsin_frame: "#83190b"
	// 	};

	// 	const newExpenses = newData.map((item, idx) => {
	// 		return {
	// 			...item,
	// 			procent: procentSum[idx],
	// 			colorIncomes: colorIncomes[item.payment_method]
	// 		};
	// 	});

	// 	get(items, "incomes").forEach(item => {
	// 		newExpenses.forEach(expenses => {
	// 			if ((item.payment_method = expenses.payment_method)) {
	// 				arr.push([{ ...expenses, id: 1 }]);
	// 			}
	// 		});
	// 	});
	// 	return arr;
	// };

	useEffect(() => {
		dispatch(
			Actions.LoadDefault.request({
				url: "/statistics",
				version: "v2",
				cb: {
					success: data => {
						setLoading(true);
						const { newExpenses, newIncomes } = helpers.dashboardCostumizeData(data, setAllSumm, setRatesSum);
						const newData = {
							...data,
							expenses: newExpenses,
							incomes: newIncomes
						};

						setItems(newData);
					},
					error: error => {
						console.log("error", error);
					}
				},
				params: {
					extra: {
						start: get(params, "start[0]") ? params.start[0] : null,
						end: get(params, "start[1]") ? params.start[1] : null
					}
				}
			})
		);
		dispatch(
			Actions.LoadDefault.request({
				url: "/transactions/statistics",
				cb: {
					success: data => {
						// sumFunc(data);
						setTransaction(data);
					},
					error: error => {
						console.log(error);
					}
				}
			})
		);
	}, [filterValue, location.search]);

	const soledSubscriptions = get(items, "expenses", []).reduce((total, count) => (total += count.id), 0);
	const discountTransactions = helpers.formatCurrency(transaction && Number(transaction.comming) - Number(transaction.expanse));

	const transactionsCount = get(items, "incomes", []).reduce((total, count) => (total += count.id), 0);
	const usersCount = String(get(items, "usersCount", 0));
	const sms = get(items, "sms");

	if (!loading) return <Loader />;

	return (
		<div className="dashboard">
			<div className="dashboard_header">
				<div className="title_header">Dashboard</div>
				<div style={{ zIndex: "100" }} className="dashboard_header_right">
					<Formik
						initialValues={{
							start: []
						}}
						onSubmit={value => value}
						render={({ values, setFieldValue, handleSubmit }) => {
							return (
								<Form className="mr-5">
									<div className="d-flex justify-between align-center">
										<Field
											component={Fields.NewDatePicker}
											name="start"
											type="range"
											data={items}
											maxDate={new Date()}
											label="Дата"
											clearButton={true}
											onChange={value => {
												if (value[0] || value[1]) {
													setFieldValue("start", value);
												} else {
													setFieldValue("start", []);
													history.push({
														search: qs.stringify({ start: [] }, { encode: false })
													});
													handleSubmit();
												}
											}}
										/>
										{values.start.length > 0 && values.start[0] !== null && (
											<div className="ml-3">
												<Button.Default
													className="mr-0"
													onClick={() => {
														setFilterValue(!filterValue);
														history.push({
															search: qs.stringify({ start: [values.start[0], values.start[1] + 86399] }, { encode: false })
														});
														handleSubmit();
													}}>
													Смотреть
												</Button.Default>
											</div>
										)}
									</div>
								</Form>
							);
						}}
					/>
				</div>
			</div>

			<div className="dashboard_main">
				<Panel className="dashboard_main_left">
					<CardBox Icon={Karmang} total={discountTransactions} title="В кошельке" />
					<CardBox Icon={ContactIcon} total={usersCount} title="Пользователи" />
					<CardBox Icon={MoneyTransaction} total={transactionsCount} title="Количество транзакций" />
					<CardBox Icon={Shop} total={soledSubscriptions} title="Купленные тарифы" />
					<CardBox Icon={SMS} total={sms || 1} title="Использованные SMS-сообщения" />
				</Panel>

				<div style={{ zIndex: "1" }}>
					<Panel className="dashboard_main_right payment_info">
						<div className="d-flex justify-between">
							<div>
								<Chart keyword="chart2" items={items} />
							</div>
							<div className="payment_info_inner">
								<div className="payment_info_inner_header">
									<div>
										<div className="payment_info_inner_header_title dashboard_title">Пополнение счета</div>
										<p className="payment_info_inner_header_summ first">
											{items && get(items, "incomes", []).reduce((pv, cv) => (pv += parseInt(cv.id)), 0)}
										</p>
									</div>
									<div>
										<h1 className="payment_info_inner_header_title dashboard_title">Общая сумма</h1>
										<p className="payment_info_inner_header_summ">
											{Number(allSumm).toLocaleString("en-US", {
												style: "currency",
												currency: "UZS",
												minimumFractionDigits: 0
											})}
										</p>
									</div>
								</div>
								<div className="dashboard_table" id="dashboard_table">
									<table className="table">
										<tbody>
											{items &&
												get(items, "incomes", [])
													.sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
													.map((item, idx) => (
														<Table
															key={idx}
															index={idx}
															transactionDownIcon
															spanColor={item.payment_method}
															paymentProcent={item.procent}
															paymentLogo={item.payment_method}
															transaction={item.id}
															summ={item.amount}
														/>
													))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</Panel>

					<Panel className="dashboard_main_right rates_payment_info mt-5">
						<div className="d-flex justify-between">
							<div>
								<Chart keyword="chart1" items={items} ratesData={ratesData} />
							</div>
							<div className="rates_payment_info_inner">
								<div className="rates_payment_info_inner_header">
									<div>
										<h1 className="rates_payment_info_inner_header_title dashboard_title mt-0">Купленные тарифы:</h1>
										<p className="rates_payment_info_inner_header_summ first">{soledSubscriptions}</p>
									</div>
									<div>
										<h1 className="rates_payment_info_inner_header_title dashboard_title mt-0">Общая сумма</h1>
										<p className="rates_payment_info_inner_header_summ">
											{Number(ratesSum).toLocaleString("en-US", {
												style: "currency",
												currency: "UZS",
												minimumFractionDigits: 0
											})}
										</p>
									</div>
								</div>

								<div className="dashboard_table" id="dashboard_table">
									<table className="table">
										<tbody>
											{items &&
												get(items, "expenses", [])
													.sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
													.map((item, idx) => {
														const invoice_rates = ratesData ? ratesData.find(rates => rates.id === item.invoice_id) : [];
														return (
															<Table
																key={idx}
																index={idx}
																rates={invoice_rates ? invoice_rates.name_ru : "-"}
																procent={item.procent}
																span
																spanColor={item.color}
																transaction={item.id}
																summ={item.amount}
															/>
														);
													})}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</Panel>

					<Panel className="dashboard_main_right top_table mt-5">
						<div className="title_header d-flex align-items-center mr-2">Топ оплаты</div>

						<div className="dashboard_table" id="dashboard_table">
							<table className="table">
								<tbody>
									{items &&
										get(items, "topTransactions", []).map((item, idx) => (
											<Table
												key={idx}
												contact
												contactId={item.transaction_id}
												contactPhone={item.user}
												summ={item.amount}
												time={moment.unix(item.created_at).format("DD.MM.YYYY / HH:mm:ss")}
											/>
										))}
								</tbody>
							</table>
						</div>
					</Panel>
				</div>
			</div>
		</div>
	);
};

export default List;
