declare function customFunction(): void;
declare type NamedTestValue = {
    name: string;
    value: number;
};
interface APISecondInterface {
    fromAnother(v: NamedTestValue): void;
}
declare function exportedMain(): void;
declare class APISecond implements APISecondInterface {
    fromAnother(v: NamedTestValue): void;
}
