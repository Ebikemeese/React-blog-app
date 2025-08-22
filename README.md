# React-Django Blog App

A full-stack content management system built with **React** on the frontend and **Django + Django REST Framework** on the backend.  

It features **user authentication (with email OTP + social login via Google/GitHub)**, password reset/change functionality, CRUD operations for blogs and profiles, and **Sentry integration** for error monitoring.  

- **Frontend** → Hosted on **GitHub Pages**  
- **Backend** → Hosted on **Render**  
- **Database** → **PostgreSQL** in production, **SQLite** in development  

---

## 🚀 Features

- **User Authentication**
  - Register/login with email + password.
  - OTP-based email confirmation.
  - Password reset & password change.
  - **Social login via Google or GitHub**.

- **Blog Management**
  - CRUD operations on blog posts.
  - Update/manage user profile.

- **Error Monitoring**
  - **Sentry** integration for error tracking.

- **Database**
  - Development → **SQLite** (default Django DB).
  - Production → **PostgreSQL** (via Render).

---

## 🛠 Tech Stack

| Component         | Technology                                |
|------------------|--------------------------------------------|
| Frontend         | React, GitHub Pages deployment             |
| Backend          | Django, Django REST Framework (DRF), Render hosting |
| Auth & Email     | OTP-based email confirmation, social login (Google, GitHub) |
| Monitoring       | Sentry                                     |
| Database         | **SQLite (dev)** / **PostgreSQL (prod)**   |
| API              | RESTful endpoints, JWT/Token-based auth    |

