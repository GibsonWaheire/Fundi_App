// Ensure the DOM is loaded

window.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return (window.location.href = "index.html");
  
    document.getElementById("welcomeMessage").textContent = `Hello, ${loggedInUser.name}!`;
    document.getElementById("userName").textContent = loggedInUser.name;
    document.getElementById("userEmail").textContent = loggedInUser.email;
  
    const sections = ["homeSection", "makeRequestSection", "myRequestsSection", "profileSection"];
    const showSection = (id) => {
      sections.forEach((sec) => document.getElementById(sec).classList.add("hidden"));
      document.getElementById(id).classList.remove("hidden");
    };
  
    document.getElementById("homeBtn").addEventListener("click", () => showSection("homeSection"));
    document.getElementById("makeRequestBtn").addEventListener("click", () => showSection("makeRequestSection"));
    document.getElementById("myRequestsBtn").addEventListener("click", () => {
      showSection("myRequestsSection");
      displayRequests();
    });
    document.getElementById("profileBtn").addEventListener("click", () => showSection("profileSection"));
  
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    });
  
    // Submit request
    document.getElementById("requestForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const category = document.getElementById("jobCategory").value;
      const title = document.getElementById("jobTitle").value.trim();
      const description = document.getElementById("jobDescription").value.trim();
      const image = document.getElementById("projectImage").files[0];
      const video = document.getElementById("projectVideo").files[0];
  
      if (!title || !description || !category || !image || !video) return alert("All fields are required");
  
      const request = {
        id: Date.now(),
        user: loggedInUser.email,
        title,
        description,
        category,
        imageName: image.name,
        videoName: video.name,
        date: new Date().toLocaleString(),
      };
  
      const requests = JSON.parse(localStorage.getItem("requests")) || [];
      requests.push(request);
      localStorage.setItem("requests", JSON.stringify(requests));
      alert("Request submitted successfully!");
      document.getElementById("requestForm").reset();
      showSuggestedFundis(category);
    });
  
    function displayRequests() {
      const requests = JSON.parse(localStorage.getItem("requests")) || [];
      const userRequests = requests.filter(r => r.user === loggedInUser.email);
      const list = document.getElementById("requestList");
      list.innerHTML = "";
  
      if (userRequests.length === 0) return (list.innerHTML = `<li class="italic text-gray-500">No requests yet.</li>`);
  
      userRequests.forEach((req) => {
        const item = document.createElement("li");
        item.className = "border p-4 rounded shadow bg-gray-50";
        item.innerHTML = `
          <strong>${req.title}</strong>
          <p class="text-sm">${req.description}</p>
          <p class="text-xs text-gray-500 mt-1">Posted on ${req.date}</p>
          <p class="text-xs italic">Attached: ${req.imageName}, ${req.videoName}</p>
        `;
        list.appendChild(item);
      });
    }
  
    function showSuggestedFundis(category) {
      fetch("http://localhost:3000/fundis")
        .then((res) => res.json())
        .then((fundis) => {
          const matches = fundis.filter(f => f.skill.toLowerCase() === category.toLowerCase());
          const container = document.getElementById("suggestedFundis");
          container.innerHTML = "";
  
          if (matches.length === 0) return container.innerHTML = `<p class='text-gray-500 italic'>No fundis matched your request yet.</p>`;
  
          matches.forEach(fundi => {
            const div = document.createElement("div");
            div.className = "border p-4 rounded shadow bg-white text-center";
            div.innerHTML = `
              <img src="${fundi.profilePhoto}" class="w-16 h-16 mx-auto rounded-full mb-2">
              <h4 class="font-semibold">${fundi.name}</h4>
              <p class="text-sm text-gray-600">${fundi.skill}, ${fundi.location}</p>
              <p class="text-xs text-gray-500">Rating: ${fundi.rating}</p>
              <button class="likeBtn mt-2 bg-green-600 text-white px-3 py-1 rounded">Like (${fundi.likes})</button>
            `;
            container.appendChild(div);
  
            const likeBtn = div.querySelector(".likeBtn");
            likeBtn.addEventListener("click", () => {
              fundi.likes++;
              likeBtn.textContent = `Like (${fundi.likes})`;
            });
          });
        });
    }
  
    // Optional search bar functionality
    document.getElementById("searchInput")?.addEventListener("input", (e) => {
      const searchValue = e.target.value.toLowerCase();
      const fundiCards = document.querySelectorAll("#suggestedFundis > div");
      fundiCards.forEach((card) => {
        card.style.display = card.textContent.toLowerCase().includes(searchValue) ? "block" : "none";
      });
    });
  });
  

        // Alternatively, using .map() and .join() for slightly different rendering approach:
        /*
        const fundiCardsHtml = fundis.map(fundi => `
            <div class="fundi-card">
                <img src="${fundi.profilePhoto}" alt="${fundi.name}">
                <h3>${fundi.name}</h3>
                <p>Skill: <strong>${fundi.skill.charAt(0).toUpperCase() + fundi.skill.slice(1)}</strong></p>
                <p>Location: ${fundi.location.charAt(0).toUpperCase() + fundi.location.slice(1)}</p>
                <p class="rating">Rating: ${fundi.rating} ⭐</p>
                <button class="like-btn" data-fundi-id="${fundi.id}" data-likes="${fundi.likes}">❤️ ${fundi.likes}</button>
            </div>
        `).join('');
        fundiResultsContainer.innerHTML = fundiCardsHtml;
        */
    

    // Initial load (optional, you could fetch some default fundis or keep it empty)
    // fetchAndDisplayFundis('plumbing', 'nairobi'); // Example: load some fundis on page load

