import { Combobox, Transition } from "@headlessui/react";
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { Fragment, useState } from "react";

type Props<T> = {
  name: string;
  items: T[];
  value: T | null;
  labelProp: keyof T;
  onChange: (value: T | null) => void;
};

function TextFilter<T>({
  name,
  items = [],
  labelProp,
  value,
  onChange,
}: Props<T>) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const filteredItems =
    query === ""
      ? items
      : items.filter((item) => {
          return `${item[labelProp]}`
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      className="relative"
      value={value}
      onChange={onChange}
      nullable
    >
      <div
        className={clsx("rounded-lg bg-stale", {
          "ring-1 ring-pop": !!value,
        })}
      >
        <Combobox.Button
          disabled={!!value}
          className="flex w-full items-center justify-between py-4 px-6 font-medium"
        >
          {name}
          <ChevronRightIcon className="h-6" />
        </Combobox.Button>

        {value && (
          <div className="flex py-4 px-4 pt-0">
            <div className="rounded-full bg-pop pl-4 text-white flex-center">
              {`${value[labelProp]}`}
              <button
                className="ml-1 h-10 w-10 rounded-full p-0 transition-all flex-center hover:backdrop-brightness-75"
                onClick={() => onChange(null)}
              >
                <XMarkIcon className="h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery("")}
      >
        <Combobox.Options className="absolute z-10 mt-2 max-h-[320px] w-full origin-top-right divide-y divide-pop divide-opacity-20 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-pop ring-opacity-50 focus:outline-none">
          <div className="sticky top-0 -left-12 divide-y border-b-[1px] border-b-pop/20 bg-white">
            <Combobox.Input
              className="z-20 h-12 w-full px-4 outline-none placeholder:italic"
              placeholder="Rechercher"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {filteredItems.length === 0 && query !== "" ? (
            <div className="relative cursor-default select-none py-3 px-4 italic text-black/50">
              {t("common.no-result", "Aucun résultat")}
            </div>
          ) : (
            filteredItems.map((item) => (
              <Combobox.Option
                className="ui-selected:text-bold block w-full px-4 py-3 text-left ui-active:bg-pop/5"
                key={`${item[labelProp]}`}
                value={item}
              >
                {`${item[labelProp]}`}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}

export default TextFilter;
