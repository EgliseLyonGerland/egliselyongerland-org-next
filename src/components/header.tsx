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
    <header role="banner" className="absolute top-0 w-full">
      <div className="fixed top-0 z-20 w-screen bg-sand px-6 flex-center">
        <div className="h-[120px] w-full max-w-screen-2xl justify-between flex-center ">
          <div className="xl:w-1/2">
            <Link href="/">
              <a className="flex gap-4">
                <Image src={logo} alt="Logo" />
                <Image
                  src={brand}
                  alt="Église Lyon Gerland Réformée Évangélique"
                />
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
                    <span className="text-lg font-medium">L&apos;église</span>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content sideOffset={5}>
                    <DropdownMenu.Item>
                      <Link href="/qui-sommes-nous">
                        <a className="text-lg font-medium">Qui sommes-nous ?</a>
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                      <Link href="/que-croyons-nous">
                        <a className="text-lg font-medium">
                          Que croyons-nous ?
                        </a>
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                      <Link href="/le-culte">
                        <a className="text-lg font-medium">Le culte</a>
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                      <Link href="/l-equipe">
                        <a className="text-lg font-medium">L&apos;équipe</a>
                      </Link>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </li>
              <li>
                <Link href="/resources">
                  <a className="text-lg font-medium">Ressources</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-lg font-medium">Contact</a>
                </Link>
              </li>
              <li>
                <SearchIcon height={24} />
              </li>
            </ul>
          </nav>
          <div className="flex justify-end xl:w-1/2">
            <Link href="/don" passHref>
              <Button as="a">Faire un don</Button>
            </Link>

            {/* <Search /> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
