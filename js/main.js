let employees = JSON.parse(localStorage.getItem("employees")) || [];

const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const filterDept = document.getElementById("filter-department");
const filterRole = document.getElementById("filter-role");
const paginationSelect = document.getElementById("pagination-limit");

let currentPage = 1;
let pageSize = parseInt(paginationSelect.value);

// Initial Setup
document.addEventListener("DOMContentLoaded", () => {
  populateFilterOptions();
  applyFilters();
  setupTheme();
});

// Apply theme toggle
function setupTheme() {
  const toggle = document.getElementById("theme-toggle");
  const theme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("dark", theme === "dark");

  toggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// Populate filter dropdowns dynamically
function populateFilterOptions() {
  const depts = [...new Set(employees.map(e => e.department))];
  const roles = [...new Set(employees.map(e => e.role))];

  depts.forEach(dept => {
    const opt = document.createElement("option");
    opt.value = dept;
    opt.textContent = dept;
    filterDept.appendChild(opt);
  });

  roles.forEach(role => {
    const opt = document.createElement("option");
    opt.value = role;
    opt.textContent = role;
    filterRole.appendChild(opt);
  });
}

function applyFilters() {
  let filtered = [...employees];

  const search = searchInput.value.toLowerCase();
  if (search) {
    filtered = filtered.filter(e =>
      e.firstName.toLowerCase().includes(search) ||
      e.email.toLowerCase().includes(search)
    );
  }

  const dept = filterDept.value;
  if (dept) filtered = filtered.filter(e => e.department === dept);

  const role = filterRole.value;
  if (role) filtered = filtered.filter(e => e.role === role);

  const sortKey = sortSelect.value;
  if (sortKey) {
    filtered.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  }

  renderPaginated(filtered);
}

function renderPaginated(data) {
  const start = (currentPage - 1) * pageSize;
  const paginated = data.slice(start, start + pageSize);
  renderEmployees(paginated);
  renderPaginationControls(data.length);
}

function renderEmployees(list) {
  const container = document.getElementById("employee-list");
  container.innerHTML = "";
  list.forEach(emp => {
    const div = document.createElement("div");
    div.className = "employee-card";
    div.innerHTML = `
      <p><strong>${emp.firstName} ${emp.lastName}</strong></p>
      <p>${emp.email}</p>
      <p>${emp.department} - ${emp.role}</p>
      <button onclick="editEmployee(${emp.id})">Edit</button>
      <button onclick="deleteEmployee(${emp.id})">Delete</button>
    `;
    container.appendChild(div);
  });
}

function renderPaginationControls(totalItems) {
  const controls = document.getElementById("pagination-controls");
  controls.innerHTML = "";
  const totalPages = Math.ceil(totalItems / pageSize);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = i;
      applyFilters();
    };
    controls.appendChild(btn);
  }
}

function deleteEmployee(id) {
  employees = employees.filter(emp => emp.id !== id);
  localStorage.setItem("employees", JSON.stringify(employees));
  currentPage = 1;
  applyFilters();
}

function editEmployee(id) {
  localStorage.setItem("editId", id);
  window.location.href = "form.html";
}

function openForm() {
  localStorage.removeItem("editId");
  window.location.href = "form.html";
}

// Events
searchInput.addEventListener("input", () => {
  currentPage = 1;
  applyFilters();
});

sortSelect.addEventListener("change", () => {
  currentPage = 1;
  applyFilters();
});

filterDept.addEventListener("change", () => {
  currentPage = 1;
  applyFilters();
});

filterRole.addEventListener("change", () => {
  currentPage = 1;
  applyFilters();
});

paginationSelect.addEventListener("change", () => {
  pageSize = parseInt(paginationSelect.value);
  currentPage = 1;
  applyFilters();
});
