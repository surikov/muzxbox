type NamedTestValue = {
  name: string;
  value: number;
};
interface APISecondInterface {
  fromAnother(v: NamedTestValue): void;
}
