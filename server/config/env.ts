import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://petconnect_db_user:gOee3vDu9JgpHWJv@petconnect.dbbyvs2.mongodb.net/PetConnect_DB?appName=PetConnect',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  PORT: parseInt(process.env.PORT || '4000'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  STRIPE_SECRET: process.env.STRIPE_SECRET || 'sk_test_xxx',
  STRIPE_PUBLIC: process.env.STRIPE_PUBLIC || 'pk_test_xxx',
  STRIPE_SUCCESS_URL: process.env.STRIPE_SUCCESS_URL || 'http://localhost:5173/#/donaciones?status=success',
  STRIPE_CANCEL_URL: process.env.STRIPE_CANCEL_URL || 'http://localhost:5173/#/donaciones?status=cancel'
}