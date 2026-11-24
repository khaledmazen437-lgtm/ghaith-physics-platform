Ghaith — Physics E-Learning Platform

> منصة "غيث" التعليمية لمادة الفيزياء للثانوية العامة — كورسات، امتحانات، واجبات، ومحفظة شحن رصيد.

A complete Arabic (RTL) e-learning front-end for a physics instructor, with Firebase (Realtime Database + Auth) as the backend.

## Features

- Student registration and login (Firebase Auth)
- Course catalog, course details and video player pages
- Exams and assignments with results pages
- Evaluations, views and progress screens
- Wallet / balance recharge and subscriptions pages
- Invoices and profile management
- Admin dashboard (`admin.html`)
- Security/privacy page

## Tech Stack

- Vanilla HTML/CSS/JS (single shared stylesheet, `assets/css/style.css`)
- Firebase Realtime Database + Firebase Auth (`assets/js/firebase-config.js`)
- Arabic RTL design, Reem Kufi branding

## Structure

25 static pages wired together by `assets/js/main.js`. All data reads/writes go through the Firebase client SDK.

## Notes

- Firebase API keys in client-side code are expected to be public — the real protection is the Realtime Database security rules. Make sure the rules restrict reads/writes per user and never rely on hiding the config.
- Consider moving admin operations behind Firebase custom claims instead of a client-side admin page.

