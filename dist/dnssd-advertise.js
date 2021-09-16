"use strict";
const dnssd = require('dnssd');
const ad = new dnssd.Advertisement(dnssd.tcp('shs'), parseInt(process.env.PORT));
ad.start();
//# sourceMappingURL=dnssd-advertise.js.map