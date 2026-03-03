from pydantic import BaseModel, condecimal
from decimal import Decimal

class TransferRequest(BaseModel):
    receiver_username: str
    amount: condecimal(gt=0, decimal_places=2)  # Ensure amount > 0 and has 2 decimal places

