import React from "react";
import useStore from "../store";

function ModalLayout() {
  const currentModal = useStore((state: any) => state.currentModal);

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-[black]/[.5] z-[101] 
    justify-center items-center flex overflow-x-hidden overflow-y-auto 
    inset-0 outline-none focus:outline-none"
    >
      {currentModal}
    </div>
  );
}

export default ModalLayout;
