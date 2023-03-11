import { Key, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  generatePaymentId,
  getAccount,
  getAllAccounts,
  userAccounts,
} from "../api/account";
import { getReceivedTransaction, getSentTransaction } from "../api/transaction";
import { getMe } from "../api/user";
import ReceiveModal from "../components/modal/receive.modal";
import SendModal from "../components/modal/send.modal";
import SentModal from "../components/modal/sent.modal";
import ModalLayout from "../layout/modal.layout";
import useStore from "../store";

export function Home() {
  const [paymentId, setPaymentId] = useState("");
  const [account, setAccount] = useState("");
  const [allAccounts, setAllAccounts] = useState([]);
  const [inflow, setInflow] = useState([]);
  const [outflow, setOutflow] = useState([]);
  const [accountProfile, setAccountProfile] = useState<any>({});
  const [userAccount, setUserAccount] = useState<any>([]);
  const { user, setModal, setUser } = useStore((state: any) => state);
  const currentModal = useStore((state: any) => state.currentModal);
  const navigate = useNavigate();

  const getUser = async () => {
    const res = await getMe();
    setUser(res);
  };

  const getAccounts = async () => {
    const res = await getAllAccounts();
    const filteredAccounts = res.filter((r: any) => r.profile._id != user?._id);

    setAllAccounts(filteredAccounts);
  };

  const getUserAccount = async () => {
    const res = await userAccounts();
    setUserAccount(res);
  };

  useEffect(() => {
    getUser();
    getUserAccount();
  }, []);

  useEffect(() => {
    getAccounts();
  }, [account]);

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

  const options = allAccounts.map((account: any) => {
    return {
      value: account.paymentID,
      label: `${account.profile?.name} ${account.paymentID}`,
    };
  });

  const received = async () => {
    try {
      const res = await getReceivedTransaction(paymentId);

      if (res) {
        setInflow(res);

        setModal(<ReceiveModal myAccount={account} transactions={inflow} />);
      }
    } catch (error: any) {
      alert(error?.response?.data.message);
    }
  };

  const sent = async () => {
    try {
      const res = await getSentTransaction(paymentId);

      if (res) {
        setOutflow(res);

        setModal(<SentModal myAccount={account} transactions={outflow} />);
      }
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
              className="border-none outline-none py-3 px-2 rounded text-blue bg-[transparent]"
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
              className="border-none outline-none py-3 px-2 rounded text-blue bg-[transparent]"
              disabled={!account}
              onClick={received}
            >
              Inflow Transactions
            </button>
            <button
              type="button"
              className="border-none outline-none py-3 px-2 rounded text-blue bg-[transparent]"
              disabled={!account}
              onClick={sent}
            >
              Outflow Transactions
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
                value={options.find((obj: any) => obj.value === paymentId)}
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
                <h4>Profile Balance: {accountProfile?.balance}</h4>
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
            {userAccount.map((user: any) => (
              <tr
                className={`${
                  account === user.paymentID ? "bg-gray-200" : ""
                } cursor-pointer`}
                key={user._id}
                onClick={() => setAccount(user.paymentID)}
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
