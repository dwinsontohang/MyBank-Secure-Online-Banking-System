# MyBank-Secure-Online-Banking-System

MyBank Secure Online Banking System is a comprehensive security enhancement project designed to protect client data, transactions, and communications within a financial institution. This implementation focuses on applying advanced cryptographic techniques to address critical banking security requirements, including data confidentiality, integrity, authentication, and secure key management.

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


## Screenshots

### Authentication & Multi-Factor Authentication (MFA)
*Bank Customer Login Page with MFA (Username, Password, OTP)*  
<img width="433" height="464" alt="image" src="https://github.com/user-attachments/assets/d060837a-d3d0-4557-ba79-206c7b46f6c4" />

*Encrypted JWT Token stored in HTTP-only cookie after login*  
<img width="993" height="532" alt="image" src="https://github.com/user-attachments/assets/bbf96b29-801c-4ae1-97f5-1ce42fe1f3d1" />


### Data Encryption at Rest
*Transaction table showing encrypted amount and digital signature*  
<img width="975" height="49" alt="image" src="https://github.com/user-attachments/assets/b59f2217-ce17-4b0b-90e8-1f65c5948096" />

*Integrity check failure after tampering with encrypted data*  
<img width="975" height="127" alt="image" src="https://github.com/user-attachments/assets/1997eee9-9696-4ae0-ac7b-58d936dd9f14" />
<img width="724" height="218" alt="image" src="https://github.com/user-attachments/assets/c72a3087-3dd5-4d51-ac0e-f6323e3f78ff" />


### Secure Communication (SSL/TLS)
*Wireshark capture showing encrypted traffic to MyBank server*  
<img width="993" height="533" alt="image" src="https://github.com/user-attachments/assets/8403e1c3-04fe-4dad-8b2c-23fc406f385b" />

*SSL/TLS certificate details as seen in the browser*  
<img width="771" height="562" alt="image" src="https://github.com/user-attachments/assets/1732b915-18db-406a-a94d-2bffe15b808d" />


### Role-Based Access Control (RBAC)
*Bank Employee dashboard – approving customer registrations and monitoring transactions history*  
<img width="994" height="304" alt="image" src="https://github.com/user-attachments/assets/8b22d042-4de0-45d6-8044-f1bdda73ef3d" />
<img width="994" height="471" alt="image" src="https://github.com/user-attachments/assets/f56e03c3-4d5f-49ce-a2cb-078756dfc7d2" />

*System Administrator – managing employee accounts*  
<img width="994" height="532" alt="image" src="https://github.com/user-attachments/assets/cc9132e7-2ce7-44d5-84a4-213e7bb2e495" />



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
