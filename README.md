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
