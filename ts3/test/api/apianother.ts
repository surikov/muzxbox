
function exportedMain() {
    console.log("run exportedMain");
  }
class APISecond implements APISecondInterface{
    constructor(){
        console.log('create APISecond');
    }
    fromAnother(v: NamedTestValue){
        console.log('run fromAnother',v);
    }
}
