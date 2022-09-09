import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";

import brand from "../images/brand.svg";
import logo from "../images/logo.svg";
import Button from "./button";
// import Search from "./search";

const label = "Église Lyon Gerland";

const Header = () => {
  return (
    <header
      role="banner"
      className="flex items-center justify-between w-full h-[120px] px-6 top-0 sticky"
    >
      <div className="xl:w-1/2">
        <Link href="/">
          <a className="flex gap-4">
            <Image src={logo} alt="Logo" />
            <Image src={brand} alt="Église Lyon Gerland Réformée Évangélique" />
          </a>
        </Link>
      </div>
      <nav aria-label={label} className="mx-auto">
        <ul
          role="menubar"
          aria-label={label}
          className="flex items-center gap-10"
        >
          <li>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <span className="font-medium text-lg">L&apos;église</span>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content sideOffset={5}>
                <DropdownMenu.Item>
                  <Link href="/qui-sommes-nous">
                    <a className="font-medium text-lg">Qui sommes-nous ?</a>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Link href="/que-croyons-nous">
                    <a className="font-medium text-lg">Que croyons-nous ?</a>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Link href="/le-culte">
                    <a className="font-medium text-lg">Le culte</a>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Link href="/l-equipe">
                    <a className="font-medium text-lg">L&apos;équipe</a>
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </li>
          <li>
            <Link href="/blog">
              <a className="font-medium text-lg">Ressources</a>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <a className="font-medium text-lg">Contact</a>
            </Link>
          </li>
          <li>
            <SearchIcon height={24} />
          </li>
        </ul>
      </nav>
      <div className="xl:w-1/2 flex justify-end">
        <Link href="/don" passHref>
          <Button as="a">Faire un don</Button>
        </Link>

        {/* <Search /> */}
      </div>
    </header>
  );
};

export default Header;
