1️⃣ Database Tables
We need two main tables:
1. User : id (UUID, PK), email (unique), password, isVerified, mfaEnabled
2. OTP : id (UUID, PK), code (hashed), userId (FK → User.id), createdAt, expiresAt

2️⃣ User Login Flow with MFA

step 1 : 
Action : User enters email & password
System Behavior : Validate credentials

step 2: 
Action : Check if mfaEnabled is true
System Behavior : If yes → generate OTP and save in OTP table

step 3: 
Action : Send OTP via Email/SMS
System Behavior : OTP expires in 5 minutes

step : 4 
Action : User enters OTP
System Behavior : Validate OTP against DB record

step : 5
Action: If OTP valid
System Behavior : Login success → issue JWT or session

step : 6 
Action : If OTP invalid/expired
System Behaviour : Reject login → user retries

3️⃣ OTP Table Example
id (UUID)	   code (hashed)	userId (UUID)	createdAt	        expiresAt
a1b2c3d4-e5f6	$2b$10$N...	    user-123	    2025-09-22 00:00	2025-09-22 00:05
f6e5d4c3-b2a1	$2b$10$Q...	    user-123	    2025-09-22 01:00	2025-09-22 01:05

4️⃣ Key Notes
* OTP Expiry: 5 minutes or configurable.
* OTP Hashing: Never store raw OTPs; hash them in DB.
* Security: Limit OTP attempts (e.g., max 3 tries).
* Cleanup: Delete used or expired OTPs.



