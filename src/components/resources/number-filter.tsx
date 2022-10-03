import { Combobox, Transition } from "@headlessui/react";
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment } from "react";

type Props = {
  name: string;
  items: number[];
  value: number | null;
  disabled: boolean;
  formatValue?: (value: number) => string;
  onChange: (value: number | null) => void;
};

function NumberFilter({
  name,
  items = [],
  value,
  disabled,
  formatValue,
  onChange,
}: Props) {
  return (
    <Combobox
      as="div"
      className={clsx("relative", { "opacity-30": disabled })}
      value={value}
      onChange={onChange}
      disabled={disabled}
      nullable
    >
      <div
        className={clsx("rounded-lg bg-stale", {
          "ring-1 ring-pop": value !== null,
        })}
      >
        <Combobox.Button
          disabled={value !== null}
          className="flex w-full items-center justify-between py-4 px-6 font-medium"
        >
          {name}
          <ChevronRightIcon className="h-6" />
        </Combobox.Button>

        {value !== null && (
          <div className="flex py-4 px-4 pt-0">
            <div className="rounded-full bg-pop pl-4 text-white flex-center">
              {formatValue ? formatValue(value) : value}
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
      >
        <Combobox.Options className="absolute z-10 mt-2 max-h-[320px] w-full origin-top-right divide-y divide-pop divide-opacity-20 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-pop ring-opacity-50 focus:outline-none">
          {items.map((item) => (
            <Combobox.Option
              className="ui-selected:text-bold block w-full px-4 py-3 text-left ui-active:bg-pop/5"
              key={item}
              value={item}
            >
              {item}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}

export default NumberFilter;
