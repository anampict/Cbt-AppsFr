import { cloneElement } from "react";
import type { CommonProps } from "@/@types/common";

type SideProps = CommonProps;

const Side = ({ children, ...rest }: SideProps) => {
  return (
    <div
      className="flex h-full bg-cover bg-center bg-no-repeat justify-center items-center"
      style={{
        backgroundImage: "url(/img/others/backgoundlogin.png)",
        backgroundColor: "#56ab91",
      }}
    >
      <div className="w-full xl:max-w-[450px] px-8 max-w-[380px]">
        {children
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cloneElement(children as React.ReactElement<any>, {
              ...rest,
            })
          : null}
      </div>
    </div>
  );
};

export default Side;
