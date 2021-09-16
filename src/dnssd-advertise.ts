const dnssd = require('dnssd');

const ad = new dnssd.Advertisement(dnssd.tcp('shs'), parseInt(<string> process.env.PORT));
ad.start();