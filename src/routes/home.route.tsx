import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  deleteAccount,
  generatePaymentId,
  getAccount,
  getAllAccounts,
  userAccounts,
} from "../api/account";
import { getReceivedTransaction, getSentTransaction } from "../api/transaction";
import ReceiveModal from "../components/modal/receive.modal";
import SendModal from "../components/modal/send.modal";
import SentModal from "../components/modal/sent.modal";
import ModalLayout from "../layout/modal.layout";
import useStore from "../store";
import { IAccount } from "../types";

export function Home() {
  const [paymentId, setPaymentId] = useState("");
  const [id, setId] = useState("");
  const [account, setAccount] = useState("");
  const [allAccounts, setAllAccounts] = useState<IAccount[]>([]);
  const [accountProfile, setAccountProfile] = useState<IAccount | any>({});
  const [userAccount, setUserAccount] = useState<IAccount[]>([]);
  const { setModal, currentModal } = useStore((state: any) => state);
  const navigate = useNavigate();

  const user = JSON.parse(window.localStorage.getItem("user") as string);

  const getAccounts = async () => {
    const res = await getAllAccounts();
    const filteredAccounts = res.filter((r) => r.profile._id !== user?._id);

    setAllAccounts(filteredAccounts);
  };

  const getUserAccount = async () => {
    const res = await userAccounts();
    setUserAccount(res);
  };

  useEffect(() => {
    if (!user?._id) navigate("/login");
    getUserAccount();
    getAccounts();
  }, []);

  const generate = async () => {
    try {
      const res = await generatePaymentId();
      navigate(0);
      return res;
    } catch (error: any) {
      alert(error?.response?.data.message);
    }
  };

  const myAccount = async () => {
    try {
      const res = await getAccount(paymentId);
      alert("User found");
      setAccountProfile(res[0]);
    } catch (error: any) {
      alert(error?.response?.data.message);
    }
  };

  const signOut = () => {
    window.localStorage.clear();
    navigate("/login");
  };

  const options = allAccounts.map((account) => {
    return {
      value: account.paymentID,
      label: `${account.profile?.name} ${account.paymentID}`,
    };
  });

  const received = async () => {
    try {
      const res = await getReceivedTransaction(account);
      console.log("send", res);

      if (res) {
        setModal(<ReceiveModal transactions={res} />);
      }
    } catch (error: any) {
      alert(error?.response?.data.message);
    }
  };

  const sent = async () => {
    try {
      const res = await getSentTransaction(account);

      if (res) {
        setModal(<SentModal transactions={res} />);
      }
    } catch (error: any) {
      alert(error?.response?.data.message);
    }
  };

  const removeAccount = async () => {
    try {
      await deleteAccount(id);
      alert("Account Deleted");
      navigate(0);
    } catch (error: any) {
      alert(error?.response?.data.message);
    }
  };

  return (
    <>
      {currentModal && <ModalLayout />}
      <div className="flex flex-col px-5">
        <div className="flex justify-between items-center">
          <div>
            <button
              type="button"
              className="border-none outline-none py-3 px-2 rounded text-[blue] bg-[transparent]"
              disabled={!account}
              onClick={() =>
                setModal(
                  <SendModal myAccount={account} accounts={allAccounts} />
                )
              }
            >
              Send Fund
            </button>
            <button
              type="button"
              className="border-none outline-none py-3 px-2 rounded text-[blue] bg-[transparent]"
              disabled={!account}
              onClick={received}
            >
              Inflow Transactions
            </button>
            <button
              type="button"
              className="border-none outline-none py-3 px-2 rounded text-[blue] bg-[transparent]"
              disabled={!account}
              onClick={sent}
            >
              Outflow Transactions
            </button>
            <button
              type="button"
              className="border-none outline-none py-3 px-2 rounded text-[red] bg-[transparent]"
              disabled={!account}
              onClick={removeAccount}
            >
              Delete Account
            </button>
          </div>
          <button
            type="button"
            className="border-none outline-none py-1 px-2 rounded text-white bg-[blue]"
            onClick={signOut}
          >
            Logout
          </button>
        </div>

        <div>
          <div className="flex items-center">
            <h3 className="text-[3xl] font-semibold mr-3">
              Search for Other User with their paymentID
            </h3>
            <label className="font-light text-ash text-sm my-4">
              <Select
                className="text font-semibold mr-2"
                placeholder="Select PaymentID"
                options={options}
                value={options.find((obj) => obj.value === paymentId)}
                onChange={(e: any) => {
                  setPaymentId(e.value);
                }}
              />
            </label>
            <button
              type="button"
              className="inline-block py-2 px-2 rounded text-white bg-[blue]"
              onClick={myAccount}
            >
              Get Account
            </button>
          </div>
          {accountProfile?.profile && (
            <div className="mb-5">
              <h3 className="text-[20px] font-semibold mr-3 leading-8">
                Searched User Info:
              </h3>
              <div className="border p-5">
                <h4>Profile Name: {accountProfile?.profile?.name}</h4>
                <h4>Profile Email: {accountProfile?.profile?.email}</h4>
                <h4>
                  Profile Phone Number: {accountProfile?.profile?.phoneNumber}
                </h4>
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          className="inline-block py-3 px-2 rounded text-white bg-[blue]"
          onClick={generate}
        >
          Generate PaymentID
        </button>

        <table className="table-fixed min-w-[800px] w-full">
          <thead className="text-[14px] text-ash rounded-lg bg-ash1 border-b border-b-ash2">
            <tr className="text-left">
              <th className="pl-2 lg:pl-10 p-3 font-light w-full lg:w-auto">
                Payment ID
              </th>
              <th className="font-light p-3 lg:w-auto w-full">Profile Name</th>
              <th className="font-light p-3 lg:w-auto w-full">Profile Email</th>
              <th className="font-light p-3 lg:w-auto w-full">
                Profile Phone Number
              </th>
              <th className="font-light p-3 lg:w-auto w-full">
                Account Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {userAccount.map((user) => (
              <tr
                className={`${
                  account === user.paymentID ? "bg-gray-200" : ""
                } cursor-pointer`}
                key={user._id}
                onClick={() => {
                  setAccount(user.paymentID);
                  setId(user._id);
                }}
              >
                <td className="p-3 lg:w-auto w-full text-center lg:text-left">
                  {user.paymentID}
                </td>
                <td className="p-3 lg:w-auto w-full text-center lg:text-left">
                  {user?.profile?.name}
                </td>
                <td className="p-3 lg:w-auto w-full text-center lg:text-left">
                  {user?.profile?.email}
                </td>
                <td className="p-3 lg:w-auto w-full text-center lg:text-left">
                  {user?.profile?.phoneNumber}
                </td>
                <td className="p-3 lg:w-auto w-full text-center lg:text-left">
                  {user.balance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
