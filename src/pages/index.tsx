import type { NextPage } from "next";
import Image from "next/image";

import bibleImage from "../images/homeBible.png";

const Home: NextPage = () => {
  return (
    <div className="-mt-[120px] mb-[100vh]">
      <div className="w-screen h-screen flex-center bg-sand relative">
        <div className="font-suez text-7xl leading-tight text-center relative z-10">
          <p className="whitespace-nowrap mb-8">
            Une{" "}
            <span className="inline-block relative mx-2 after:absolute after:-left-2 after:-right-2 after:bottom-3 after:-z-10 after:bg-pop after:h-6 after:rounded-md after:content-[' ']">
              bonne nouvelle
            </span>
          </p>
          <p className="whitespace-nowrap mb-8">à connaître et</p>
          <p className="whitespace-nowrap">à faire connaître</p>
        </div>
        <div className="absolute bottom-0 max-h-fit">
          <Image
            src={bibleImage}
            className="mix-blend-color-burn shadow-xl "
            alt="Une bible ouverte tenue dans les mains"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
