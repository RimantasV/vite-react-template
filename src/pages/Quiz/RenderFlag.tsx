import { getCountryCode } from '../../utils';

type Props = {
  tags: string | string[] | undefined;
};

export default function RenderFlag({ tags }: Props) {
  if (Array.isArray(tags)) {
    if (
      tags.some((el) =>
        ['Argentina', 'Costa-Rica', 'Mexico', 'Spain'].includes(el)
      )
    ) {
      const countryCode = getCountryCode(
        tags.filter((el) =>
          ['Argentina', 'Costa-Rica', 'Mexico', 'Spain'].includes(el)
        )
      );
      return (
        <img
          title={countryCode}
          src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`}
        />
      );
    }
  }
  return null;
}
