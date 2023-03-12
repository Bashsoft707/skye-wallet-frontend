import React, { useState } from "react";
import { CloseIcon } from "../icons.component";
import Select from "react-select";
import useStore from "../../store";
import { sendFunds } from "../../api/transaction";
import { IAccount } from "../../types";
import { useNavigate } from "react-router-dom";

function SendModal({
  accounts,
  myAccount,
}: {
  accounts: IAccount[];
  myAccount: string;
}) {
  const [paymentId, setPaymentId] = useState("");
  const [amount, setAmount] = useState(0);
  const setModal = useStore((state: any) => state.setModal);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await sendFunds({
        amount,
        receiver: paymentId,
        sender: myAccount,
      });

      setModal(null);
      navigate(0);
    } catch (error: any) {
      alert(error?.response?.data.message);
    }
  };

  // dropdown select options
  const options = accounts.map((account) => {
    return {
      value: account.paymentID,
      label: `${account.profile?.name} ${account.paymentID}`,
    };
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="w-96 text-[#324063] bg-[#FFFFFF] rounded p-5">
          <div className="flex justify-between items-center">
            <h3 className="text-[#324063] text-sm leading-8 font-semibold my-1">
              Send Fund
            </h3>
            <span className="cursor-pointer" onClick={() => setModal(null)}>
              <CloseIcon />
            </span>
          </div>
          <div>
            <label className="font-light text-ash text-sm my-4">
              <Select
                className="my-2 text font-semibold"
                placeholder="Select PaymentID"
                options={options}
                value={options.find((obj) => obj.value === paymentId)}
                onChange={(e: any) => {
                  setPaymentId(e.value);
                }}
              />
            </label>

            <label className="font-light text-ash text-sm my-4 flex flex-col">
              <input
                className="border border-ash2 outline-none font-semibold p-2 my-2 shadow"
                type="text"
                name="amount"
                placeholder="Amount"
                onChange={(e: any) => setAmount(e.target.value)}
              />
            </label>
          </div>
          <button
            className="block w-full p-2 my-2 rounded bg-[blue] text-white text-sm text-center"
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </>
  );
}

export default SendModal;
