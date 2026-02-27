// Protect internal pages
const protectedPages = ["dashboard.html", "products.html", "reports.html", "settings.html"];

const currentPage = window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage)) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
        window.location.href = "login.html";
    }
}



// REGISTER FUNCTION
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const message = document.getElementById("registerMessage");

        message.className = "";
        message.textContent = "";
        

        // Validation
        if (!fullName || !email || !password || !confirmPassword) {
            showMessage(message, "All fields are required", "error");
            return;
        }

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!emailPattern.test(email)) {
            showMessage(message, "Invalid email format", "error");
            return;
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordPattern.test(password)) {
            showMessage(message,
                "Password must be 8+ chars with uppercase, lowercase & number",
                "error"
            );
            return;
        }

        if (password !== confirmPassword) {
            showMessage(message, "Passwords do not match", "error");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const emailExists = users.some(user => user.email === email);
        if (emailExists) {
            showMessage(message, "Email already registered", "error");
            return;
        }

        const newUser = {
            id: Date.now(),
            fullName,
            email,
            password
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        showMessage(message, "Registration successful! Redirecting...", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    });
}

// MESSAGE FUNCTION
function showMessage(element, msg, type) {
    element.textContent = msg;
    element.classList.add(type);
}
// LOGIN FUNCTION
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        message.className = "";
        message.textContent = "";

        if (!email || !password) {
            showMessage(message, "All fields are required", "error");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(u => u.email === email);

        if (!user) {
            showMessage(message, "Email not registered", "error");
            return;
        }

        if (user.password !== password) {
            showMessage(message, "Incorrect password", "error");
            return;
        }

        // Save login state
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        showMessage(message, "Login successful! Redirecting...", "success");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1200);
    });
}
// DASHBOARD PROTECTION
if (window.location.pathname.includes("dashboard.html")) {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        window.location.href = "login.html";
    }
}
// LOAD USER NAME
if (window.location.pathname.includes("dashboard.html")) {

    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user) {
        document.getElementById("userName").textContent =
            "Welcome, " + user.fullName;
    }
}

// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });
}

// SIDEBAR TOGGLE
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle) {
    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("active");
    });
}
     const productTable = document.getElementById("productTable");
const searchInput = document.getElementById("searchInput");

if (productTable) {
    loadProducts();

    document.getElementById("productForm")
        .addEventListener("submit", function (e) {

        e.preventDefault();

        const name = productName.value.trim();
        const category = productCategory.value.trim();
        const quantity = parseInt(productQuantity.value);
        const price = parseFloat(productPrice.value);
        const message = document.getElementById("productMessage");

        if (!name || !category || isNaN(quantity) || isNaN(price)) {
            message.textContent = "All fields required!";
            message.className = "error";
            return;
        }

        if (quantity < 0) {
            message.textContent = "Quantity cannot be negative";
            message.className = "error";
            return;
        }

        let products = getProducts();

        const newProduct = {
            id: Date.now(),
            name,
            category,
            quantity,
            price
        };

        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));

        productForm.reset();
        loadProducts();
    });
}

function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
}

function loadProducts(filter = "") {

    const products = getProducts().filter(p =>
        p.name.toLowerCase().includes(filter.toLowerCase())
    );

    productTable.innerHTML = "";

    if (products.length === 0) {
        emptyState.classList.remove("d-none");
    } else {
        emptyState.classList.add("d-none");
    }

    products.forEach(product => {

        const status = product.quantity > 0
            ? `<span class="badge bg-success badge-stock">In Stock</span>`
            : `<span class="badge bg-danger badge-stock">Out of Stock</span>`;

        productTable.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.quantity}</td>
                <td>$${product.price}</td>
                <td>${status}</td>
                <td>
                    <button class="action-btn action-edit"
                        onclick="editProduct(${product.id})">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="action-btn action-delete"
                        onclick="deleteProduct(${product.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    updateCards();
}

function updateCards() {
    const products = getProducts();

    totalProducts.textContent = products.length;
    inStock.textContent =
        products.filter(p => p.quantity > 0).length;

    outStock.textContent =
        products.filter(p => p.quantity <= 0).length;
}

function deleteProduct(id) {

    if (!confirm("Delete this product?")) return;

    let products = getProducts();

    products = products.filter(p => p.id !== id);

    localStorage.setItem("products", JSON.stringify(products));

    loadProducts();
}

function editProduct(id) {

    let products = getProducts();
    const product = products.find(p => p.id === id);

    productName.value = product.name;
    productCategory.value = product.category;
    productQuantity.value = product.quantity;
    productPrice.value = product.price;

    deleteProduct(id);
}

if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        loadProducts(this.value);
    });
}


    // Update Cards
    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("inStock").textContent =
        products.filter(p => p.quantity > 0).length;

    document.getElementById("outStock").textContent =
        products.filter(p => p.quantity <= 0).length;

        let stockChart;

function updateCards() {
    const products = getProducts();

    totalProducts.textContent = products.length;
    inStock.textContent =
        products.filter(p => p.quantity > 0).length;

    outStock.textContent =
        products.filter(p => p.quantity <= 0).length;

    updateChart();
    updateLowStock();
}

function updateChart() {

    const products = getProducts();
    const inStockCount = products.filter(p => p.quantity > 0).length;
    const outStockCount = products.filter(p => p.quantity <= 0).length;

    const ctx = document.getElementById("stockChart");

    if (!ctx) return;

    if (stockChart) stockChart.destroy();

    stockChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["In Stock", "Out of Stock"],
            datasets: [{
                data: [inStockCount, outStockCount],
                backgroundColor: ["#198754", "#dc3545"]
            }]
        }
    });
}

function updateLowStock() {

    const list = document.getElementById("lowStockList");
    if (!list) return;

    const lowStock = getProducts().filter(p => p.quantity > 0 && p.quantity <= 5);

    list.innerHTML = "";

    if (lowStock.length === 0) {
        list.innerHTML = `<li class="list-group-item">No low stock products</li>`;
        return;
    }

    lowStock.forEach(product => {
        list.innerHTML += `
            <li class="list-group-item list-group-item-low">
                ${product.name} (Qty: ${product.quantity})
            </li>
        `;
    });
}

function exportPDF() {

    const products = getProducts();

    let content = `
        SIMS – Stock Inventory Report
        =======================================
    `;

    products.forEach(p => {
        content += `
        ID: ${p.id}
        Name: ${p.name}
        Category: ${p.category}
        Quantity: ${p.quantity}
        Price: $${p.price}
        -------------------------------
        `;
    });

    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "SIMS_Report.pdf";
    a.click();
}
// MENU SECTION SWITCHING
document.querySelectorAll(".menu-link").forEach(link => {

    link.addEventListener("click", function () {

        const sectionId = this.getAttribute("data-section");

        document.querySelectorAll(".content-section")
            .forEach(sec => sec.classList.add("d-none"));

        document.getElementById(sectionId)
            .classList.remove("d-none");
    });
});
document.querySelectorAll(".menu-link").forEach(link => {

    link.addEventListener("click", function () {

        const sectionId = this.getAttribute("data-section");

        // Hide all sections
        document.querySelectorAll(".content-section")
            .forEach(sec => sec.classList.add("d-none"));

        // Show selected section
        document.getElementById(sectionId)
            .classList.remove("d-none");

        // 🔥 LOAD DATA DEPENDING ON SECTION
        if (sectionId === "productsSection") {
            loadProducts();
        }

        if (sectionId === "reportsSection") {
            updateRevenueChart();
            updateLowStock();
        }

        if (sectionId === "settingsSection") {
            loadSettings();
        }

        if (sectionId === "dashboardSection") {
            updateCards();
        }
    });
});
function loadSettings() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return;

    const updateNameInput = document.getElementById("updateName");
    if (updateNameInput) {
        updateNameInput.value = user.fullName;
    }
}
localStorage.getItem("products")
localStorage.getItem("products")
null
document.addEventListener("DOMContentLoaded", function () {
    loadProducts();
    updateCards();
});
loadProducts()
updateCards()
