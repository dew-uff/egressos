This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/api.ts`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Deploy on VM

To run a Next.js application on a generic VM using Yarn, follow these steps. This guide includes setting up the VM, installing necessary dependencies and deploying your Next.js application.

### 1. Set Up Your Virtual Machine

1. **Create or Provision a VM:**
   - Provision a virtual machine using your preferred cloud provider or local virtualization software.
   - Ensure the VM runs a compatible operating system like Ubuntu.

### 2. Connect to Your VM

1. **Access the VM:**
   - Use SSH to connect to your VM. For example:
     ```sh
     ssh user@your-vm-ip
     ```

### 3. Install Node.js and Yarn

1. **Install Node.js:**
   - Update package lists and install Node.js:
     ```sh
     sudo apt update
     sudo apt install nodejs npm
     ```
   - Alternatively, use Node Version Manager (nvm) for managing Node.js versions:
     ```sh
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
     source ~/.bashrc
     nvm install node
     ```

2. **Install Yarn:**
   - Use the following commands to install Yarn:
     ```sh
     npm install --global yarn
     ```
   - Verify the installations:
     ```sh
     node -v
     yarn -v
     ```

### 4. Set Up Your Next.js Application

1. **Clone Your Application Repository:**
   - If using Git, clone your application repository:
     ```sh
     git clone git@github.com:dew-uff/egressos.git
     cd egressos/front/graduate-system-front
     ```

2. **Install Dependencies with Yarn:**
   - In the application directory, install dependencies:
     ```sh
     yarn
     ```

### 5. Configure the Production Server

1. **Build the Application:**
   - Create the production build of your Next.js application:
     ```sh
     yarn build
     ```

2. **Start the Application:**
   - Start the application in production mode:
     ```sh
     yarn start
     ```
   - To keep the application running after you log out of the SSH session, use a process manager like `pm2`:
     ```sh
     yarn global add pm2
     pm2 start yarn --name "graduate-system-front" -- start
     pm2 save
     pm2 startup
     ```

### 6. Configure Firewall Rules (If Using a Cloud Provider)

1. **Add Firewall Rules:**
   - Ensure that your VM's firewall allows traffic on ports 80 (HTTP) and 443 (HTTPS). This step varies depending on your cloud provider.

### 7. Configure the Server to Accept External Connections

1. **Edit the Start Script:**
   - Ensure your application is configured to listen on `0.0.0.0`.
   - In the `package.json` file, your start script should look like this:
     ```json
     "scripts": {
       "start": "next start -p 80 -H 0.0.0.0"
     }
     ```
   - Alternatively, start PM2 directly with these parameters:
     ```sh
     pm2 start yarn --name "graduate-system-front" -- start -- -p 80 -H 0.0.0.0
     ```

2. **Restart the Application:**
   - If you modified the start script, restart the application:
     ```sh
     pm2 restart graduate-system-front
     ```

### 8. Access the Application

1. **Get the External IP Address:**
   - If using a cloud provider, find your VM's external IP address from the provider's dashboard.

2. **Open Your Browser:**
   - Enter the external IP address of your VM in the browser.
   - You should see your Next.js application running.

### Example Commands

1. **Connect and Verify PM2:**
   ```sh
   ssh user@your-vm-ip
   pm2 list
   ```

2. **Add Firewall Rule (Example for UFW on Ubuntu):**
   - Allow HTTP traffic:
     ```sh
     sudo ufw allow 80/tcp
     sudo ufw allow 443/tcp
     sudo ufw enable
     ```

3. **Edit Script and Restart:**
   - On the SSH terminal:
     ```sh
     cd <APPLICATION_DIRECTORY>
     pm2 restart graduate-system-front -- -p 80 -H 0.0.0.0
     ```

4. **Access the Application:**
   - In your browser, go to `http://<EXTERNAL_IP_ADDRESS>`.

Following these steps, you should be able to run your Next.js application on a generic VM using Yarn and make it accessible externally.
