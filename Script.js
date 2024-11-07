// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to Toggle Like
async function toggleLike(articleID) {
  const user = firebase.auth().currentUser;
  if (!user) return alert("Please sign in to like articles.");

  const articleRef = db.collection('articles').doc(articleID);
  const likeRef = db.collection('userLikes').doc(`${user.uid}_${articleID}`);

  const likeDoc = await likeRef.get();
  if (likeDoc.exists) {
    await likeRef.delete();
    articleRef.update({ likes: firebase.firestore.FieldValue.increment(-1) });
  } else {
    await likeRef.set({ userID: user.uid, articleID: articleID });
    articleRef.update({ likes: firebase.firestore.FieldValue.increment(1) });
  }
  updateLikeCount(articleID);
}

// Function to Update Like Count
async function updateLikeCount(articleID) {
  const articleRef = db.collection('articles').doc(articleID);
  const articleDoc = await articleRef.get();
  document.getElementById('likeCount').textContent = articleDoc.data().likes;
}

// Real-Time Like Count Update
db.collection('articles').doc('articleID').onSnapshot((doc) => {
  document.getElementById('likeCount').textContent = doc.data().likes;
});

// Function to Repost Article
async function repostArticle(articleID) {
  const user = firebase.auth().currentUser;
  if (!user) return alert("Please sign in to repost.");

  const articleRef = db.collection('articles').doc(articleID);
  const repostRef = db.collection('userReposts').doc(`${user.uid}_${articleID}`);

  const repostDoc = await repostRef.get();
  if (!repostDoc.exists) {
    await repostRef.set({ userID: user.uid, articleID: articleID });
    articleRef.update({ reposts: firebase.firestore.FieldValue.increment(1) });
  }
  updateRepostCount(articleID);
}

// Function to Update Repost Count
async function updateRepostCount(articleID) {
  const articleRef = db.collection('articles').doc(articleID);
  const articleDoc = await articleRef.get();
  document.getElementById('repostCount').textContent = articleDoc.data().reposts;
}

// Real-Time Repost Count Update
db.collection('articles').doc('articleID').onSnapshot((doc) => {
  document.getElementById('repostCount').textContent = doc.data().reposts;
});

// Share to Social Media
function shareToFacebook() {
  const url = window.location.href;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareToTwitter() {
  const url = window.location.href;
  const text = encodeURIComponent("Check out this article!");
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareToReddit() {
  const url = window.location.href;
  const title = encodeURIComponent("Interesting article");
  window.open(`https://www.reddit.com/submit?title=${title}&url=${url}`, '_blank');
}

// Copy Link Function
function copyLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert("Link copied to clipboard!");
  });
}
