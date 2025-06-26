import { getFirestore, doc, getDoc, collection, getDocs, addDoc, updateDoc, increment } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebase.js";

const db = getFirestore();
const params = new URLSearchParams(location.search);
const fundiId = params.get("id");

async function loadProfile() {
  const docSnap = await getDoc(doc(db, "fundis", fundiId));
  if (!docSnap.exists()) return alert("Profile not found");
  const f = docSnap.data();

  document.getElementById("profileCard").innerHTML = `
    <img src="${f.photoURL}" class="w-32 h-32 rounded-full mx-auto" />
    <h2 class="text-2xl font-bold mt-4">${f.name}</h2>
    <p class="text-gray-600">${f.skill.replace("fundi_","").replace("_"," ")}</p>
    <p class="mt-2">Rating: ${f.avgRating.toFixed(1)} ⭐ (${f.ratingCount} reviews)</p>
  `;

  loadReviews();
}

async function loadReviews() {
  const revSnap = await getDocs(collection(db, "fundis", fundiId, "reviews"));
  const container = document.getElementById("reviews");
  container.innerHTML = "<h3 class='text-lg font-semibold'>Reviews</h3>";
  revSnap.forEach(doc => {
    const r = doc.data();
    container.innerHTML += `
      <div class="p-4 border rounded">
        <p class="font-semibold">${r.userName}</p>
        <p>Rating: ${r.rating} ⭐</p>
        <p class="text-sm mt-1">${r.comment}</p>
      </div>
    `;
  });
}

onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = "index.html";
  loadProfile();

  document.getElementById("reviewForm").addEventListener("submit", async e => {
    e.preventDefault();
    const rating  = +document.getElementById("rating").value;
    const comment = document.getElementById("comment").value.trim();
    if (!rating || !comment) return alert("All fields required");

    // 1️⃣ Add review
    await addDoc(collection(db, "fundis", fundiId, "reviews"), {
      userId:   user.uid,
      userName: user.displayName || user.email,
      rating,
      comment,
      timestamp: new Date()
    });

    // 2️⃣ Update aggregate
    const fundiRef = doc(db, "fundis", fundiId);
    await updateDoc(fundiRef, {
      avgRating:   increment((rating - (await getDoc(fundiRef)).data().avgRating) / ((await getDoc(fundiRef)).data().ratingCount + 1)),
      ratingCount: increment(1)
    });

    alert("Thanks for your feedback!");
    loadProfile();
  });
});
