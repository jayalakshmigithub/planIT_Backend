import dotenv from 'dotenv'
dotenv.config()

export default {
    PORT:process.env.PORT,
    MONGODB_URI:process.env.MONGODB_URI,
    EMAIL:process.env.EMAIL,
    APP_PASSWORD:process.env.APP_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY:process.env.ENCRYPTION_KEY,
    API_URL : process.env.API_URL ,

    BUCKET_NAME : process.env.BUCKET_NAME,
    BUCKET_REGION : process.env.BUCKET_REGION ||"ap-south-1",
    ACCESS_KEY: process.env.ACCESS_KEY,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY
}
