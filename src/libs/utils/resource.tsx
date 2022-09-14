import { kebabCase } from "lodash";
import { ReactNode } from "react";

export function addAnchors(
  text: string
): [text: string, anchors: { key: string; title: string }[]] {
  const anchors: { key: string; title: string }[] = [];

  const textWithAnchors = text.replace(/<h2>(.+?)<\/h2>/g, (match, capture) => {
    const result = /(\d+)[^\w]*(.*)/.exec(capture.trim());
    const label = result?.[2] || capture;

    const anchor = kebabCase(label);
    anchors.push({ key: anchor, title: label });
    return `<a name="${anchor}"></a>${match}`;
  });

  return [textWithAnchors, anchors];
}

export function formatTitle(title: string): ReactNode {
  return title
    .trim()
    .split(/ +/)
    .reduce<ReactNode[]>((acc, curr, index) => {
      if (index === 0) {
        return [curr];
      }
      if (curr.length > 1) {
        return [...acc, " ", curr];
      }

      const last = acc.pop();

      return [
        ...acc,
        <span key={index} className="whitespace-nowrap">
          {`${last} ${curr}`}
        </span>,
      ];
    }, []);
}
