declare namespace APIMainSpace {
    function apiFunction(): void;
    class APITest {
        constructor();
        methodFromAPIClass(): void;
    }
}
declare function exportedMain(): void;
declare class APISecond implements APISecondInterface {
    constructor();
    fromAnother(v: NamedTestValue): void;
}
declare type NamedTestValue = {
    name: string;
    value: number;
};
interface APISecondInterface {
    fromAnother(v: NamedTestValue): void;
}
