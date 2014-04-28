module.exports = {
    port: process.env.port || 1337,
    openIDReturnURL: process.env.orthus_openIDURL || 'http://localhost:1337/orthus/auth/openid/callback',
    proxiedResource: process.env.orthus_proxied ||"http://localhost:8080",
    baseURL: '/orthus/',
    addAuthHeader: (process.env.orthus_addAuthHeader=="true") || false,
};