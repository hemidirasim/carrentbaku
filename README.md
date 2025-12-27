# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9ee2c8c9-ef1c-457a-be31-bf6266495654

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9ee2c8c9-ef1c-457a-be31-bf6266495654) and start prompting.

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

Simply open [Lovable](https://lovable.dev/projects/9ee2c8c9-ef1c-457a-be31-bf6266495654) and click on Share -> Publish.

### Manual server deployment (new.carrentbaku.az)

When deploying directly on the DigitalOcean droplet, follow these steps to avoid wiping user-generated uploads (blog images, etc.):

1. SSH into the server and move to the project directory:

   ```bash
   cd /var/www/new.carrentbaku.az/source
   ```

2. Install dependencies (once) and build:

   ```bash
   npm install
   npm run build
   ```

3. Sync the new build to `public_html` while preserving the `uploads` directory:

   ```bash
   rsync -a --delete --exclude 'uploads/' dist/ ../public_html/
   ```

4. Restart the Node server (`/usr/bin/node --import tsx server/index.ts`).

> ⚠️ Never run `rsync` with `--delete` against `public_html` without excluding the `uploads/` directory—doing so will erase all uploaded blog images.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
