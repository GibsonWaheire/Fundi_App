// dashboard.js — ES Module
import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let loggedInUser = null;

// --- AUTH GUARD ----------------------------------------------------
onAuthStateChanged(auth, user => {
  if (!user) {
    localStorage.removeItem("loggedInUser");
    return (window.location.href = "index.html");
  }
  if (!user.emailVerified) {
    alert("Please verify your email.");
    localStorage.removeItem("loggedInUser");
    return (window.location.href = "index.html");
  }
  startDashboard(user);
});

// --- DASHBOARD BOOTSTRAP -------------------------------------------
function startDashboard(user) {
  loggedInUser = {
    name: user.displayName || "User",
    email: user.email,
  };

  document.getElementById(
    "welcomeMessage"
  ).textContent = `Hello, ${loggedInUser.name}!`;

  document.getElementById("userAvatar").src = "default-avatar.png"; // Keeping default

  bindNavButtons();
  showSection("homeSection");
  updateRequestCount(); // Update the count on dashboard load
}

// --- NAVIGATION & EVENTS -------------------------------------------
function bindNavButtons() {
  const navMap = {
    homeBtn: "homeSection",
    makeRequestBtn: "makeRequestSection",
    myRequestsBtn: "myRequestsSection",
    profileBtn: "profileSection",
  };

  Object.entries(navMap).forEach(([btnId, sec]) => {
    document.getElementById(btnId).addEventListener("click", () => {
      showSection(sec);
      if (sec === "myRequestsSection") displayRequests();
      if (sec === "profileSection") loadUserProfile();
      if (sec === "homeSection") updateRequestCount(); // Update count if returning to home
    });
  });

  document.querySelectorAll(".backBtn").forEach(btn =>
    btn.addEventListener("click", e =>
      showSection(e.currentTarget.dataset.target)
    )
  );

  document
    .getElementById("quickRequestBtn")
    .addEventListener("click", () => showSection("makeRequestSection"));

  // Form submission for new requests
  document
    .getElementById("requestForm")
    .addEventListener("submit", e => {
      e.preventDefault();
      handleNewRequest();
    });

  // Profile edit toggle (YOUR ORIGINAL CODE)
  const editBtn = document.getElementById("editProfileBtn");
  const saveBtn = document.getElementById("saveProfileBtn");
  const profileFields = [
    document.getElementById("profileName"),
    document.getElementById("profilePhone"),
    document.getElementById("profileLocation"),
    document.getElementById("profilePhoto")
  ];

  editBtn.addEventListener("click", () => {
    profileFields.forEach(f => { f.disabled = false; f.classList.remove("bg-gray-100"); });
    saveBtn.disabled = false;
    editBtn.disabled = true;
  });

  document.getElementById("profileForm").addEventListener("submit", e => {
    e.preventDefault();
    saveUserProfile();
  });

  document
    .getElementById("logoutBtn")
    .addEventListener("click", () => signOut(auth));
}

// --- VIEW SWITCHING ------------------------------------------------
function showSection(id) {
  [
    "homeSection",
    "makeRequestSection",
    "myRequestsSection",
    "suggestedFundisSection",
    "profileSection",
  ].forEach(sec => document.getElementById(sec).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// --- PROFILE LOAD & SAVE (YOUR ORIGINAL CODE) ----------------------
function loadUserProfile() {
  document.getElementById("profileName").value = loggedInUser.name;
  document.getElementById("profileEmail").value = loggedInUser.email;
  document.getElementById("profilePhone").value = loggedInUser.phone || "";
  document.getElementById("profileLocation").value = loggedInUser.location || "";
  const preview = document.getElementById("profilePhotoPreview").src;
  if (preview) document.getElementById("userAvatar").src = preview;
}

function saveUserProfile() {
  const newName = document.getElementById("profileName").value.trim();
  const newPhone = document.getElementById("profilePhone").value.trim();
  const newLocation = document.getElementById("profileLocation").value.trim();
  const photoFile = document.getElementById("profilePhoto").files[0];

  if (!newName) return alert("Name cannot be empty.");

  loggedInUser.name = newName;
  loggedInUser.phone = newPhone;
  loggedInUser.location = newLocation;
  document.getElementById("welcomeMessage").textContent = `Hello, ${newName}!`;

  if (photoFile) {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("profilePhotoPreview").src = reader.result;
      document.getElementById("userAvatar").src = reader.result;
    };
    reader.readAsDataURL(photoFile);
  }

  alert("Profile updated!");

  ["profileName","profilePhone","profileLocation","profilePhoto"].forEach(id => {
    const f = document.getElementById(id);
    f.disabled = true;
    f.classList.add("bg-gray-100");
  });
  document.getElementById("saveProfileBtn").disabled = true;
  document.getElementById("editProfileBtn").disabled = false;
}

// --- NEW REQUEST LOGIC (ADAPTED FROM FRIEND'S CODE) ----------------
function handleNewRequest() {
  const cat = document.getElementById("jobCategory").value;
  const title = document.getElementById("jobTitle").value.trim();
  const desc = document.getElementById("jobDescription").value.trim();
  const imgFile = document.getElementById("jobImage").files[0];
  const vidFile = document.getElementById("jobVideo").files[0];

  if (!cat || !title || !desc) {
    return alert("Please fill in all required fields.");
  }

  const fees = {
    fundi_plumbing: 500,
    fundi_electrical: 500,
    fundi_carpentry: 500,
    fundi_masonry: 500,
    fundi_gardening: 500,
    contractor_general: 5000,
    contractor_painting: 5000,
    pro_engineer: 20000,
    pro_architect: 20000,
  };
  const fee = fees[cat] || 0;

  const req = {
    id: Date.now(), // Unique ID for the request
    category: cat,
    fee,
    title,
    description: desc,
    imageName: imgFile?.name || "", // Store only the name, not the file data
    videoName: vidFile?.name || "", // Store only the name, not the file data
    user: loggedInUser.email, // Link to the current user
    date: new Date().toLocaleString(), // Local date string
  };

  // Get existing requests, add new one, and save to localStorage
  const all = JSON.parse(localStorage.getItem("requests")) || [];
  all.push(req);
  localStorage.setItem("requests", JSON.stringify(all));

  console.log("New Request Submitted:", req); // Log to console as requested
  alert(`Request submitted! Fee: KES ${fee}`);
  document.getElementById("requestForm").reset();

  // Show "My Requests" and update the list
  showSection("myRequestsSection");
  displayRequests();
  updateRequestCount(); // Also update count on home section

  // Fetch and display suggested fundis after submitting the request
  fetchFundisFromAPI(req);
}

// --- DISPLAY SAVED REQUESTS (ADAPTED FROM FRIEND'S CODE) -----------
function displayRequests() {
  const allRequests = JSON.parse(localStorage.getItem("requests")) || [];
  // Filter requests to show only those made by the current logged-in user
  const userRequests = allRequests.filter(r => r.user === loggedInUser.email);
  const ul = document.getElementById("requestList");
  ul.innerHTML = ""; // Clear previous list items

  if (!userRequests.length) {
    return (ul.innerHTML =
      '<li class="italic text-gray-500">No requests yet.</li>');
  }

  userRequests.forEach(r => {
    const li = document.createElement("li");
    li.className = "border p-4 rounded shadow bg-gray-50";
    li.innerHTML = `
      <h3 class="font-bold text-lg text-green-700">${r.title}</h3>
      <p class="text-gray-700 mt-1">${r.description}</p>
      <p class="text-sm text-gray-600"><strong>Category:</strong> ${r.category.replace('fundi_', 'Fundi ').replace('contractor_', 'Contractor ').replace('pro_', 'Professional ')} | <strong>Fee:</strong> KES ${r.fee}</p>
      ${r.imageName ? `<p class="text-sm text-gray-600"><strong>Image:</strong> ${r.imageName}</p>` : ""}
      ${r.videoName ? `<p class="text-sm text-gray-600"><strong>Video:</strong> ${r.videoName}</p>` : ""}
      <p class="text-xs text-gray-500 mt-2">Requested on: ${r.date}</p>
    `;
    ul.appendChild(li);
  });
}

// --- UPDATE REQUEST COUNT ON HOME SECTION --------------------------
function updateRequestCount() {
  const requestCountElement = document.getElementById("requestCount");
  const allRequests = JSON.parse(localStorage.getItem("requests")) || [];
  const userRequests = allRequests.filter(r => r.user === loggedInUser.email);
  requestCountElement.textContent = userRequests.length;
}


// --- SUGGEST FUNDIS (ADAPTED FROM FRIEND'S CODE) -------------------
function fetchFundisFromAPI(request = {}) {
  fetch("https://randomuser.me/api/?results=20")
    .then(res => res.json())
    .then(data => {
      let fundis = data.results.map((u, i) => ({
        id: i + 1,
        name: `${u.name.first} ${u.name.last}`,
        location: u.location.city,
        skill: randomSkill(),
        rating: +(Math.random() * 2 + 3).toFixed(1),
      }));

      // Filter fundis based on the submitted request's category
      if (request.category) {
        const pref = request.category.split("_")[0]; // e.g., "fundi", "contractor", "pro"
        fundis = fundis.filter(f => f.skill.startsWith(pref));
      }

      fundis.sort((a, b) => b.rating - a.rating); // Sort by rating (highest first)
      renderFundis(fundis.slice(0, 5), request); // Render top 5
    })
    .catch(err => {
      console.error("Error fetching fundis:", err);
      // Fallback if API fails, show no fundis or a message
      renderFundis([], request);
    });
}

// Random skill generator for dummy fundis
function randomSkill() {
  const skills = [
    "fundi_plumbing",
    "fundi_electrical",
    "fundi_carpentry",
    "fundi_masonry",
    "fundi_gardening",
    "contractor_general",
    "contractor_painting",
    "pro_engineer",
    "pro_architect",
  ];
  return skills[Math.floor(Math.random() * skills.length)];
}

// Render suggested fundis (ADAPTED FROM FRIEND'S CODE)
function renderFundis(list, request) {
  const c = document.getElementById("suggestedFundis");
  c.innerHTML = ""; // Clear previous fundis

  if (!list.length) {
    return (c.innerHTML =
      '<p class="text-gray-500">No matching fundis found or API error.</p>');
  }

  list.forEach(f => {
    const d = document.createElement("div");
    d.className = "bg-white rounded shadow p-4 text-center";
    d.innerHTML = `
      <h3 class="font-bold">${f.name}</h3>
      <p>${f.skill.replace('fundi_', 'Fundi ').replace('contractor_', 'Contractor ').replace('pro_', 'Professional ')} • ${f.location}</p>
      <p>Rating: ${f.rating} ⭐</p>
      <button
        data-id="${f.id}"
        class="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
      >
        Select & Pay KES ${request.fee}
      </button>
    `;
    c.appendChild(d);
  });

  c.querySelectorAll("button[data-id]").forEach(btn =>
    btn.addEventListener("click", e => {
      const id = e.currentTarget.dataset.id;
      // In a real app, this would initiate a payment flow
      alert(
        `You chose fundi #${id}. Proceed with a KES ${request.fee} payment flow.`
      );
    })
  );

  showSection("suggestedFundisSection"); // Show the suggested fundis section
}