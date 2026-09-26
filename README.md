## 💻 How to Run the Project

### Option 1: Direct Browser Open (Simplest)
1. Navigate to the project folder on your computer:
   ```
   c:\Users\Debangshika\Desktop\login nexon power
   ```
2. Double-click **`index.html`** or right-click and choose **Open with > Google Chrome** (or Edge/Brave/Firefox).

---

### Option 2: VS Code / IDE Live Server (Recommended)
1. Open the folder in **VS Code** or your IDE.
2. If using VS Code, install the extension **Live Server** (by *Ritwick Dey*).
3. Right-click on **`index.html`** and select **"Open with Live Server"**.
4. The application will open automatically at `http://127.0.0.1:5500/index.html` with hot-reloading.

---

### Option 3: Using Python (Built-in Web Server)
If Python is installed on your system:
1. Open PowerShell or Command Prompt in this folder.
2. Run:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

---

### Option 4: Using Node.js (npx serve)
If Node.js is installed on your system:
1. Open PowerShell or Command Prompt in this folder.
2. Run:
   ```bash
   npx serve .
   ```
3. Open the URL shown in your terminal (usually `http://localhost:3000`).

---

## 🛠️ Validation Rules

| Field | Rule / Format |
|---|---|
| **Full Name / Org Name** | Required (non-empty) |
| **Email** | Valid email pattern (`name@domain.com`) |
| **Mobile Number** | Exactly 10 digits starting with 6, 7, 8, or 9 |
| **Password** | Minimum 6 characters |
| **Confirm Password** | Must match Password exactly |
| **PAN Number** | 10-character alphanumeric (`5 Letters + 4 Digits + 1 Letter`, e.g., `ABCDE1234F`) |
| **Pincode** | Exactly 6 numeric digits |
| **CAPTCHA** | Exact match with the 5-character canvas code |
