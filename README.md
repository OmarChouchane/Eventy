# Eventy 🎉

**Eventy** is a sleek and modern event management web app designed to help you host, connect, and celebrate events effortlessly. Whether you're organizing a conference, meetup, or party, Eventy provides everything you need to manage your events and attendees with ease.

---

## 🚀 Features

- **User Authentication:** Secure sign-up and login with modern authentication.
- **Event Creation & Management:** Create, edit, and delete events with rich details.
- **Event Registration:** Users can register for events and receive email confirmations.
- **Participant Management:** Organizers can view and manage the list of registered attendees.
- **Resource Management:** Book and manage event resources like rooms, equipment, and materials.
- **Real-time Notifications:** Get notified about registration and event updates.
- **Responsive UI:** Built with modern UI components for a smooth experience on all devices.

---


### Eventy Home

![localhost_3000_ (3)](https://github.com/user-attachments/assets/5d07c7f4-f5d1-459d-9d81-be1e5775a5dc)


---

### Eventy Admin Dashboard
![localhost_3000_dashboard_resources](https://github.com/user-attachments/assets/4c844d55-4034-47d7-b519-d55b2bf1dd57)

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Shadcn UI
- **Backend:** Node.js, Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** Clerk
- **Forms & Validation:** React Hook Form, Zod
- **File Uploads:** Uploadthing
- **Date Handling:** React-Datepicker

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/eventy.git
cd eventy
npm install
npm run dev



```

## 🚀 Deployment

You can deploy Eventy easily on platforms like Vercel or Netlify.

**Push your code to GitHub:**
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

1. Connect your GitHub repo to Vercel (done in the Vercel dashboard).
2. Add required environment variables in your Vercel dashboard:
   - `NEXT_PUBLIC_CLERK_FRONTEND_API`
   - `CLERK_API_KEY`
   - `MONGODB_URI`
   - `EMAIL_SERVICE_API_KEY`
3. Trigger deployment on Vercel.

---

## 🧪 Testing

Run tests locally with:

```bash
npm run test
```

---

## 📅 Roadmap

- Add calendar sync with Google and Outlook
- SMS notifications for event reminders
- Enhanced analytics dashboard for organizers
- Multi-language support (i18n)
- Mobile app version (iOS and Android)

---

## ❓ FAQ

**Q: Can I use Eventy for free?**  
A: Yes! Eventy is open-source and free to use.

**Q: How do I reset my password?**  
A: Use the password reset link on the login page powered by Clerk.

**Q: Can I export event participant lists?**  
A: Yes, organizers can export participant data as CSV files.

---

## 🙌 Contributing

Contributions are welcome! To contribute:

1. Fork the repo
2. Create a feature branch:
    ```bash
    git checkout -b feature/your-feature
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add some feature"
    ```
4. Push to the branch:
    ```bash
    git push origin feature/your-feature
    ```
5. Open a Pull Request

Please follow the Code of Conduct and Contributing Guidelines.

---

## 📄 License

Eventy is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

Created with ❤️ by Chouchane Omar  
Feel free to reach out for questions, feedback, or collaboration!

---

✨ **Thanks for checking out Eventy — happy event managing!** 🎉

---
