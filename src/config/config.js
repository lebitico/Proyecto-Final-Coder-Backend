import dotenv from 'dotenv'

dotenv.config()
export default {
    PERSISTENCE: process.env.PERSISTENCE,
    PORT: process.env.PORT || 8080,
    DBURL: process.env.DBURL,
    DBNAME: 'argentos',
    SECRET : process.env.SECRET, 
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID, 
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET, 
    CLIENTID: process.env.CLIENTID,
    CLIENTSECRET: process.env.CLIENTSECRET,
    CALLBACKURL: process.env.CALLBACKURL,
    TWILIO_ACCOUNT_SID : process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTHO_TOKEN : process.env.TWILIO_AUTHO_TOKEN,
    TWILIO_SMS_NUMBER : process.env.TWILIO_SMS_NUMBER,
    STRIPE_PRIVATE_KEY : process.env.STRIPE_PRIVATE_KEY,
    STRIPE_PUBLIC_KEY : process.env.STRIPE_PUBLIC_KEY,

    GOOGLE_CALLBACKURL: process.env.GOOGLE_CALLBACKURL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACKURL: process.env.GITHUB_CALLBACKURL,

}