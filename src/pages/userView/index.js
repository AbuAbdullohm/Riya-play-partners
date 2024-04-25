import React, { useEffect, useState } from "react";
import EntityContainer from "modules/entity/containers";
import { useParams } from "react-router";

import Actions from "modules/entity/actions";
import { Grid, Loader, Modal } from "components";
import { api, queryBuilder } from "services";
import { useNotification } from "hooks";
import { useDispatch } from "react-redux";
import "./style.scss";

import PhoneModal from "./components/PhoneModal";
import BanModal from "./components/BanModal";
import OTPConfirm from "./components/OTPConfirmModal";
import InfoUser from "./components/InfoUser";
import TabSideUser from "./components/TabSideUser";

export default function UserView() {
	const { id } = useParams();

	const { notification } = useNotification();
	const [button, setButton] = useState(false);
	const [balance, setBalance] = useState();
	const [updatePhoneModal, setUpdatePhoneModal] = useState(false);
	const [OTPConfirmModal, setOTPConfirmModal] = useState(false);
	const [banModal, setBanModal] = useState(false);
	const [user, setUser] = useState({});
	const dispatch = useDispatch();
	const [confirmModal, setConfirmModal] = useState({ open: false, item: null });

	function kickDevice(item) {
		api["requestv1"]
			.delete(
				queryBuilder("/user/kick-device", {
					extra: {
						token_id: item.id
					}
				})
			)
			.then(() => {
				notification("Успешно", {
					type: "success"
				});
			})
			.catch(() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			});
	}

	useEffect(() => {
		if (!id) setBalance(null);

		if (button) {
			dispatch(
				Actions.LoadDefault.request({
					url: `/user/balance/${id}`,
					cb: {
						success: data => {
							setButton(!button);
							setBalance(data);
						},
						error: error => console.log(error)
					}
				})
			);
		}
	}, [button, id]);

	return (
		<>
			<Modal.Confirm
				closable
				cancelText={"Назад"}
				title="Вы действительно хотите ?"
				okText={"Удалить"}
				onOk={() => {
					kickDevice(confirmModal.item);
					setConfirmModal({ open: false });
				}}
				setToggle={() => setConfirmModal({ open: false })}
				toggle={confirmModal.open}
				type="error"
			/>

			<Modal.Default key={"user-otp"} toggle={OTPConfirmModal} setToggle={() => setOTPConfirmModal(false)}>
				<OTPConfirm modal={OTPConfirmModal} setModal={setOTPConfirmModal} />
			</Modal.Default>

			<Modal.Default key={"user-modal"} toggle={updatePhoneModal} setToggle={() => setUpdatePhoneModal(false)}>
				<PhoneModal setOTPConfirmModal={setOTPConfirmModal} user={user} setUser={setUser} modal={updatePhoneModal} setModal={setUpdatePhoneModal} />
			</Modal.Default>

			<Modal.Default key={"ban-modal"} toggle={banModal} setToggle={() => setBanModal(false)}>
				<BanModal setModal={setBanModal} user={user} modal={banModal} />
			</Modal.Default>

			<EntityContainer.One
				key={"user"}
				entity="user"
				name="user"
				url={`/user/${id}`}
				version="v2"
				dataKey={"item"}
				params={{
					include:
						"files,userBalance,banned.reason,currentTariff.ratesPrice.rate,currentPromocode,extraTimeToSubscribes,currentPromocode.promoCode,userDevices"
				}}>
				{({ item, isFetched }) => {
					if (!isFetched) return <Loader />;

					return (
						<EntityContainer.All
							entity="/user/devices"
							name="/user/devices"
							url="/user/devices"
							version="v1"
							dataKey={"items"}
							params={{
								sort: "-id",
								extra: {
									page: 1,
									limit: 50,
									user_id: id
								}
							}}>
							{({ isFetched, items }) => {
								if (!isFetched) return <Loader />;

								return (
									<Grid.Row gutter={10} gutterX={4} className={"mt-10 user_view"}>
										<Grid.Column xl={8}>
											<InfoUser
												user={item}
												deviceList={items}
												setUpdatePhoneModal={setUpdatePhoneModal}
												setUser={setUser}
												balance={balance}
												button={button}
												setButton={setButton}
												setBanModal={setBanModal}
											/>
										</Grid.Column>

										<Grid.Column xl={4}>
											<TabSideUser user={item} id={id} deviceList={items} setConfirmModal={setConfirmModal} />
										</Grid.Column>
									</Grid.Row>
								);
							}}
						</EntityContainer.All>
					);
				}}
			</EntityContainer.One>
		</>
	);
}
