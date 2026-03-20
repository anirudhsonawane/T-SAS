# Signup & Email Testing Guide

This guide helps verify that user signup and email functionality are working correctly in production.

## Recent Changes

### 1. **Added Name Field to Signup Form**
- The signup form now requires a full name (previously missing)
- Updated `app/components/auth/AuthForm.tsx` to include name input field with validation
- Form now sends: email, name, mobile, password to the signup API

### 2. **Enhanced Error Logging**
- Added comprehensive console logging to trace issues in production
- Logs include:
  - MongoDB connection status
  - User creation success/failure
  - OAuth user sync status
  - Authentication attempts
  - Email sending status

### 3. **Improved Validation**
- Signup now validates that name field is not empty
- Password hashing uses proper salt rounds (configurable via `PASSWORD_HASH_SALT_ROUNDS`)
- Mobile number validation enforces 8-15 digits

## Test Endpoints

### Test Database Connection
```bash
# Check if MongoDB is connected and accessible
curl https://innovationsas.vercel.app/api/test-signup
```

Expected response:
```json
{
  "success": true,
  "message": "MongoDB connection successful",
  "databaseName": "ticket-r",
  "totalUsers": 45,
  "timestamp": "2026-03-20T10:30:00.000Z"
}
```

### Create Test User in Production
```bash
# Creates a test user with unique email (timestamp-based)
# Returns credentials for testing login
curl -X POST https://innovationsas.vercel.app/api/test-signup
```

Expected response:
```json
{
  "success": true,
  "message": "Test user created successfully",
  "testUser": {
    "email": "test-1710918600000@example.com",
    "password": "TestPassword123",
    "name": "Test User",
    "mobile": "+919876543210",
    "userId": "507f1f77bcf86cd799439011"
  },
  "timestamp": "2026-03-20T10:30:00.000Z"
}
```

### Test Email Functionality
```bash
# Sends a test email to your configured SMTP_FROM_EMAIL
curl -X POST https://innovationsas.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{}'

# Or send to a specific email
curl -X POST https://innovationsas.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"recipientEmail": "test@example.com"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Test email sent successfully",
  "emailInfo": {
    "messageId": "<abc123@smtp.example.com>",
    "response": "250 Message accepted",
    "recipientEmail": "test@example.com",
    "timestamp": "2026-03-20T10:30:00.000Z"
  }
}
```

## Debugging Production Issues

### 1. Check Vercel Logs
Go to your Vercel project dashboard → Logs to see console output:
```
[MongoDB] Connecting to MongoDB...
[MongoDB] Connected to database: ticket-r
[Signup] User created successfully
[Auth] User authenticated successfully
[Email Test] Email sent successfully
```

### 2. Look for Error Messages
If signup fails, check for logs like:
```
[Signup] Error during user registration: message, errorStack
[MongoDB] Connection failed: [error details]
[Email Test] Error sending test email: [error details]
```

### 3. Verify Environment Variables in Vercel
Ensure these are set in Vercel project settings:
- `MONGODB_URI` - Your MongoDB connection string
- `MONGODB_DB` - Database name (should be "ticket-r")
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - NextAuth secret key
- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP port (usually 587 or 465)
- `SMTP_USER` - SMTP username
- `SMTP_PASSWORD` - SMTP password
- `SMTP_FROM_EMAIL` - Sender email address

## Manual Testing Flow

### Step 1: Test Database Connection
```bash
curl https://innovationsas.vercel.app/api/test-signup
```
If this fails, check MongoDB connection string and Vercel logs.

### Step 2: Create Test User
```bash
curl -X POST https://innovationsas.vercel.app/api/test-signup
```
If this fails, check MongoDB permissions and data insertion errors in logs.

### Step 3: Login with Test User
1. Go to https://innovationsas.vercel.app/login
2. Enter the test user email and password
3. Check Vercel logs for authentication messages

### Step 4: Test Email
```bash
curl -X POST https://innovationsas.vercel.app/api/test-email
```
If this fails, check SMTP configuration and email logs.

### Step 5: Test Signup Form
1. Go to https://innovationsas.vercel.app/signup
2. Fill in: Email, Full Name, Mobile, Password, Confirm Password
3. Click Sign Up
4. Check Vercel logs for creation and authentication messages
5. Verify user appears in MongoDB

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "MongoDB connection failed" | Vercel IP not whitelisted | Go to MongoDB Atlas → Network Access → Add Vercel IP |
| "Failed to create user" | Database write error | Check mongodb user permissions and collection ACLs |
| "Invalid email" | User already exists | Use different email or check if user already in database |
| "Email not sending" | SMTP not configured | Verify all SMTP_* env vars in Vercel |
| "Auth failed" | Password mismatch | Ensure correct test credentials from test-signup response |

## File Changes

- `app/components/auth/AuthForm.tsx` - Added name field and validation
- `app/api/auth/signup/route.ts` - Added name validation and error logging
- `app/api/auth/[...nextauth]/options.ts` - Added OAuth and auth logging
- `app/lib/mongodb.ts` - Added connection logging
- `app/api/test-signup/route.ts` - New: Database and signup testing
- `app/api/test-email/route.ts` - New: Email functionality testing

## Deployment Steps

1. **Commit and push changes**
   ```bash
   git add .
   git commit -m "Add signup name field and comprehensive error logging"
   git push origin main
   ```

2. **Vercel auto-deploys** (if connected to GitHub)

3. **Wait for deployment to complete**
   - Check Vercel dashboard for deployment status
   - Ensure all functions are built successfully

4. **Run tests**
   - Test database connection with `/api/test-signup`
   - Test email with `/api/test-email`
   - Perform manual signup test

5. **Monitor logs**
   - Watch Vercel logs for errors during testing
   - Check MongoDB Atlas for new users being created

## Production Monitoring

After deployment, monitor these metrics:
- Database connection status (should see "Connected to database: ticket-r")
- Signup success rate (check logs for success vs error counts)
- Email delivery (check SMTP logs)
- Authentication success (check "(Auth) User authenticated" logs)

Regular log review will help identify any issues early.
