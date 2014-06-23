var baseURL = '/orthus/';
var openIDReturnURLFromOrthusURL;
if (process.env.orthus_url) {
	openIDReturnURLFromOrthusURL = process.env.orthus_url + baseURL + 'auth/openid/callback'
}
//TODO: clean up this code more. Maybe even use nconf
module.exports = {
    port: process.env.port || 1337,
    openIDReturnURL: openIDReturnURLFromOrthusURL || process.env.orthus_openIDURL || 'http://localhost:1337/orthus/auth/openid/callback',
    proxiedResource: process.env.orthus_proxied ||"http://localhost:8080",
    baseURL: baseURL,
    personaAudience: process.env.orthus_url || "http://localhost:1337",
    addAuthHeader: (process.env.orthus_addAuthHeader=="true") || false,
};