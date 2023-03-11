import React from "react";
import { CloseIcon } from "../icons.component";
import useStore from "../../store";
import { ITransaction } from "../../types";

function ReceiveModal({ transactions }: { transactions: ITransaction[] }) {
  const setModal = useStore((state: any) => state.setModal);

  return (
    <>
      <div className="w-96 text-[#324063] bg-[#FFFFFF] rounded p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-[#324063] text-sm leading-8 font-semibold my-1">
            All Inflow Transactions
          </h3>
          <span className="cursor-pointer" onClick={() => setModal(null)}>
            <CloseIcon />
          </span>
        </div>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction._id}>{transaction.receiver}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default ReceiveModal;
