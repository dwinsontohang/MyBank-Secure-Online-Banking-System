# MyBank-Secure-Online-Banking-System

MyBank Secure Online Banking System is a comprehensive security enhancement project designed to protect client data, transactions, and communications within a financial institution. Developed as part of the Applied Cryptography (WM9PC-15) coursework, this implementation focuses on applying advanced cryptographic techniques to address critical banking security requirements, including data confidentiality, integrity, authentication, and secure key management.

The system is built in compliance with GDPR (General Data Protection Regulation) and PCI-DSS (Payment Card Industry Data Security Standard) to ensure the highest level of security for sensitive financial data.

System Architecture
The application follows a three-tier architecture:

1. Frontend (Web Interface): Built with Next.js, providing an interactive interface for users and built-in middleware to protect against common web attacks.

2. Backend (API Server): Developed with FastAPI (Python), handling authentication, encryption, transaction processing, and secure communication.

3. Database: Utilizes PostgreSQL to store encrypted user and transaction data.
