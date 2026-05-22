const STORAGE_KEY = "voxplay.users.v1";
const ACTIVE_KEY = "voxplay.activeUser.v1";
const RESET_ONCE_KEY = "voxplay.resetDone.v1";
const OWNER_USERNAME = "voxplay's admin";
const ADMIN_USERNAMES = new Set(["admin"]);
const SITE_NAME = "voxplayonline.js.org";

let signupRouteUnlocked = false;
let routeLogin;
let routeSignup;
let routeMenu;
let loginForm;
let signupForm;
let authMessage;
let accountCard;
let accountSummary;
let accountAvatar;
let menuScreen;
let menuWelcome;
let menuHandle;
let menuCurrency;
let menuFriends;
let menuGroups;
let menuVisits;
let logoutBtn;
let signupPassword;
let passwordStrength;
let strengthBar;
let toggleSignupPassword;
let openSignupFromLogin;
let backToLoginFromSignup;
let adminPanel;
let adminTotalAccounts;
let adminBannedAccounts;
let adminAdminAccounts;
let adminUserSelect;
let adminCoinsAmount;
let adminGiveCoinsBtn;
let adminBanToggleBtn;
let adminUserTableBody;
let shareLinkInput;
let copyShareLinkBtn;
let nativeShareBtn;

function bootAppShell() {
  document.title = SITE_NAME;

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --bg: #0b1118;
      --panel: #121c28;
      --panel-2: #19283a;
      --line: #2a3f57;
      --text: #ecf4ff;
      --muted: #9cb2c8;
      --brand: #25b9ff;
      --brand-2: #0e82d1;
      --ok: #16c47f;
      --err: #ff6474;
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; font-family: Segoe UI, system-ui, sans-serif; color: var(--text); }
    body {
      background:
        radial-gradient(circle at 85% -20%, rgba(37, 185, 255, 0.2), transparent 42%),
        radial-gradient(circle at 10% 120%, rgba(22, 196, 127, 0.12), transparent 38%),
        var(--bg);
      padding: 16px;
    }

    .wrap { width: min(980px, 96vw); margin: 0 auto; }
    .topbar, .panel, .footnote {
      border: 1px solid var(--line);
      border-radius: 14px;
      background: linear-gradient(180deg, var(--panel-2), var(--panel));
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.28);
    }
    .topbar { padding: 14px 18px; margin-bottom: 14px; }
    .brand { margin: 0; font-size: clamp(1.25rem, 2.8vw, 2rem); letter-spacing: 0.04em; }
    .tag { margin: 6px 0 0; color: var(--muted); font-weight: 600; }
    .panel { padding: 16px; }
    .auth-head h2 { margin: 0; }
    .auth-head p { margin: 6px 0 12px; color: var(--muted); }

    .route-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
    .route-btn {
      text-align: center;
      text-decoration: none;
      color: #d9e8fb;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 8px;
      background: #182534;
      font-weight: 700;
    }
    .route-btn.active {
      background: linear-gradient(180deg, var(--brand), var(--brand-2));
      border-color: #0f5e95;
      color: #f6fbff;
    }

    .auth-form label { display: block; margin-bottom: 10px; font-weight: 600; }
    .auth-form input, .auth-form select {
      width: 100%;
      margin-top: 4px;
      background: #0d1620;
      color: var(--text);
      border: 1px solid var(--line);
      border-radius: 9px;
      padding: 10px;
      font: inherit;
    }
    .password-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; }

    .btn, .free-account-btn, .eye-btn {
      border: 1px solid #1e628f;
      border-radius: 10px;
      background: linear-gradient(180deg, var(--brand), var(--brand-2));
      color: #f7fdff;
      font: inherit;
      font-weight: 700;
      padding: 10px 12px;
      cursor: pointer;
    }
    .free-account-btn, .eye-btn {
      border-color: var(--line);
      background: #22354a;
    }
    .button-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .hidden { display: none !important; }

    .strength-label { display: inline-block; margin-top: 6px; color: var(--muted); }
    .strength-track {
      margin-top: 6px;
      width: 100%;
      height: 8px;
      border-radius: 999px;
      background: #0b121a;
      border: 1px solid var(--line);
      overflow: hidden;
    }
    .strength-fill { height: 100%; width: 20%; background: #ff6474; transition: width 180ms ease; }
    .strength-fill.medium { background: #ffb347; }
    .strength-fill.strong { background: var(--ok); }

    .auth-message { min-height: 1.2em; margin: 10px 0; }
    .auth-message.error { color: var(--err); }
    .auth-message.success { color: var(--ok); }

    .menu-top, .profile-strip, .stats-grid, .share-panel { margin-top: 14px; }
    .profile-strip {
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #101c28;
    }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .stat-card {
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 10px;
      background: #101c28;
    }
    .stat-card p { margin: 0 0 4px; color: var(--muted); }
    .stat-card strong { font-size: 1.2rem; }

    .share-panel {
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 10px;
      background: #101c28;
    }
    .share-row { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; }

    .admin-panel {
      margin-top: 14px;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 10px;
      background: #101c28;
    }
    .admin-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .admin-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
    .admin-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
    .admin-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .admin-table th, .admin-table td { border: 1px solid var(--line); padding: 6px; text-align: left; }

    .footnote { margin-top: 12px; padding: 10px; color: var(--muted); }

    @media (max-width: 740px) {
      .stats-grid, .admin-grid, .admin-controls { grid-template-columns: 1fr; }
      .share-row { grid-template-columns: 1fr; }
    }
  `;
  document.head.append(style);

  document.body.innerHTML = `
    <div class="wrap">
      <header class="topbar">
        <h1 class="brand">${SITE_NAME}</h1>
        <p class="tag">JavaScript-first social game prototype</p>
      </header>

      <main>
        <section class="panel">
          <div class="auth-head">
            <h2>Welcome to ${SITE_NAME}</h2>
            <p>All UI on this page is rendered from app.js.</p>
          </div>

          <div class="route-row" aria-label="Account routes">
            <a id="routeLogin" class="route-btn active" href="#login">Log In</a>
            <a id="routeSignup" class="route-btn" href="#signup">Create Account</a>
            <a id="routeMenu" class="route-btn hidden" href="#menu">Menu</a>
          </div>

          <form id="loginForm" class="auth-form" novalidate>
            <label>Username<input type="text" name="username" required autocomplete="username" /></label>
            <label>Password<input type="password" name="password" required autocomplete="current-password" /></label>
            <div class="button-row">
              <button type="submit" class="btn">Log In</button>
              <button id="openSignupFromLogin" type="button" class="free-account-btn">Create free account</button>
            </div>
          </form>

          <form id="signupForm" class="auth-form hidden" novalidate>
            <label>Name (do not use real name)<input type="text" id="signupUsername" name="username" required minlength="3" autocomplete="username" /></label>
            <label>
              Password
              <div class="password-row">
                <input type="password" id="signupPassword" name="password" minlength="6" required autocomplete="new-password" />
                <button id="toggleSignupPassword" type="button" class="eye-btn" aria-label="Show password">Show</button>
              </div>
              <span id="passwordStrength" class="strength-label">Strength: too weak</span>
              <div class="strength-track" aria-hidden="true"><div id="strengthBar" class="strength-fill"></div></div>
            </label>
            <label>Email<input type="email" name="email" required autocomplete="email" /></label>
            <label><input type="checkbox" id="signupCaptcha" name="captcha" required /> Captcha</label>
            <div class="button-row">
              <button type="submit" class="btn">Sign Up</button>
              <button id="backToLoginFromSignup" type="button" class="free-account-btn">Back to login</button>
            </div>
          </form>

          <p id="authMessage" class="auth-message" role="status" aria-live="polite"></p>

          <section id="accountCard" class="hidden" aria-live="polite">
            <h3>Logged In</h3>
            <p id="accountSummary"></p>
            <img id="accountAvatar" class="hidden" alt="Account profile picture" />
            <button id="logoutBtn" class="free-account-btn" type="button">Log Out</button>
          </section>

          <section id="menuScreen" class="hidden" aria-live="polite">
            <div class="menu-top"><h3>Home</h3><p id="menuWelcome"></p></div>

            <div class="profile-strip">
              <div>
                <p>Signed in as</p>
                <p id="menuHandle">@player</p>
              </div>
              <div><span>Vx </span><strong id="menuCurrency">0</strong></div>
            </div>

            <div class="stats-grid">
              <article class="stat-card"><p>Friends</p><strong id="menuFriends">0</strong></article>
              <article class="stat-card"><p>Groups</p><strong id="menuGroups">0</strong></article>
              <article class="stat-card"><p>Visits</p><strong id="menuVisits">0</strong></article>
            </div>

            <section id="adminPanel" class="admin-panel hidden" aria-live="polite">
              <h4>Admin Panel</h4>
              <div class="admin-grid">
                <article class="stat-card"><p>Accounts</p><strong id="adminTotalAccounts">0</strong></article>
                <article class="stat-card"><p>Banned</p><strong id="adminBannedAccounts">0</strong></article>
                <article class="stat-card"><p>Admins</p><strong id="adminAdminAccounts">0</strong></article>
              </div>
              <div class="admin-controls">
                <label>Select User<select id="adminUserSelect"></select></label>
                <label>Vox Coins<input id="adminCoinsAmount" type="number" min="1" value="100" /></label>
              </div>
              <div class="admin-actions">
                <button id="adminGiveCoinsBtn" class="btn" type="button">Give Vox Coins</button>
                <button id="adminBanToggleBtn" class="free-account-btn" type="button">Ban User</button>
              </div>
              <table class="admin-table">
                <thead><tr><th>User</th><th>Email</th><th>Coins</th><th>Status</th></tr></thead>
                <tbody id="adminUserTableBody"></tbody>
              </table>
            </section>

            <section class="share-panel">
              <h4>Share ${SITE_NAME}</h4>
              <p>Send your hosted link to friends.</p>
              <div class="share-row">
                <input id="shareLinkInput" type="text" readonly />
                <button id="copyShareLinkBtn" class="btn" type="button">Copy Link</button>
                <button id="nativeShareBtn" class="free-account-btn" type="button">Share</button>
              </div>
            </section>
          </section>
        </section>
      </main>

      <footer class="footnote">${SITE_NAME} is in early access.</footer>
    </div>
  `;

  routeLogin = document.getElementById("routeLogin");
  routeSignup = document.getElementById("routeSignup");
  routeMenu = document.getElementById("routeMenu");
  loginForm = document.getElementById("loginForm");
  signupForm = document.getElementById("signupForm");
  authMessage = document.getElementById("authMessage");
  accountCard = document.getElementById("accountCard");
  accountSummary = document.getElementById("accountSummary");
  accountAvatar = document.getElementById("accountAvatar");
  menuScreen = document.getElementById("menuScreen");
  menuWelcome = document.getElementById("menuWelcome");
  menuHandle = document.getElementById("menuHandle");
  menuCurrency = document.getElementById("menuCurrency");
  menuFriends = document.getElementById("menuFriends");
  menuGroups = document.getElementById("menuGroups");
  menuVisits = document.getElementById("menuVisits");
  logoutBtn = document.getElementById("logoutBtn");
  signupPassword = document.getElementById("signupPassword");
  passwordStrength = document.getElementById("passwordStrength");
  strengthBar = document.getElementById("strengthBar");
  toggleSignupPassword = document.getElementById("toggleSignupPassword");
  openSignupFromLogin = document.getElementById("openSignupFromLogin");
  backToLoginFromSignup = document.getElementById("backToLoginFromSignup");
  adminPanel = document.getElementById("adminPanel");
  adminTotalAccounts = document.getElementById("adminTotalAccounts");
  adminBannedAccounts = document.getElementById("adminBannedAccounts");
  adminAdminAccounts = document.getElementById("adminAdminAccounts");
  adminUserSelect = document.getElementById("adminUserSelect");
  adminCoinsAmount = document.getElementById("adminCoinsAmount");
  adminGiveCoinsBtn = document.getElementById("adminGiveCoinsBtn");
  adminBanToggleBtn = document.getElementById("adminBanToggleBtn");
  adminUserTableBody = document.getElementById("adminUserTableBody");
  shareLinkInput = document.getElementById("shareLinkInput");
  copyShareLinkBtn = document.getElementById("copyShareLinkBtn");
  nativeShareBtn = document.getElementById("nativeShareBtn");
}

function normalizeUser(user) {
  const username = String(user?.username || "").trim().toLowerCase();
  const base = Array.from(username).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const coins = Number(user?.voxCoins);
  const role = username === OWNER_USERNAME ? "owner" : ADMIN_USERNAMES.has(username) ? "admin" : "user";

  return {
    ...user,
    username,
    email: String(user?.email || "").trim().toLowerCase(),
    role,
    banned: Boolean(user?.banned),
    voxCoins: Number.isFinite(coins) ? coins : 150 + (base % 850),
  };
}

function isAdmin(user) {
  return Boolean(user && (user.role === "admin" || user.role === "owner"));
}

function getActiveUser() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACTIVE_KEY));
    return stored ? normalizeUser(stored) : null;
  } catch {
    return null;
  }
}

function getUsers() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(parsed)) {
      return [];
    }
    const normalized = parsed.map(normalizeUser);
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      saveUsers(normalized);
    }
    return normalized;
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function setMessage(text, isError = false) {
  authMessage.textContent = text;
  authMessage.classList.toggle("error", isError);
  authMessage.classList.toggle("success", !isError && text.length > 0);
}

function validateSignup(formData) {
  if (!formData.username || formData.username.length < 3) {
    return "Name must be at least 3 characters.";
  }

  if (!formData.password || formData.password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  if (!formData.email || !String(formData.email).includes("@")) {
    return "Please enter a valid email.";
  }

  if (formData.captcha !== "on") {
    return "Please complete the captcha checkbox.";
  }

  return "";
}

function getStrength(password) {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { text: "Strength: too weak", className: "weak", width: "20%" };
  if (score <= 3) return { text: "Strength: medium", className: "medium", width: "62%" };
  return { text: "Strength: strong", className: "strong", width: "100%" };
}

function updateStrengthUi(password) {
  const strength = getStrength(password);
  passwordStrength.textContent = strength.text;
  strengthBar.className = `strength-fill ${strength.className}`;
  strengthBar.style.width = strength.width;
}

function getShareUrl() {
  return `${location.origin}${location.pathname}`;
}

function updateShareUi() {
  if (shareLinkInput) {
    shareLinkInput.value = getShareUrl();
  }

  if (nativeShareBtn) {
    nativeShareBtn.disabled = typeof navigator.share !== "function";
  }
}

function showLoggedIn(user) {
  const currentUser = normalizeUser(user);
  accountCard.classList.remove("hidden");
  menuScreen.classList.remove("hidden");
  routeMenu.classList.remove("hidden");
  accountSummary.textContent = `${currentUser.username} (${currentUser.email}) • ${currentUser.role}.`;
  menuWelcome.textContent = `Welcome back, ${currentUser.username}.`;

  const base = Array.from(currentUser.username || "").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  if (menuHandle) menuHandle.textContent = `@${currentUser.username}`;
  if (menuCurrency) menuCurrency.textContent = String(currentUser.voxCoins || 0);
  if (menuFriends) menuFriends.textContent = String(3 + (base % 25));
  if (menuGroups) menuGroups.textContent = String(1 + (base % 7));
  if (menuVisits) menuVisits.textContent = String(250 + (base % 7000));
  accountAvatar.src = "";
  accountAvatar.classList.add("hidden");
  renderAdminPanel(currentUser);
}

function setActiveUser(user) {
  const normalized = normalizeUser(user);
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(normalized));
  showLoggedIn(normalized);
  location.hash = "#menu";
}

function clearActiveUser() {
  localStorage.removeItem(ACTIVE_KEY);
  accountCard.classList.add("hidden");
  menuScreen.classList.add("hidden");
  routeMenu.classList.add("hidden");
  accountSummary.textContent = "";
  menuWelcome.textContent = "";
  if (menuHandle) menuHandle.textContent = "@player";
  if (menuCurrency) menuCurrency.textContent = "0";
  if (menuFriends) menuFriends.textContent = "0";
  if (menuGroups) menuGroups.textContent = "0";
  if (menuVisits) menuVisits.textContent = "0";
  accountAvatar.src = "";
  accountAvatar.classList.add("hidden");
  if (adminPanel) adminPanel.classList.add("hidden");
  updateShareUi();
}

function selectedManageUser(users) {
  if (!adminUserSelect) return null;
  const selected = String(adminUserSelect.value || "").toLowerCase();
  return users.find((user) => user.username === selected) || null;
}

function renderAdminPanel(activeUser) {
  if (!adminPanel) return;
  const canManage = isAdmin(activeUser);
  adminPanel.classList.toggle("hidden", !canManage);
  if (!canManage) return;

  const users = getUsers();
  const manageable = users.filter((user) => !isAdmin(user));
  const selectedBefore = adminUserSelect ? String(adminUserSelect.value || "") : "";

  if (adminTotalAccounts) adminTotalAccounts.textContent = String(users.length);
  if (adminBannedAccounts) adminBannedAccounts.textContent = String(users.filter((user) => user.banned).length);
  if (adminAdminAccounts) adminAdminAccounts.textContent = String(users.filter((user) => isAdmin(user)).length);

  if (adminUserSelect) {
    adminUserSelect.innerHTML = "";
    manageable.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.username;
      option.textContent = `@${user.username}`;
      adminUserSelect.append(option);
    });

    if (manageable.length > 0) {
      const hasPrevious = manageable.some((user) => user.username === selectedBefore);
      adminUserSelect.value = hasPrevious ? selectedBefore : manageable[0].username;
    }
  }

  const selectedUser = selectedManageUser(manageable);
  if (adminBanToggleBtn) {
    adminBanToggleBtn.textContent = selectedUser?.banned ? "Unban User" : "Ban User";
    adminBanToggleBtn.disabled = manageable.length === 0;
  }
  if (adminGiveCoinsBtn) {
    adminGiveCoinsBtn.disabled = manageable.length === 0;
  }

  if (adminUserTableBody) {
    adminUserTableBody.innerHTML = "";
    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>@${user.username}</td><td>${user.email || "-"}</td><td>${user.voxCoins}</td><td>${user.banned ? "Banned" : "Active"}</td>`;
      adminUserTableBody.append(row);
    });
  }
}

function switchRoute(route) {
  const activeUser = getActiveUser();
  let safeRoute = route;

  if (activeUser) {
    safeRoute = "menu";
  } else if (route === "menu") {
    safeRoute = "login";
  } else if (route === "signup" && !signupRouteUnlocked) {
    safeRoute = "login";
  }

  const loginActive = safeRoute === "login";
  const signupActive = safeRoute === "signup";
  const menuActive = safeRoute === "menu";

  routeLogin.classList.toggle("active", loginActive);
  routeSignup.classList.toggle("active", signupActive);
  routeMenu.classList.toggle("active", menuActive);

  loginForm.classList.toggle("hidden", !loginActive);
  signupForm.classList.toggle("hidden", !signupActive);
  accountCard.classList.toggle("hidden", !menuActive || !activeUser);
  menuScreen.classList.toggle("hidden", !menuActive || !activeUser);

  if (safeRoute !== route) {
    location.hash = `#${safeRoute}`;
  }

  if (safeRoute !== "signup") {
    signupRouteUnlocked = false;
  }

  setMessage("");
}

function attachEventHandlers() {
  signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = Object.fromEntries(new FormData(signupForm).entries());
  formData.username = String(formData.username || "").trim().toLowerCase();
  formData.email = String(formData.email || "").trim().toLowerCase();

  const validationError = validateSignup(formData);
  if (validationError) {
    setMessage(validationError, true);
    return;
  }

  const users = getUsers();
  const usernameTaken = users.some((user) => user.username === formData.username);
  if (usernameTaken) {
    setMessage("That username is already taken.", true);
    return;
  }

  const user = {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    voxCoins: 150,
    banned: false,
  };

  users.push(user);
  saveUsers(users);
  setActiveUser(user);
  setMessage("Account created successfully.");
  signupForm.reset();
  updateStrengthUi("");
  });

  loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(loginForm).entries());
  const username = String(formData.username || "").trim().toLowerCase();
  const password = String(formData.password || "");

  const users = getUsers();
  const foundUser = users.find((user) => user.username === username && user.password === password);

  if (!foundUser) {
    setMessage("Invalid username or password.", true);
    return;
  }

  if (foundUser.banned) {
    setMessage("This account is banned.", true);
    return;
  }

  setActiveUser(foundUser);
  setMessage(`Welcome back, ${foundUser.username}.`);
  loginForm.reset();
  });

  logoutBtn.addEventListener("click", () => {
  clearActiveUser();
  location.hash = "#login";
  setMessage("You have been logged out.");
  });

  signupPassword.addEventListener("input", () => {
    updateStrengthUi(signupPassword.value);
  });

  if (toggleSignupPassword) {
    toggleSignupPassword.addEventListener("click", () => {
      const isPassword = signupPassword.type === "password";
      signupPassword.type = isPassword ? "text" : "password";
      toggleSignupPassword.textContent = isPassword ? "Hide" : "Show";
      toggleSignupPassword.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
  }

  if (openSignupFromLogin) {
    openSignupFromLogin.addEventListener("click", () => {
      signupRouteUnlocked = true;
      location.hash = "#signup";
    });
  }

  if (backToLoginFromSignup) {
    backToLoginFromSignup.addEventListener("click", () => {
      signupRouteUnlocked = false;
      location.hash = "#login";
    });
  }

  if (adminUserSelect) {
    adminUserSelect.addEventListener("change", () => {
      const activeUser = getActiveUser();
      if (!activeUser) return;
      renderAdminPanel(activeUser);
    });
  }

  if (adminGiveCoinsBtn) {
    adminGiveCoinsBtn.addEventListener("click", () => {
    const activeUser = getActiveUser();
    if (!isAdmin(activeUser)) return;

    const users = getUsers();
    const selectedUser = selectedManageUser(users.filter((user) => !isAdmin(user)));
    const amount = Number(adminCoinsAmount?.value || 0);

    if (!selectedUser) {
      setMessage("No user selected to receive coins.", true);
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Enter a valid coin amount.", true);
      return;
    }

    const target = users.find((user) => user.username === selectedUser.username);
    if (!target) return;

    target.voxCoins += Math.floor(amount);
    saveUsers(users);
    setMessage(`Added ${Math.floor(amount)} Vox coins to @${target.username}.`);
    renderAdminPanel(activeUser);
    });
  }

  if (adminBanToggleBtn) {
    adminBanToggleBtn.addEventListener("click", () => {
    const activeUser = getActiveUser();
    if (!isAdmin(activeUser)) return;

    const users = getUsers();
    const selectedUser = selectedManageUser(users.filter((user) => !isAdmin(user)));
    if (!selectedUser) {
      setMessage("No user selected for moderation.", true);
      return;
    }

    const target = users.find((user) => user.username === selectedUser.username);
    if (!target) return;

    target.banned = !target.banned;
    saveUsers(users);
    setMessage(target.banned ? `@${target.username} has been banned.` : `@${target.username} has been unbanned.`);
    renderAdminPanel(activeUser);
    });
  }

  if (copyShareLinkBtn) {
    copyShareLinkBtn.addEventListener("click", async () => {
    const shareUrl = getShareUrl();

    try {
      await navigator.clipboard.writeText(shareUrl);
      if (shareLinkInput) {
        shareLinkInput.value = shareUrl;
        shareLinkInput.select();
      }
      setMessage("Share link copied.");
    } catch {
      setMessage("Could not copy the link automatically.", true);
    }
    });
  }

  if (nativeShareBtn) {
    nativeShareBtn.addEventListener("click", async () => {
    if (typeof navigator.share !== "function") {
      setMessage("Sharing is not supported in this browser.", true);
      return;
    }

    try {
      await navigator.share({
        title: SITE_NAME,
        text: `Join me on ${SITE_NAME}`,
        url: getShareUrl(),
      });
      setMessage("Share menu opened.");
    } catch (error) {
      if (error && error.name === "AbortError") {
        return;
      }
      setMessage("Could not open the share menu.", true);
    }
    });
  }

  [routeLogin, routeSignup, routeMenu].forEach((routeBtn) => {
    if (!routeBtn) return;
    routeBtn.addEventListener("click", (event) => {
      event.preventDefault();
      if (getActiveUser()) {
        setMessage("Use Log Out to leave the menu.", true);
        location.hash = "#menu";
        return;
      }
      setMessage("Use the form buttons to move between login and create account.", true);
      location.hash = "#login";
    });
  });
}

function routeFromHash() {
  if (location.hash === "#signup") return "signup";
  if (location.hash === "#menu") return "menu";
  return "login";
}

window.addEventListener("hashchange", () => {
  switchRoute(routeFromHash());
});

(function initialize() {
  bootAppShell();
  attachEventHandlers();

  if (!localStorage.getItem(RESET_ONCE_KEY)) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_KEY);
    localStorage.setItem(RESET_ONCE_KEY, "1");
  }

  updateStrengthUi("");
  updateShareUi();

  const activeUser = getActiveUser();
  if (activeUser && activeUser.username) {
    const users = getUsers();
    const latest = users.find((user) => user.username === activeUser.username);
    if (!latest || latest.banned) {
      clearActiveUser();
      location.hash = "#login";
      switchRoute("login");
      setMessage("Your session ended. Please log in again.", true);
      return;
    }

    showLoggedIn(latest);
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(latest));
    location.hash = "#menu";
    switchRoute("menu");
    setMessage(`Still logged in as ${activeUser.username}.`);
    return;
  }

  location.hash = "#login";
  switchRoute("login");
})();
