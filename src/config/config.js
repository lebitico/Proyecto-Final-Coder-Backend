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
    TWILIO_SMS_NUMBER : process.env.TWILIO_SMS_NUMBER
}