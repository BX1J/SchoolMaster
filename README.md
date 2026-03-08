# SchoolMaster - Student Management System

A modern, fast, and secure School Management System (SMS) built to handle student records, fee tracking, and staff management. 

## 🚀 Tech Stack
* **Frontend:** React.js, Vite
* **Styling:** Tailwind CSS, shadcn/ui
* **Database & Auth:** Firebase (Firestore & Google Auth)
* **Routing:** React Router v6

## 📦 Features
* **Multi-Tenant Architecture:** Principals only see their own school's data via secure Firebase UID mapping.
* **Student Management:** Full CRUD operations for student records.
* **Fee Tracking:** Real-time toggle between 'Paid' and 'Pending' statuses.
* **Role-Based Access:** Protected routes ensuring only authenticated admins can access staff configurations.
* **Google Authentication:** Seamless, secure login via Google OAuth (Redirect flow).

## 🛠️ Local Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory and add your Firebase config keys:
   \`\`\`env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   \`\`\`
4. Run `npm run dev` to start the local server.