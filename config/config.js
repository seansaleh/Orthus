var baseURL = '/orthus/';
var googleReturnURLFromOrthusURL;
if (process.env.orthus_url) {
    googleReturnURLFromOrthusURL = process.env.orthus_url + baseURL + 'auth/google/callback'
}
//TODO: clean up this code more. Maybe even use nconf
module.exports = {
    port: process.env.port || 1337,
    googleCallbackUrl: googleReturnURLFromOrthusURL || process.env.orthus_googleCallback || 'http://localhost:1337/orthus/auth/google/callback',
    proxiedResource: process.env.orthus_proxied ||"http://localhost:8080",
    baseURL: baseURL,
    personaAudience: process.env.orthus_url || "http://localhost:1337",
    addAuthHeader: (process.env.orthus_addAuthHeader=="true") || false,
};