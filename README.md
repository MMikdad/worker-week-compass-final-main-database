# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e9511a25-de4b-4c75-bbc2-7eafd1cc7783

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e9511a25-de4b-4c75-bbc2-7eafd1cc7783) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e9511a25-de4b-4c75-bbc2-7eafd1cc7783) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Enabling HTTPS for Local Development

To run the development server with HTTPS (self-signed certificates):

1. **Generate self-signed certificates** (requires OpenSSL):

   ```sh
   openssl req -x509 -newkey rsa:2048 -nodes -keyout localhost-key.pem -out localhost-cert.pem -days 365 -subj "/CN=localhost"
   ```
   - This will create `localhost-key.pem` and `localhost-cert.pem` in your project root.

2. **Place the files**
   - Ensure both `localhost-key.pem` and `localhost-cert.pem` are in the root directory of your project (same folder as `vite.config.ts`).

3. **Start the development server**
   - Run:
     ```sh
     npm run dev
     ```
   - The app will now be available at `https://localhost:8080` (or your configured port).
   - Your browser will warn you about the self-signed certificate. You can safely bypass this warning for local development.

**Note:**
- You do not need an internet connection to generate or use self-signed certificates for local development.
- For production, use a certificate from a trusted Certificate Authority (CA).

## How to Start the Server

### 1. Start the Backend (User Data Server)

This server stores and shares user data using a flat file (no database needed).

- Open a terminal in your project root.
- Run:
  ```sh
  node backend/userData.js
  ```
- The backend will run on http://localhost:3001

### 2. Start the Frontend (Vite Dev Server)

- Open another terminal in your project root.
- Run:
  ```sh
  npm install
  npm run dev
  ```
- The frontend will run on https://localhost:8080 (or your configured port).

### 3. Access the App

- Open your browser and go to: https://localhost:8080
- Log in with your credentials (default: admin/admin or user/user)

### Notes
- The backend must be running for user changes to be saved and shared.
- For HTTPS in local development, see the section below for generating self-signed certificates.
