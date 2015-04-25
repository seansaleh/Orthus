module.exports = {
    clientID: process.env.orthus_GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID",
    clientSecret: process.env.orthus_GOOGLE_CLIENT_SECRET|| "GOOGLE_CLIENT_SECRET",
    sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',
};