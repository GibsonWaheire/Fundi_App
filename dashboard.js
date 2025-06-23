// dashboard.js

import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// Check Firebase auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (!user.emailVerified) {
      alert("Please verify your email to access the dashboard.");
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    } else {
      setupDashboard(user); // pass user info from Firebase
    }
  } else {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  }
});

function setupDashboard(user) {
  const loggedInUser = {
    name: user.displayName || "User",
    email: user.email
  };

  document.getElementById("welcomeMessage").textContent = `Hello, ${loggedInUser.name}! Ready to make a request?`;
  document.getElementById("userName").textContent = loggedInUser.name;
  document.getElementById("userEmail").textContent = loggedInUser.email;

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    auth.signOut().then(() => {
      window.location.href = "index.html";
    });
  });

  // Init dashboard features
  initDashboardFeatures(loggedInUser);
}

function initDashboardFeatures(loggedInUser) {
  // Navigation
  document.getElementById("homeBtn").addEventListener("click", () => showSection("homeSection"));
  document.getElementById("makeRequestBtn").addEventListener("click", () => showSection("makeRequestSection"));
  document.getElementById("myRequestsBtn").addEventListener("click", () => {
    showSection("myRequestsSection");
    displayRequests(loggedInUser);
  });
  document.getElementById("profileBtn").addEventListener("click", () => showSection("profileSection"));

  // Request submission
  const requestForm = document.getElementById("requestForm");
  requestForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("jobTitle").value.trim();
    const description = document.getElementById("jobDescription").value.trim();
    const skill = document.getElementById("jobSkill").value;

    if (!title || !description || !skill) return alert("All fields required");

    const newRequest = {
      title,
      description,
      skill,
      user: loggedInUser.email,
      date: new Date().toLocaleString()
    };

    const requests = JSON.parse(localStorage.getItem("requests")) || [];
    requests.push(newRequest);
    localStorage.setItem("requests", JSON.stringify(requests));

    requestForm.reset();
    alert("Request submitted!");

    fetchFundisFromAPI(skill);
  });

  fetchFundisFromAPI();
}

function showSection(id) {
  ["homeSection", "makeRequestSection", "myRequestsSection", "profileSection"].forEach(section => {
    document.getElementById(section).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

function displayRequests(loggedInUser) {
  const requests = JSON.parse(localStorage.getItem("requests")) || [];
  const userRequests = requests.filter(r => r.user === loggedInUser.email);
  const list = document.getElementById("requestList");
  list.innerHTML = "";

  if (userRequests.length === 0) {
    list.innerHTML = `<li class="italic text-gray-500">No requests yet.</li>`;
    return;
  }

  userRequests.forEach(req => {
    const item = document.createElement("li");
    item.className = "border p-4 rounded shadow bg-gray-50";
    item.innerHTML = `<strong>${req.title}</strong><p>${req.description}</p><p class="text-xs text-gray-500 mt-1">Skill: ${req.skill} | ${req.date}</p>`;
    list.appendChild(item);
  });
}

function fetchFundisFromAPI(matchSkill = "") {
  fetch("https://randomuser.me/api/?results=10")
    .then(res => res.json())
    .then(data => {
      const fundis = data.results.map((user, i) => ({
        id: i + 1,
        name: `${user.name.first} ${user.name.last}`,
        location: user.location.city,
        email: user.email,
        phone: user.phone,
        profilePhoto: user.picture.large,
        skill: assignRandomSkill(),
        rating: (Math.random() * 2 + 3).toFixed(1),
        likes: Math.floor(Math.random() * 20),
      }));
      const filtered = matchSkill ? fundis.filter(f => f.skill === matchSkill) : fundis;
      renderSuggestedFundis(filtered);
    });
}

function assignRandomSkill() {
  const skills = ["plumbing", "electrical", "carpentry", "masonry", "painting", "gardening"];
  return skills[Math.floor(Math.random() * skills.length)];
}

function renderSuggestedFundis(fundis) {
  const container = document.getElementById("suggestedFundis");
  container.innerHTML = "";

  if (fundis.length === 0) {
    container.innerHTML = `<p class="text-gray-500">No matching fundis found.</p>`;
    return;
  }

  fundis.forEach(fundi => {
    const div = document.createElement("div");
    div.className = "bg-white rounded shadow p-4 text-center";
    div.innerHTML = `
      <img src="${fundi.profilePhoto}" class="w-20 h-20 rounded-full mx-auto">
      <h3 class="text-lg font-bold mt-2">${fundi.name}</h3>
      <p class="text-sm">${fundi.skill} - ${fundi.location}</p>
      <p class="text-xs text-gray-500">Rating: ${fundi.rating} ⭐ | Likes: ${fundi.likes}</p>
    `;
    container.appendChild(div);
  });
}

fetchFundisFromAPI();