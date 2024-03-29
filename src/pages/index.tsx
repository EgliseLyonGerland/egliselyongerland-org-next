import type { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/future/image";

import bibleImage from "../images/homeBible.png";

const Home: NextPage = () => {
  const { t } = useTranslation();

  return (
    <div className="-mt-[120px] mb-[100vh]">
      <div className="relative h-screen w-screen bg-sand flex-center">
        <div className="relative z-10 text-center font-suez text-7xl leading-tight">
          <p className="mb-8 whitespace-nowrap">
            {t("home.intro.a", "Une")}
            <span className="after:content-[' '] relative mx-2 inline-block after:absolute after:-left-2 after:-right-2 after:bottom-3 after:-z-10 after:h-6 after:rounded-md after:bg-pop">
              {t("home.intro.good-news", "bonne nouvelle")}
            </span>
          </p>
          <p className="mb-8 whitespace-nowrap">
            {t("home.intro.to-know", "à connaître et")}
          </p>
          <p className="whitespace-nowrap">
            {t("home.intro.to-make-know", "à faire connaître")}
          </p>
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

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || "fr")),
  },
});

export default Home;
