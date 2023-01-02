console.log("Surikov's API for Regular Music");
namespace Surikov {
  export class SurikovEngine {
    //tester:LibTester=new LibTester();
    constructor() {}
    version(): string {
      return "Surikov's API for Regular Music v1.0.01";
    }
    createTester(): LibTester {
      return new LibTester();
    }
    createContext(): void {}
  }
}
window["SurikovEngine"] = new Surikov.SurikovEngine();
