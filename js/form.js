const form = document.getElementById("employee-form");
const id = localStorage.getItem("editId");
let employees = JSON.parse(localStorage.getItem("employees")) || [];

if (id) {
  const emp = employees.find(e => e.id == id);
  document.getElementById("form-title").innerText = "Edit Employee";
  document.getElementById("emp-id").value = emp.id;
  document.getElementById("first-name").value = emp.firstName;
  document.getElementById("last-name").value = emp.lastName;
  document.getElementById("email").value = emp.email;
  document.getElementById("department").value = emp.department;
  document.getElementById("role").value = emp.role;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const emp = {
    id: id ? Number(id) : Date.now(),
    firstName: form["first-name"].value.trim(),
    lastName: form["last-name"].value.trim(),
    email: form["email"].value.trim(),
    department: form["department"].value.trim(),
    role: form["role"].value.trim()
  };

  if (!/\S+@\S+\.\S+/.test(emp.email)) {
    alert("Invalid email format");
    return;
  }

  if (id) {
    employees = employees.map(e => e.id == id ? emp : e);
  } else {
    employees.push(emp);
  }

  localStorage.setItem("employees", JSON.stringify(employees));
  localStorage.removeItem("editId");
  window.location.href = "index.html";
});

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme") || "light";
document.body.classList.toggle("dark", currentTheme === "dark");

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
