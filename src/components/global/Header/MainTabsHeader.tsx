import LoginButton from "@/components/LoginButton";
import SignupButton from "@/components/SignupButton";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAccount } from "wagmi";

const MainTabsHeader = () => {
  const { address } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="text-primary-200 text-3xl text-center flex justify-around items-center gap-2 pt-4 pb-2 h-14">
      {pathname.split("/").length > 2 && (
        <button onClick={handleBack}>
          <Image
            src="/icons/back-arrow.svg"
            alt="Groups Active"
            width={1}
            height={1}
          />
        </button>
      )}
      <div className="flex flex-1 flex-wrap justify-between items-center">
        <div className="flex gap-0.5">
          <Image
            src="/favicon.ico"
            alt="Groups Active"
            width={30}
            height={15}
          />
          <span className="font-medium text-xl text-end flex justify-end items-end ">
            VAQUITA
          </span>
        </div>
        <div className="flex-none space-x-1 flex wallets-buttons">
          <SignupButton />
          {!address && <LoginButton />}
        </div>
      </div>
    </div>
  );
};

export default MainTabsHeader;
