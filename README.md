
# 🛠️ FundiMatch – Trusted Fundis & Contractors in Kenya

FundiMatch is a web-based application that connects homeowners, tenants, and project managers in Kenya with verified and professional fundis (craft workers), contractors, and engineers. It is a platform that aims to provide a seamless experience for both users and fundis, while ensuring the safety and reliability of the matches. 

It’s a simple, responsive, and secure fundi matching platform built using HTML, CSS, JavaScript, and Firebase Authentication. The project allows users to register, login, and view their fundi profiles, making it easy to find and connect with potential fundi matches.

🎥 **Demo Video**: [Watch on Loom](https://www.loom.com/share/d2dfd4e703ec4ea69c1591ba5776a735?sid=94d3bc6e-1e98-4174-8292-b34d64c8bd1b)

---

## 🚀 Features

- **User Authentication**: Firebase-based login/register with email verification  
- **Job Requests**: Submit jobs with title, description, and optional media (image/video)  
- **Skill Categories**: Choose from Fundis, Contractors, and Professionals  
- **Suggested Fundis**: View top-rated fundis based on category  
- **Profile Management**: Users can edit profile info and see their job history  
- **Local Storage Support**: Requests are saved per user locally for MVP testing  
- **Modern UI**: Built with Tailwind CSS and mobile-first design  

---

## 📦 Tech Stack

- **Frontend**: HTML, CSS (Tailwind), JavaScript (ES6+)  
- **Auth & Hosting**: Firebase Authentication  
- **Mock Fundi Profiles**: Random User API  
- **Data Storage**: `localStorage` (can be upgraded to Firebase Firestore)  
- **Bundler/Local API**: JSON Server (optional for backend simulation)  

---

## 🔐 Firebase Setup

Add your Firebase config to `firebase-config.js`:

```js
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};



📂 Folder Structure
bash
Always show details

Copy
/
├── index.html              # Landing Page with Login/Register
├── dashboard.html          # Main dashboard for logged-in users
├── script.js               # Handles auth, modals, validation
├── dashboard.js            # Dashboard logic and UI updates
├── firebase.js             # Firebase app initialization
├── firebase-config.js      # Firebase configuration file
├── db.json                 # Optional mock backend data
└── css/                    # Tailwind or custom styles


## 🧪 Running the Project

1. **Clone the repo**
2. **Host locally** using Live Server or deploy using Firebase Hosting
3. **Enable Firebase Authentication** in your Firebase project
4. **(Optional)** Run a mock API using JSON Server:

```bash
npx json-server --watch db.json
```
  



## Future Enhancements


M-Pesa payment integration

Verified fundi profiles with ID/photo upload

Fundi-side login & dashboard

Real-time chat and job status updates

Firebase Firestore & Firebase Storage integration

👤 Author
Gibson Waheire

Software Engineer & Entrepreneur
📧 Email: g.waheir00@gmail.com