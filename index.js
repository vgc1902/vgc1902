const fs = require("fs").promises;
const firebase = require("firebase");

const firebaseConfig = {
	apiKey: "AIzaSyBLIWhyxo1EDDP8k3rrtWo1uLjZv11kfFg",
	authDomain: "ikode-bf9f5.firebaseapp.com",
	databaseURL: "https://ikode-bf9f5.firebaseio.com",
	projectId: "ikode-bf9f5",
	storageBucket: "ikode-bf9f5.appspot.com",
	messagingSenderId: "183529867692",
	appId: "1:183529867692:web:c8f5b69d161e8c3b8a1209",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const posts = () => {
	return db
		.ref("posts")
		.child("es")
		.once("value")
		.then((snapshot) => {
			const posts = [];
			snapshot.forEach((childSnapshot) => {
				posts.push(childSnapshot.val());
			});
			return posts;
		});
};

const LATEST_POST_PLACEHOLDER = "%{{lastest_post}}%";
(async () => {
	const templateMd = await fs.readFile("./README.md.template", { encoding: "utf-8" });
	const firebasePosts = await posts();
	const [{ title, link }] = firebasePosts.reverse();
	const latestPost = `[${title}](${link})`;
	const updatedMarkdown = templateMd.replace(LATEST_POST_PLACEHOLDER, latestPost);

	await fs.writeFile("./README.md", updatedMarkdown);
	firebase.database().goOffline();
})();
