let currentUser = null;

/**
 * Wyświetla komunikat w obszarze #message.
 * @param {string} text Treść komunikatu.
 * @param {string} type Typ komunikatu ('info', 'success', 'error').
 */
function showMessage(text, type = "info") {
  const messageDiv = document.getElementById("message");
  messageDiv.innerText = text;
  messageDiv.className = type;
  setTimeout(() => {
    messageDiv.innerText = "";
    messageDiv.className = "";
  }, 5000);
}

/**
 * Wyświetla powiadomienie w obszarze #notification.
 * @param {string} text Treść powiadomienia.
 */
function showNotification(text) {
  const notifDiv = document.getElementById("notification");
  notifDiv.innerText = text;
  setTimeout(() => {
    notifDiv.innerText = "";
  }, 5000);
}

/**
 * Aktualizuje widoczność pozycji w menu oraz informację o zalogowanym użytkowniku.
 */
function renderNav() {
  if (currentUser) {
    document.getElementById("nav-profile").style.display = "inline";
    document.getElementById("nav-cars").style.display = "inline";
    document.getElementById("nav-buy").style.display = "inline";
    document.getElementById("nav-logout").style.display = "inline";
    if (currentUser.role === "admin") {
      document.getElementById("nav-users").style.display = "inline";
    }
    document.getElementById("nav-login").style.display = "none";
    document.getElementById("nav-register").style.display = "none";

    document.getElementById(
      "user-info"
    ).innerText = `Zalogowany jako: ${currentUser.username} | Rola: ${currentUser.role} | Saldo: ${currentUser.balance}`;
  } else {
    document.getElementById("nav-profile").style.display = "none";
    document.getElementById("nav-cars").style.display = "none";
    document.getElementById("nav-buy").style.display = "none";
    document.getElementById("nav-users").style.display = "none";
    document.getElementById("nav-logout").style.display = "none";
    document.getElementById("nav-login").style.display = "inline";
    document.getElementById("nav-register").style.display = "inline";

    document.getElementById("user-info").innerText = "Nie jesteś zalogowany";
  }
}

/**
 * Sprawdza, czy użytkownik jest zalogowany poprzez wywołanie endpointu /users.
 * Dla zwykłych userów zwracany jest obiekt, a dla admina (ze względu na uprawnienia)
 * – tablica wszystkich użytkowników. W tym przypadku wybieramy obiekt admina.
 */
async function checkAuth() {
  try {
    const res = await fetch("http://localhost:3000/me", {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 200) {
      const data = await res.json();
      currentUser = data;
    } else {
      currentUser = null;
    }
  } catch (err) {
    currentUser = null;
  }
  renderNav();
}

/**
 * Pokazuje wskazany widok (sekcję) i ukrywa pozostałe.
 * @param {string} viewId ID widoku do pokazania.
 */
function showView(viewId) {
  const views = document.querySelectorAll(".view");
  views.forEach((view) => {
    view.style.display = "none";
  });
  const activeView = document.getElementById(viewId);
  if (activeView) {
    activeView.style.display = "block";
  }
}

/**
 * Ładuje dane profilu aktualnie zalogowanego użytkownika.
 */
async function loadProfile(id) {
  if (id) {
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`);
      if (res.status === 200) {
        const data = await res.json();
        const profile = data;

        if (profile) {
          document.getElementById(
            "profile-info"
          ).innerText = `Username: ${profile.username}\nSaldo: ${profile.balance}`;
        }
      }
    } catch (err) {
      showMessage("Błąd przy pobieraniu profilu", "error");
    }
  }
}

/**
 * Ładuje listę samochodów i wyświetla je w sekcji #cars-list.
 */
async function loadCars() {
  try {
    const res = await fetch("http://localhost:3000/cars");
    if (res.status === 200) {
      const cars = await res.json();
      let html = "";
      if (cars.length === 0) {
        html = "Brak samochodów.";
      } else {
        cars.forEach((car) => {
          html += `<div class="car-item">
                     <strong>ID:</strong> ${car.id} |
                     <strong>Model:</strong> ${car.model} |
                     <strong>Cena:</strong> ${car.price} |
                     <strong>Właściciel:</strong> ${car.ownerId}
                   </div>`;
        });
      }
      document.getElementById("cars-list").innerHTML = html;
    }
  } catch (err) {
    showMessage("Błąd przy pobieraniu samochodów", "error");
  }
}

async function loadUsers() {
  try {
    const res = await fetch("http://localhost:3000/users");
    if (res.status === 200) {
      const users = await res.json();
      let html = "";
      if (users.length === 0) {
        html = "Brak uzytkownikow.";
      } else {
        users.forEach((user) => {
          html += `<div class="car-item">
                     <strong>ID:</strong> ${user.id} |
                     <strong>Username:</strong> ${user.username} |
                       <strong>Rola:</strong> ${user.role} |
                     <strong>Hasło:</strong> ${user.password} |
                     <strong>Saldo:</strong> ${user.balance}
                   </div>`;
        });
      }
      document.getElementById("users-list").innerHTML = html;
    }
  } catch (err) {
    showMessage("Błąd przy pobieraniu uzytkownikow", "error");
  }
}

/**
 * Ustawia wszystkie nasłuchiwacze zdarzeń dla formularzy oraz routingu.
 */
function setupEventListeners() {
  // Routing – zmiana widoku po zmianie fragmentu URL
  window.addEventListener("hashchange", route);
  route(); // inicjalizacja

  // Formularz logowania
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      console.log(data.user);
      if (res.status === 200) {
        showMessage("Zalogowano pomyślnie", "success");
        await checkAuth(data.user.id, data.user.role);
        window.location.hash = "#home";
      } else {
        showMessage(data.error || "Błąd logowania", "error");
      }
    });
  }

  // Formularz rejestracji
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("regUsername").value;
      const password = document.getElementById("regPassword").value;
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.status === 201) {
        showMessage(
          "Rejestracja powiodła się, możesz się zalogować",
          "success"
        );
        window.location.hash = "#login";
      } else {
        showMessage(data.error || "Błąd rejestracji", "error");
      }
    });
  }

  // Formularz aktualizacji profilu
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newUsername = document.getElementById("newUsername").value;
      const newPassword = document.getElementById("newPassword").value;
      const userId = currentUser.id;
      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });
      const data = await res.json();
      if (res.status === 200) {
        showMessage("Profil zaktualizowany", "success");
        await checkAuth();
        loadProfile(userId);
      } else {
        showMessage(data.error || "Błąd aktualizacji profilu", "error");
      }
    });
  }

  // Formularz dodawania samochodu
  const addCarForm = document.getElementById("addCarForm");
  if (addCarForm) {
    addCarForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const model = document.getElementById("carModel").value;
      const price = parseFloat(document.getElementById("carPrice").value);
      const userId = currentUser.id;
      console.log(userId);
      const res = await fetch("http://localhost:3000/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, price, ownerId: userId }),
      });
      const data = await res.json();
      if (res.status === 201) {
        showMessage("Samochód dodany", "success");
        loadCars();
      } else {
        showMessage(data.error || "Błąd dodawania samochodu", "error");
      }
    });
  }

  // Formularz zakupu samochodu
  const buyCarForm = document.getElementById("buyCarForm");
  if (buyCarForm) {
    buyCarForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const carId = document.getElementById("buyCarId").value;
      const userId = currentUser.id;

      const res = await fetch(`http://localhost:3000/cars/${carId}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ buyerId: userId }),
      });
      const data = await res.json();
      if (res.status === 200) {
        showMessage("Samochód zakupiony", "success");
        loadCars();
        await checkAuth(); // aktualizacja salda
      } else {
        showMessage(data.error || "Błąd zakupu samochodu", "error");
      }
    });
  }

  const addNewUserForm = document.getElementById("addNewUserForm");
  if (addNewUserForm) {
    addNewUserForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (currentUser.role === "user") {
        showMessage("Nie masz uprawnień do dodawania uytkowników", "error");
        return;
      }

      const res = await fetch(`http://localhost:3000/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.status === 201) {
        showMessage("Uzytkownik dodany", "success");
        loadUsers();
        await checkAuth();
        window.location.hash = "#users";
      } else {
        showMessage(data.error || "Błąd dodania uzytkownika", "error");
      }
    });
  }

  const editUserForm = document.getElementById("editUserForm");
  if (editUserForm) {
    editUserForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userId = document.getElementById("userId").value;
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const role = document.querySelector(
        'input[name="editRole"]:checked'
      ).value;
      const balance = document.getElementById("balance").value;

      if (currentUser.role === "user") {
        showMessage("Nie masz uprawnień do edytowania uytkowników", "error");
        return;
      }

      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password, role, balance }),
      });
      const data = await res.json();
      if (res.status === 200) {
        showMessage("Uzytkownik zedytowany", "success");
        loadUsers();
        await checkAuth();
      } else {
        showMessage(data.error || "Błąd edycji uzytkownika", "error");
      }
    });
  }

  const deleteUserForm = document.getElementById("deleteUserForm");
  if (deleteUserForm) {
    deleteUserForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userId = document.getElementById("deleteUserId").value;

      if (currentUser.role === "user") {
        showMessage("Nie masz uprawnień do usuwania uytkowników", "error");
        return;
      }

      if (currentUser.role === "admin" && currentUser.id === userId) {
        showMessage("Nie możesz usunąć samego siebie", "error");
        return;
      }

      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.status === 200) {
        showMessage("Uzytkownik usunięty", "success");
        loadUsers();
        await checkAuth();
      } else {
        showMessage(data.error || "Błąd usuwania uzytkownika", "error");
      }
    });
  }
}

async function logout() {
  try {
    const res = await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });
    if (res.status === 200) {
      currentUser = null;
      renderNav();
      showMessage("Wylogowano pomyślnie", "success");
      window.location.hash = "#home";
    } else {
      showMessage("Błąd przy wylogowywaniu", "error");
    }
  } catch (err) {
    showMessage("Błąd przy wylogowywaniu", "error");
  }
}

/**
 * Prosty router – na podstawie fragmentu adresu URL (hash) wyświetla odpowiedni widok.
 * Specjalnie obsługujemy #logout, aby "wylogować" użytkownika (symulacja).
 */

async function hackFound() {
  try {
    const res = await fetch("http://localhost:3000/hack/fund/10000", {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ id: currentUser.id }),
    });
    if (res.status === 200) {
      renderNav();
      showMessage("Saldo zautalizowane", "success");
    } else {
      showMessage("Błąd przy aktualizacji salda", "error");
    }
  } catch (err) {
    showMessage("Błąd przy aktualizacji salda", "error");
  }
}

function route() {
  const hash = window.location.hash || "#home";
  const viewId = hash.substring(1) + "-view";

  if (hash === "#logout") {
    logout();
  }

  if (hash === "#hack/fund/10000") {
    if (currentUser) {
      hackFound();
      loadProfile(currentUser.id);
      return;
    }
    window.location.hash = "#home";
  }

  showView(viewId);
  if (viewId === "profile-view") {
    if (currentUser) {
      loadProfile(currentUser.id);
      return;
    }

    renderNav();
    showMessage("Musisz być zalogowany, aby zobaczyć profil", "error");
    window.location.hash = "#home";
    return;
  }

  if (viewId === "cars-view") {
    if (currentUser) {
      loadCars();
      return;
    }
    renderNav();
    showMessage("Musisz być zalogowany, aby zobaczyć samochody", "error");
    window.location.hash = "#home";
    return;
  }

  if (viewId === "users-view") {
    if (currentUser) {
      if (currentUser.role === "admin") {
        loadUsers();
        return;
      }
      renderNav();
      showMessage("Nie masz wymaganych uprawnień", "error");
      window.location.hash = "#home";
      return;
    }
    renderNav();
    showMessage("Musisz być zalogowany", "error");
    window.location.hash = "#home";
    return;
  }
}

/**
 * Ustawia nasłuchiwanie Server-Sent Events, które wyświetlają powiadomienia o zdarzeniach (np. zakupie samochodu).
 */
function setupSSE() {
  const evtSource = new EventSource("/events");
  evtSource.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    showNotification(
      `SSE: ${msg.event} - Car ID: ${msg.carId}, Buyer ID: ${msg.buyerId}`
    );
  };
}

window.addEventListener("load", async () => {
  await checkAuth();
  setupEventListeners();
  setupSSE();
});
