document.addEventListener("DOMContentLoaded", () => {

    // STORAGE SETUP
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify([]));
    }

    if (!localStorage.getItem("products")) {
        localStorage.setItem("products", JSON.stringify([]));
    }

    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // ================= REGISTER =================
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const fullname = document.getElementById("fullname").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const message = document.getElementById("registerMessage");

            const users = JSON.parse(localStorage.getItem("users"));

            const emailExists = users.some(user => user.email === email);

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            if (!fullname || !email || !password || !confirmPassword) {
                message.textContent = "All fields are required.";
                return;
            }

            if (!passwordRegex.test(password)) {
                message.textContent = "Password must be 8+ chars, include uppercase, lowercase, number.";
                return;
            }

            if (password !== confirmPassword) {
                message.textContent = "Passwords do not match.";
                return;
            }

            if (emailExists) {
                message.textContent = "Email already registered.";
                return;
            }

            users.push({ fullname, email, password });
            localStorage.setItem("users", JSON.stringify(users));

            message.textContent = "Registration successful!";
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        });
    }

    // ================= LOGIN =================
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;
            const message = document.getElementById("loginMessage");

            const users = JSON.parse(localStorage.getItem("users"));
            const user = users.find(user => user.email === email && user.password === password);

            if (!user) {
                message.textContent = "Invalid email or password.";
                return;
            }

            localStorage.setItem("loggedInUser", JSON.stringify(user));
            window.location.href = "dashboard.html";
        });
    }

    // ================= DASHBOARD =================
    if (window.location.pathname.includes("dashboard.html")) {

        if (!currentUser) {
            window.location.href = "index.html";
        }

        document.getElementById("userName").textContent = currentUser.fullname;

        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            window.location.href = "index.html";
        });

        const productTable = document.getElementById("productTable");
        const emptyState = document.getElementById("emptyState");

        function loadProducts() {
            const products = JSON.parse(localStorage.getItem("products"));
            productTable.innerHTML = "";

            if (products.length === 0) {
                emptyState.style.display = "block";
                return;
            }

            emptyState.style.display = "none";

            let inStock = 0;
            let outStock = 0;

            products.forEach((product, index) => {
                const status = product.quantity > 0 ? "In Stock" : "Out of Stock";
                if (product.quantity > 0) inStock++; else outStock++;

                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${product.quantity}</td>
                        <td>$${product.price}</td>
                        <td>${status}</td>
                    </tr>
                `;
                productTable.innerHTML += row;
            });

            document.getElementById("totalProducts").textContent = products.length;
            document.getElementById("inStock").textContent = inStock;
            document.getElementById("outStock").textContent = outStock;
        }

        loadProducts();

        const modal = document.getElementById("productModal");
        document.getElementById("addProductBtn").onclick = () => modal.style.display = "flex";
        document.getElementById("closeModal").onclick = () => modal.style.display = "none";

        document.getElementById("productForm").addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("productName").value.trim();
            const category = document.getElementById("productCategory").value.trim();
            const quantity = parseInt(document.getElementById("productQuantity").value);
            const price = parseFloat(document.getElementById("productPrice").value);

            if (!name || !category || quantity < 0 || isNaN(quantity) || isNaN(price)) {
                return alert("Invalid product details.");
            }

            const products = JSON.parse(localStorage.getItem("products"));
            products.push({ name, category, quantity, price });
            localStorage.setItem("products", JSON.stringify(products));

            modal.style.display = "none";
            loadProducts();
        });
    }

});

if (window.location.pathname.includes("dashboard.html")) {
}
    // ================= NAVIGATION =================

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".page-section");

navItems.forEach(item => {
    item.addEventListener("click", () => {

        // Remove active class
        navItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");

        // Hide all sections
        sections.forEach(section => section.classList.add("hidden"));

        // Show selected
        document.getElementById(item.dataset.section).classList.remove("hidden");
    });
});
let totalValue = 0;
let lowStock = 0;

products.forEach(product => {
    totalValue += product.price * product.quantity;
    if (product.quantity <= 5 && product.quantity > 0) {
        lowStock++;
    }
});

document.getElementById("totalValue").textContent = "$" + totalValue.toFixed(2);
document.getElementById("lowStock").textContent = lowStock;

document.getElementById("userName").textContent = currentUser.fullname;
document.getElementById("settingsName").textContent = currentUser.fullname;
document.getElementById("settingsEmail").textContent = currentUser.email;
document.getElementById("toggleThemeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

productTable.innerHTML = "";

products.forEach((product, index) => {

    const status = product.quantity > 0 ? "In Stock" : "Out of Stock";

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.quantity}</td>
        <td>$${product.price}</td>
        <td>${status}</td>
        <td>
            <button class="action-btn edit-btn" onclick="editProduct(${index})">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteProduct(${index})">Delete</button>
        </td>
    `;

    productTable.appendChild(row);
});

window.deleteProduct = function(index) {
    const products = JSON.parse(localStorage.getItem("products"));

    if (!confirm("Are you sure you want to delete this product?")) return;

    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));

    loadProducts();
};

window.editProduct = function(index) {
    const products = JSON.parse(localStorage.getItem("products"));
    const product = products[index];

    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productQuantity").value = product.quantity;
    document.getElementById("productPrice").value = product.price;

    const modal = document.getElementById("productModal");
    modal.style.display = "flex";

    document.getElementById("productForm").onsubmit = function(e) {
        e.preventDefault();

        product.name = document.getElementById("productName").value.trim();
        product.category = document.getElementById("productCategory").value.trim();
        product.quantity = parseInt(document.getElementById("productQuantity").value);
        product.price = parseFloat(document.getElementById("productPrice").value);

        products[index] = product;
        localStorage.setItem("products", JSON.stringify(products));

        modal.style.display = "none";

        loadProducts();
    };
};

document.getElementById("searchInput").addEventListener("input", function() {

    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll("#productTable tr");

    rows.forEach(row => {
        const name = row.children[1].textContent.toLowerCase();
        row.style.display = name.includes(searchValue) ? "" : "none";
    });
});

const categories = [...new Set(products.map(p => p.category))];
const categoryFilter = document.getElementById("categoryFilter");

categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

categories.forEach(cat => {
    categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
});

document.getElementById("categoryFilter").addEventListener("change", function() {

    const value = this.value;
    const rows = document.querySelectorAll("#productTable tr");

    rows.forEach(row => {
        const category = row.children[2].textContent;
        row.style.display = (value === "all" || category === value) ? "" : "none";
    });
});

document.getElementById("toggleSidebar").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("collapsed");
});

let chart;

function loadChart(inStock, outStock) {
    const ctx = document.getElementById("stockChart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["In Stock", "Out of Stock"],
            datasets: [{
                data: [inStock, outStock],
                backgroundColor: ["#2c7be5", "#dc3545"]
            }]
        }
    });
}
 loadChart(inStock, outStock);

document.getElementById("exportCSV").addEventListener("click", () => {

    const products = JSON.parse(localStorage.getItem("products"));

    let csv = "Name,Category,Quantity,Price\n";

    products.forEach(p => {
        csv += `${p.name},${p.category},${p.quantity},${p.price}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
});

let currentPage = 1;
const rowsPerPage = 5;

function paginate(products) {

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return products.slice(start, end);
}
const totalPages = Math.ceil(products.length / rowsPerPage);
const paginationDiv = document.getElementById("pagination");
paginationDiv.innerHTML = "";

for (let i = 1; i <= totalPages; i++) {

    const btn = document.createElement("button");
    btn.textContent = i;
    btn.onclick = () => {
        currentPage = i;
        loadProducts();
    };

    paginationDiv.appendChild(btn);
}
 if (!localStorage.getItem("logs")) {
    localStorage.setItem("logs", JSON.stringify([]));
}

function addLog(action) {
    const logs = JSON.parse(localStorage.getItem("logs"));
    logs.push({
        action,
        user: currentUser.fullname,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("logs", JSON.stringify(logs));
}

addLog("Added product: " + name);
addLog("Deleted product");
addLog("Updated product: " + product.name);
