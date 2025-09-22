# UTILS

1. bcrypt: it is used for secure hashing 

To install bcrypt, run the following commands in your project directory:
* npm install bcryptjs 
* npm install @types/bcryptjs --save-dev



# Code Explanation 
export const hashValue = async (value: string): Promise<string> => { }

1. export: 
* Iska matlab hai ye function bahar ke files me bhi use ho sakta hai.
* Agar tum is file ko import karoge kahin aur, to ye function available rahega.
* example : import { hashValue } from "./utils";

2. const hashValue = ...
* Ye ek constant function in the form of arrow function.

3. async
* Ye function asynchronous hai → Matlab iske andar tum await use kar sakte ho.
* Ye hamesha ek Promise return karega.

4. (value: string)
* Ye function ek parameter leta hai jiska naam value hai aur uska type string hai.
* Matlab tum is function ko call karte waqt ek string pass karoge.

5. : Promise<string>
* Ye function ek Promise return karega jo eventually ek string resolve karega.

6. body 
* Salt generate karna
* hash value using the salt 

Important bcrypt Functions 🔑

1. bcrypt.genSalt(rounds) : 
* Ek random salt banata hai.
* rounds = kitna computation chahiye (zyada rounds = zyada secure, lekin thoda slow).

2. bcrypt.hash(value, salt)
* String (password/OTP) ko hash karta hai salt ke sath

3. bcrypt.compare(value, hashedValue)
* User ka diya hua password/OTP aur database ka hash compare karta hai.


# JSONWEBTOKEN
use to create a token 

To install jsonwebtoken, run the following commands in your project directory:
1. npm install jsonwebtoken
2. npm install --save-dev @types/jsonwebtoken

# Code Explanation

It have 2 things 
* JWT_SECRET
* EXPIRES_IN


Important jsonwebtoken Functions 🔑
1. sign
* JWT create karta hai (matlab token generate).
* Tum payload (data) + secret key + options dete ho, aur yeh tumhe ek signed token return karta hai.

2. verify
* Token ko check karta hai ki wo valid hai ya nahi aur expire hua ya nahi.
* Agar token sahi hai → decoded payload return karega.


3. decode 
* Token ko decode karta hai bina verify kiye.
* Matlab wo sirf token ka andar ka payload (header + body) return karega, par authenticity check nahi karega.
* Isliye security ke liye verify() use karo, decode() sirf debug / info ke liye use hota hai.

# NODEMAILER

Install Dependencies
* npm install nodemailer
* npm install --save-dev @types/nodemailer

# Code Explanation
* transporter ek connection object hai jo Nodemailer ko batata hai ki email kaise bhejna hai.
* service: "gmail" → Gmail ke SMTP server use ho rahe hain.
* auth → authentication ke liye user (tumhara email) aur password (App Password from Gmail) use ho raha hai.
* auth → authentication ke liye user (tumhara email) aur password (App Password from Gmail) use ho raha hai.

* sendMail ek async function hai jo 4 parameters leta hai:
1. to → email kisko bhejna hai
2. subject → email ka subject line
3. text → plain text message
4. html (optional) → HTML formatted message