const nrf24 : nRF24Lib = require("nrf24"); // Load de module

const configurations: nRF24ConfigurationOptions = {
    PALevel: nrf24.RF24_PA_MIN,
    DataRate: nrf24.RF24_1MBPS,
    CRCLength: nrf24.RF24_CRC_16,
    EnableLna: true,
    Channel: 85
}
console.log(configurations);
var rf24 = <nRF24>new nrf24.nRF24(22, 0);
rf24.begin();
rf24.restart();
rf24.config(configurations, true);

// Register Reading pipes
var pipe = rf24.addReadPipe("0xe1e1e1e1e1", true) // listen in pipe "0xbad0face00" with AutoACK enabled.
rf24.useWritePipe("0xe1e1e1e1e1", true); // Select the pipe address to write with Autock

//up to 5 pipes can be configured

console.log("Radio connected:" + rf24.present()); // Prints true/false if radio is connected.
console.log("Is + Variant:" + rf24.isP()); // Prints true/false if radio is + Variant
const d = Buffer.from("datadata"); // Create a node buffer for sending data
// Register callback for reading
rf24.read(function (data: any, n: number) {
    // when data arrive on any registered pipe this function is called
    // data -> JS array of objects with the follwing props:
    //     [{pipe: pipe id, data: nodejs with the data },{ ... }, ...]
    // n -> number elements of data array    
    console.log('received:', data, n);
    rf24.write(d); // send the data in sync mode

}, function (isStopped: boolean, by_user: boolean, error_count: number) {
    // This will be if the listening process is stopped.
    console.log(arguments); // Prints true/false if radio is + Variant

});
setInterval(() => {
    console.log('sending:', d, "success =", rf24.write(d));
}, 1000);
// Finally to assure that object is destroyed
// and memory freed destroy must be called.
// rf24.destroy();
setTimeout(() => rf24.destroy(), 1000);


export default {};