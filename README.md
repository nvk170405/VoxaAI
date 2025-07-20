# ⚡ VoxaAI  

A modern **AI-powered journaling and productivity app** built with **Next.js 15, TypeScript, Tailwind CSS, ShadCN, Firebase, and Lucide Icons**.  
VoxaAI helps you manage your **daily thoughts, tasks, goals, and projects** with **AI features, mood tracking, and seamless cloud sync**.

---

## ✨ Features  

- **🔒 Authentication & User Management** – Firebase Auth with email + OAuth.  
- **📅 Calendar Integration** – Plan and track events with a clean UI.  
- **📝 AI Voice Journaling** – Convert your voice to structured journal entries.  
- **🎯 Goal Tracking** – Track personal and professional goals in real-time.  
- **📂 Project Management** – Add and organize projects, stored in Firebase.  
- **🎨 Modern UI** – Built using **ShadCN + Tailwind CSS** with theme toggling.  
- **📊 Analytics Dashboard** – Insights into mood, productivity, and habits.  
- **☁️ Cloud Backup** – Sync your notes and goals securely with Firebase.  
- **🌙 Dark Mode & Themes** – Modern theme toggler with light/dark modes.  

---

## 🛠️ Tech Stack  

- **Frontend:** [Next.js 15](https://nextjs.org/), TypeScript, Tailwind CSS, ShadCN  
- **Backend/Database:** Firebase (Firestore)  
- **Icons:** [Lucide Icons](https://lucide.dev/)  
- **UI Components:** ShadCN/UI & Radix Primitives  
- **Version Control:** Git & GitHub  

---

## 🚀 Getting Started  

### **1. Clone the Repository**
```bash
git clone https://github.com/nvk170405/VoxaAI.git
cd VoxaAI


2. Install Dependencies
bash
Copy
Edit
npm install
# or
yarn install



3. Add Environment Variables
Create a .env.local file in the project root and add your Firebase keys:


NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id


4. Run the Development Server
bash
Copy
Edit
npm run dev
Visit http://localhost:3000 to view your app.

📌 Project Structure
csharp
Copy
Edit
VoxaAI/
├── app/                # Next.js app directory (pages, routes)
├── components/         # UI & functional components (ShadCN, custom)
├── context/            # Global state (theme, auth)
├── hooks/              # Custom hooks
├── lib/                # Firebase & utilities
├── public/             # Static assets
└── README.md           # Project documentation


🤝 Contributing
Contributions are welcome!

Fork this repo

Create a new branch: git checkout -b feature-name

Commit your changes: git commit -m "Add feature"

Push and open a Pull Request


📧 Contact
Developed by Navketan Singh
Feel free to reach out for collaboration or feedback!