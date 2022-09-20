import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="gap-4 bg-sand py-10 flex-center">
      <Link href={router.asPath} locale={router.locale === "fr" ? "en" : "fr"}>
        <a>{t("footer.version", "English version")}</a>
      </Link>
    </div>
  );
};

export default Footer;
