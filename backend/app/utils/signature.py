import hashlib
import hmac
import os

# Use a secret key for HMAC
SIGNATURE_SECRET = os.getenv("SIGNATURE_SECRET", "mybank_signature_secret").encode()

# Function to create a digital signature (HMAC)
def create_signature(transaction_data: str) -> str:
    signature = hmac.new(SIGNATURE_SECRET, transaction_data.encode(), hashlib.sha256).hexdigest()
    return signature

# Function to verify a digital signature
def verify_signature(transaction_data: str, signature: str) -> bool:
    expected_signature = create_signature(transaction_data)
    return hmac.compare_digest(expected_signature, signature)


