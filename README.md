#  Hospital Management System - Backend

This is the backend for the **Hospital Management System**, built using **Node.js**, **Express.js**, and the native **MongoDB driver**. It provides a RESTful API for managing hospital data including patients, doctors, appointments, departments, and more.

---

## 🚀 Features

- User Authentication & Authorization (JWT-based)
- Admin, Doctor & Patient Role Management
- Manage Appointments (Booking, Cancelling)
- Doctor Scheduling System
- Patient Registration & Management
- Department & Service Management
- Secure RESTful API Endpoints
- MongoDB (Native Driver) Integration

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB (Native Driver)
- JSON Web Token (JWT)
- bcrypt.js (for password hashing)
- dotenv
- CORS
- Morgan (for logging)

---

## 📂 Project Structure


hospital-management-backend/
├── .env # Environment variables
├── server.js # Entry point
└── package.json

## 🔐 Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

▶️ Getting Started
1. Clone the repository
bash

git clone https://github.com/your-username/hospital-management-backend.git
cd hospital-management-backend
2. Install dependencies
bash
npm install
3. Configure environment
Create a .env file as shown above and add your credentials.

4. Start the server
bash

npm run dev
Server will run at http://localhost:5000

📡 API Endpoints (Sample)
Method	Endpoint	Description	Access
POST	/api/auth/register	Register a new user	Public
POST	/api/auth/login	Login user	Public
GET	/api/users	Get all users	Admin Only
GET	/api/doctors	Get all doctors	Admin/All
POST	/api/appointments	Book appointment	Auth

Full API documentation coming soon or via Postman collection.

✅ Future Improvements
Email notifications (Nodemailer)

Admin dashboard with stats

File uploads (prescription, reports)

Payment integration

👨‍💻 Author
Meghla Biswas
Frontend Developer | React Enthusiast
GitHub: MeghlaB

📄 License
This project is licensed under the MIT License.


---

