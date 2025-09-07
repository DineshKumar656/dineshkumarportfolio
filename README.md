🌐 Smart Impact Folio – Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, Vite, and Tailwind CSS, featuring an admin panel with authentication, persistent data storage, and full content management capabilities.

🚀 Features
🔑 Admin Features

Secure password-based authentication (default: admin123)

Session-based persistence using sessionStorage

Edit mode toggle for content management

CRUD operations for projects, skills, services, certifications, and contact info

File upload support (resume, certificates, images, videos)

👥 User Features

Responsive portfolio layout (mobile-first)

Skills and projects showcase with filtering

Certifications and services display

Contact form powered by EmailJS

Smooth navigation with animated transitions

🏗️ Tech Stack

Framework: React 18.3.1 + TypeScript

Build Tool: Vite

Styling: Tailwind CSS + shadcn/ui components

Routing: React Router DOM v6.26.2

State Management: React Context API + Custom Hooks

Data Storage: LocalStorage (persistent)

Email Integration: EmailJS

Query Management: TanStack React Query v5.56.2

📂 Project Structure
src/
├── components/           
│   ├── ui/              # shadcn/ui reusable components  
│   ├── Navigation.tsx   # Main navigation bar  
│   └── EditModeToggle.tsx # Admin edit/auth control  
├── contexts/            
│   └── EditModeContext.tsx # Global edit mode/auth state  
├── hooks/               
│   ├── useEditMode.ts   # Auth & edit state logic  
│   ├── usePersistentStorage.ts # LocalStorage wrapper  
│   ├── useFileStorage.ts # File upload/storage  
│   └── useProjectStorage.ts # Project CRUD management  
├── pages/               
│   ├── Index.tsx        # Homepage  
│   ├── About.tsx        # About + Resume section  
│   ├── Skills.tsx       # Skills showcase  
│   ├── Projects.tsx     # Projects gallery  
│   ├── Services.tsx     # Service offerings  
│   ├── Certifications.tsx # Certificates display  
│   ├── Contact.tsx      # Contact form + info  
│   └── NotFound.tsx     # 404 page  
└── App.tsx              # Main App component  

🔧 Installation & Setup

Clone the repo

git clone https://github.com/your-username/smart-impact-folio.git
cd smart-impact-folio


Install dependencies
Using npm:

npm install


Or using bun:

bun install


Run development server

npm run dev


or

bun run dev


Visit in browser

http://localhost:5173

🎨 UI/UX Highlights

Mobile-first responsive design

Professional blue/cyan gradient theme

35+ shadcn/ui components

460+ Lucide icons

Animations with Tailwind transitions

Modal dialogs, form validation, toast notifications
