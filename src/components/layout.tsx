import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div>
      <h1>
        <Link href="/">Église Lyon Gerland</Link>
      </h1>

      <ul>
        <li>
          L&apos;église
          <ul>
            <li>
              <Link href="/qui-sommes-nous">Qui sommes-nous ?</Link>
            </li>
            <li>
              <Link href="/que-croyons-nous">Que croyons-nous ?</Link>
            </li>
            <li>
              <Link href="/le-culte">Le culte</Link>
            </li>
            <li>
              <Link href="/l-equipe">L&apos;équipe</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link href="/blog">Blog</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          <Link href="/don">Faire un don</Link>
        </li>
      </ul>

      {children}
    </div>
  );
};

export default Layout;
