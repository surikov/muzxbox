console.log('here sss');

console.log('vkBridge', vkBridge);
let init = vkBridge.send('VKWebAppInit')
    .then((data) => {
        console.log('then', data);
    })
    .catch((data) => {
        console.log('catch', data);
    })
    .finally((data) => {
        console.log('finally', data);
    })
    ;
console.log('init', init);
let sendpromise = vkBridge.send('VKWebAppGetEmail', 'testaaa')
    .then((data) => {
        console.log('then', data);
    })
    .catch((data) => {
        console.log('catch', data);
    })
    .finally((data) => {
        console.log('finally', data);
    })
    ;
console.log('sendpromise', sendpromise);
console.log('isStandalone', vkBridge.isStandalone());



