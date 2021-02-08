const fs = require("fs").promises;
const firebase = require("firebase");
const dotenv = require("dotenv").config();

const firebaseConfig = {
	apiKey: dotenv.parsed.API_KEY,
	authDomain: dotenv.parsed.AUTH_DOMAIN,
	databaseURL: dotenv.parsed.DATABASE_URL,
	projectId: dotenv.parsed.PROJECT_ID,
	storageBucket: dotenv.parsed.STORAGE_BUCKET,
	messagingSenderId: dotenv.parsed.MESSAGING_SENDER_ID,
	appId: dotenv.parsed.APP_ID,
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
