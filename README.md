# MyBank-Secure-Online-Banking-System

MyBank Secure Online Banking System is a comprehensive security enhancement project designed to protect client data, transactions, and communications within a financial institution. Developed as part of the Applied Cryptography (WM9PC-15) coursework, this implementation focuses on applying advanced cryptographic techniques to address critical banking security requirements, including data confidentiality, integrity, authentication, and secure key management.

The system is built in compliance with GDPR (General Data Protection Regulation) and PCI-DSS (Payment Card Industry Data Security Standard) to ensure the highest level of security for sensitive financial data.

## System Architecture
The application follows a three-tier architecture:

1. Frontend (Web Interface): Built with Next.js, providing an interactive interface for users and built-in middleware to protect against common web attacks.

2. Backend (API Server): Developed with FastAPI (Python), handling authentication, encryption, transaction processing, and secure communication.

3. Database: Utilizes PostgreSQL to store encrypted user and transaction data.


## Key Features
* Data Encryption (At Rest & In Transit):

    * Implements AES-256 to encrypt sensitive transaction details (e.g., amount_encrypted field) before storing them in the database.

    * Uses RSA-2048 to securely encrypt and exchange AES keys during transit, ensuring key confidentiality.

    * All data in transit is further protected by SSL/TLS (HTTPS), verified through Wireshark packet analysis.

* Secure Communication:

    * Establishes encrypted channels using SSL/TLS certificates (from Let's Encrypt) for all data exchanged between the client browser and the server.

    * Implements HTTPS to secure web services and prevent man-in-the-middle attacks.

* Key Management System:

    * Cryptographic keys (AES keys, RSA private keys, SSL/TLS certificates) are securely stored on the server with strict file permissions (e.g., in /etc/mybank/ and /etc/letsencrypt/).

    * Keys are accessed by the backend via environment variables and secure configuration files.

* Multi-Factor Authentication (MFA):

    * Enforces strong user authentication for all roles (Client, Employee, System Administrator).

    * Users must provide a Username, Password, and a Time-based One-Time Password (TOTP) from Google Authenticator to log in, satisfying PCI-DSS requirements.

* Data Integrity:

    * Ensures transaction data remains unaltered through digital signatures.

    * For data at rest, an HMAC-SHA256 signature is generated for each transaction. Any unauthorized modification to the database (e.g., altering an encrypted amount) triggers a "Transaction integrity check failed" warning.

* Role-Based Access Control (RBAC):

    * Implements three distinct user roles with tailored permissions based on GDPR and PCI-DSS guidelines.

    * Bank Customer: Can register, manage accounts, transfer funds, and view own transaction history.

    * Bank Employee: Can verify customer registrations and view all customer transactions.

    * System Administrator: Can manage employee accounts (create/delete).

* Secure Authentication & Authorization:

    * Passwords are hashed using bcrypt before storage.

    * User sessions are managed with JSON Web Tokens (JWT) signed with HMAC-SHA256, stored in HTTP-only secure cookies to prevent XSS attacks.

    * Registration requires employee approval, adding an extra layer of security against unauthorized account creation.

## Technologies Used

* Frontend: Next.js, TypeScript

* Backend: Python, FastAPI

* Database: PostgreSQL (with encryption modules)

* Encryption Algorithms: AES-256, RSA-2048, HMAC-SHA256, bcrypt

* Security Protocols: SSL/TLS, HTTPS

* Authentication: JWT, TOTP (Multi-Factor Authentication)

* Testing Tools: Postman, Wireshark, PuTTY / MobaXterm

* Server & Networking: DuckDNS (for dynamic DNS), Let's Encrypt (for SSL certificates)


## Testing & Validation

The system has been rigorously tested to validate its five core security components:

* Authentication: Verified login flows with MFA for all user roles. JWT tokens are correctly generated and stored securely.

* Authorisation: Ensured role-based access controls prevent users from accessing unauthorized features (e.g., customers cannot access the employee approval page).

* Encryption:

    * Data at Rest: Confirmed transaction amounts are encrypted in the database. An integrity check successfully detected manual tampering with the amount_encrypted field.

    * Data in Transit: Verified that the amount field in a transfer request is encrypted with AES on the frontend before being sent to the backend.

* Key Management: Validated that private keys (RSA, SSL) are stored with restricted permissions (e.g., -rw------- for root) and are not exposed in the application logs.

* Secure Communication: Used Wireshark to capture traffic to/from the server (IP 173.249.49.134), confirming all data payloads were encrypted via SSL/TLS and not readable in plain text.


## User Roles & Operations

| Role | Key Operations |
|------|----------------|
| Bank Customer | Register, Login (MFA), Transfer Funds, View Encrypted Transaction History, Check Balance, Update Profile. |
| Bank Employee | Login (MFA), View Pending Customer Registrations, Approve/Reject New Customers, View All Customer Transactions. |
| System Admin | Login (MFA), View List of Employees, Create New Employee Accounts, Delete Employee Accounts. |


## Assumptions & Compliance

* Regulatory Compliance: The system design assumes compliance with GDPR (for personal data protection) and PCI-DSS (for transaction security and access control).

* Environment: It is assumed the system operates within a trusted network environment with additional perimeter security measures (e.g., firewalls, intrusion detection systems) managed by system administrators.

* Future Enhancements: While the current implementation is robust, future iterations could benefit from Hardware Security Modules (HSM) for key storage and upgrading digital signatures to SHA-512 for increased resistance against attacks.
  

## Installation & Setup

1. Clone the repository:
   *git clone https://github.com/dwinsontohang/MyBank-Secure-Online-Banking-System.git
   cd MyBank-Secure-Online-Banking-System*

3. Backend Setup (FastAPI):
   * Navigate to the backend folder.
   * Create a virtual environment: python -m venv venv
   * Activate it and install dependencies: pip install -r requirements.txt
   * Set up environment variables (see .env.example) for database connection, AES keys, and RSA keys.
   * Run the server: uvicorn main:app --reload

4. Frontend Setup (Next.js):
   * Navigate to the frontend folder.
   * Install dependencies: npm install
   * Set up environment variables for the backend API URL.
   * Run the development server: npm run dev

5. Database Setup:
   * Install PostgreSQL and create a database for the project.
   * Run the provided SQL scripts (if any) to create the users and transactions tables as defined in the coursework.

## Author
Dwinson Sitohang - Cybersecurity Professional
