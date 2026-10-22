# CivicConnect Cloud Deployment Guide
## Free-Tier Full-Stack Production Architecture

This guide walks you through deploying **CivicConnect** completely **free of charge** without needing a credit card, using the recommended cloud free-tier architecture:

```
+-------------------------------------------------------------+
| 1. Cloud MySQL Database: Aiven for MySQL (Free Tier - 5GB)   |
|    Hosts the relational database and table schemas          |
+------------------------------+------------------------------+
                               | JDBC Connection
+------------------------------v------------------------------+
| 2. Backend: Render.com Web Service (Free Tier)              |
|    Runs Spring Boot 3.3.5 Docker container                  |
|    URL: https://civicconnect-backend-xxxx.onrender.com      |
+------------------------------+------------------------------+
                               | REST HTTPS APIs
+------------------------------v------------------------------+
| 3. Frontend: Vercel / Netlify (Free Tier)                   |
|    Hosts React 18 + Vite SPA with global CDN                |
|    URL: https://civicconnect-xxxx.vercel.app                |
+-------------------------------------------------------------+
```

---

## Prerequisites (Before You Begin)

1. **GitHub Account**: Make sure your project is pushed to a GitHub repository (Public or Private).
2. **Push the latest commit** containing the deployment files (`Dockerfile`, `vercel.json`, `_redirects`):
   ```powershell
   git add .
   git commit -m "Add cloud deployment configuration files"
   git push origin main
   ```

---

## Step 1: Create a Free Cloud MySQL Database (Aiven)
*(Takes ~3 minutes — 100% Free, no credit card required)*

1. Go to [https://aiven.io/](https://aiven.io/) and click **Sign Up** (or log in with GitHub/Google).
2. Click **Create Service**.
3. Choose **MySQL**.
4. Select the **Free Plan** (Free forever: 1 CPU, 1 GB RAM, 5 GB storage).
5. Choose a Cloud Provider and Region (choose one geographically closest to you, e.g., `aws-ap-south-1` Mumbai or `aws-eu-west-1` Frankfurt).
6. Give your service a name, e.g., `civicconnect-db`, then click **Create Service**.
7. Wait 1–2 minutes until the status shows **Running**.
8. In the **Overview** tab under **Connection Information**, locate:
   - **Host** (e.g., `mysql-xxxx.aivencloud.com`)
   - **Port** (e.g., `12345`)
   - **User** (usually `avnadmin`)
   - **Password** (click eye icon to copy)
   - **Database Name** (default is `defaultdb`)
9. Your JDBC URL format will be:
   ```
   jdbc:mysql://<HOST>:<PORT>/defaultdb?sslmode=require&createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true
   ```

---

## Step 2: Deploy the Spring Boot Backend (Render.com)
*(Takes ~5 minutes — 100% Free Web Service)*

1. Go to [https://render.com/](https://render.com/) and click **Sign Up / Log In with GitHub**.
2. From the Render Dashboard, click **New +** and select **Web Service**.
3. Under *Connect a repository*, choose your **CivicConnect** repository and click **Connect**.
4. Configure the service:
   - **Name**: `civicconnect-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Select **Docker** (Render will automatically detect `backend/Dockerfile`).
   - **Instance Type**: Select **Free** (0.1 CPU, 512 MB RAM).
5. Scroll down to **Environment Variables** and click **Add Environment Variable** for each of the following:

   | Variable Key | Value | Description |
   | :--- | :--- | :--- |
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://<HOST>:<PORT>/defaultdb?sslmode=require&allowPublicKeyRetrieval=true` | Replace `<HOST>` and `<PORT>` from Aiven |
   | `SPRING_DATASOURCE_USERNAME` | `avnadmin` | Your Aiven DB username |
   | `SPRING_DATASOURCE_PASSWORD` | `<AIVEN_PASSWORD>` | Your Aiven DB password |
   | `JWT_SECRET` | `civicconnect_super_secure_jwt_secret_key_2026_at_least_256_bits_long` | JWT signing secret |
   | `ADMIN_BOOTSTRAP_EMAIL` | `admin@civicconnect.gov.in` | Municipal Admin initial login |
   | `ADMIN_BOOTSTRAP_PASSWORD` | `AdminPass2026!` | Municipal Admin initial password |
   | `CORS_ALLOWED_ORIGINS` | `*` | Set to `*` initially; update to your Vercel URL in Step 4 |

6. Click **Create Web Service**.
7. Render will pull your repository, build the Docker image, run database migrations in MySQL, bootstrap the administrator, and start the app on port 8080.
8. Once the build completes and logs display `Tomcat started on port...`, copy your **Render Service URL** at the top:
   - Example: `https://civicconnect-backend-xxxx.onrender.com`
9. **Test Your Backend Live:**
   Open a browser and navigate to:
   `https://civicconnect-backend-xxxx.onrender.com/api/departments`
   You should receive a JSON response with the standard municipal departments!

---

## Step 3: Deploy the React Frontend (Vercel)
*(Takes ~2 minutes — 100% Free CDN & Instant SSL)*

1. Go to [https://vercel.com/](https://vercel.com/) and click **Sign Up / Log In with GitHub**.
2. Click **Add New...** -> **Project**.
3. Choose your **CivicConnect** repository and click **Import**.
4. In the Project Configuration screen:
   - **Project Name**: `civicconnect`
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: Click **Edit** and select `frontend` (or `CivicConnect/frontend`).
   - **Build and Output Settings**: Default (`npm run build` and `dist`).
5. Expand the **Environment Variables** section:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://civicconnect-backend-xxxx.onrender.com/api`
     *(Make sure to append `/api` to your Render backend URL from Step 2!)*
6. Click **Deploy**.
7. Vercel will install dependencies and build the production bundle.
8. Once finished, click **Continue to Dashboard** or **Visit Site** to get your live frontend URL:
   - Example: `https://civicconnect-app.vercel.app`

*(Note: The pre-configured `vercel.json` ensures that navigating directly to `/citizen/dashboard`, `/officer/complaints`, or `/admin` and pressing F5 refresh will never result in a 404).*

---

## Step 4: Finalize CORS Security
*(Takes ~1 minute)*

1. Go back to your **Render Dashboard** -> `civicconnect-backend` -> **Environment**.
2. Edit the `CORS_ALLOWED_ORIGINS` variable:
   - Change from `*` to your exact Vercel frontend URL:
   ```
   https://civicconnect-app.vercel.app,http://localhost:5173
   ```
3. Click **Save Changes** (Render will redeploy with strict CORS in ~30 seconds).

---

## Step 5: Verification & Demonstration

1. Open your live Vercel URL in your browser: `https://civicconnect-app.vercel.app`
2. **Citizen Test:**
   - Click **Register** -> Create a citizen account.
   - Submit a complaint with a title, description, ward, and upload an issue photo.
   - Confirm it appears in **My Complaints**.
3. **Admin Test:**
   - Log in at `/admin/login` using:
     - Email: `admin@civicconnect.gov.in`
     - Password: `AdminPass2026!`
   - Verify that the live complaint appears on the Admin Dashboard.
4. **Officer Test:**
   - Register a field officer at `/officer/register`.
   - Log in as Admin -> Go to **Pending Officers** -> Click **Approve**.
   - Log in as Officer -> View assigned complaint -> Upload work-start proof -> Upload resolution proof.
   - Log in as Citizen -> View resolution proof -> Submit a 5-star rating -> Complaint closes.

---

## Optional: Deploy Anywhere via Docker Compose

If you or your evaluators prefer running everything containerized on a single server, Linux VM, or laptop:

```powershell
docker compose up --build -d
```

This starts:
- MySQL 8.0 on port `3306`
- Spring Boot on port `8080`
- React Frontend via Nginx on port `5173`
