from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed_password = pwd_context.hash("admin123")  # Change "adminpassword" with the password you want
print("Password Hash:", hashed_password)


import pyotp

otp_secret = pyotp.random_base32()
print("OTP Secret:", otp_secret)

