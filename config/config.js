module.exports = {
    port: process.env.port || 1337,
    openIDReturnURL: 'http://localhost:1337/orthus/auth/openid/callback',
    //proxiedResource: "http://localhost:8080",
    //These are temporariry conveiences for fast development. AKA am too lazy to put it elsewhere :)
    proxiedResource: "http://ghs.l.google.com:80",
    baseURL: '/orthus/',
};