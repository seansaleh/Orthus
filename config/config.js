module.exports = {
    port: process.env.port || 1337,
    serverAddress: 'http://localhost:1337',
    proxiedResource: "http://localhost:8080",
    //These are temporariry conveiences for fast development. AKA am too lazy to put it elsewhere :)
    //serverAddress: 'http://www.seansaleh.com:1337',
    //proxiedResource: "http://ghs.l.google.com:80",
    loginURL: '/login',
    logoutURL: '/logout',
    signupURL: '/signup'
};