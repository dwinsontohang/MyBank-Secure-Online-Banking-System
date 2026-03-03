from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Numeric
from sqlalchemy.orm import relationship
from decimal import Decimal
from datetime import datetime
from app.config import Base
from app.utils.encryption import encrypt_data, decrypt_data

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)  # Stored as a hash
    id_number = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=False)  # "customer", "employee", "admin"
    otp_secret = Column(String, unique=True, nullable=True)
    is_verified = Column(Boolean, default=False)
    balance = Column(Numeric(precision=18, scale=2), nullable=False, default=Decimal('0.00'))

    # Transaction relationship as a sender
    sent_transactions = relationship("Transaction", foreign_keys="Transaction.sender_id", back_populates="sender")

    # Transaction relationship as a receiver
    received_transactions = relationship("Transaction", foreign_keys="Transaction.receiver_id", back_populates="receiver")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount_encrypted = Column(String, nullable=False)  # Store amount in encrypted form
    transaction_type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    signature = Column(String, nullable=False)

    # Relationship to User as a sender
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_transactions")

    # Relationship to User as a receiver
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_transactions")

    # Property to decrypt the transaction amount when accessed
    @property
    def amount(self):
        if self.amount_encrypted:  # Check if the data is not empty
            return Decimal(decrypt_data(self.amount_encrypted))
        return 0.0  # If no data is found, return 0

    @amount.setter
    def amount(self, value):
        self.amount_encrypted = encrypt_data(str(Decimal(value).quantize(Decimal('0.01'))))
