const app = require("express")();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const fileUpload = require("express-fileupload");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
app.use(fileUpload());
app.use(cors());
require("dotenv").config();
const aws = require("aws-sdk");
const region = "us-east-1";
const fs = require("fs");
const path = require("path");
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

aws.config.update({ region, accessKeyId, secretAccessKey });

const s3 = new aws.S3();
const uniqueString = () => {};

app.get("/test", (req, res) => {
	return res.send("Working fine.");
});
app.post("/upload", (req, res) => {
	try {
		const file = req.files.myFile;
		// console.log(file);
		const Bucket = "payrool";
		s3.upload(
			{ Bucket, Key: uuidv4() + file.name, Body: file.data },
			(err, data) => {
				if (err)
					return res.json({
						error: "Failed to Upload file",
						msg: err,
					});
				console.log(data.Location);
				return res.json({ url: data.Location });
			}
		);
	} catch (err) {
		return res.json({ error: "Failed to Upload Image" });
	}
});

app.post("/signed-url", (req, res) => {
	try {
		const Bucket = "payrool";
		// console.log(req.body.Key);
		let Key = req.body.Key;
		if (!Key) return res.json({ url: "" });
		Key = Key.substring(33);

		// console.log(Key);
		const Expires = 60 * 5;
		s3.getSignedUrl("getObject", { Bucket, Key, Expires }, (err, data) => {
			if (err) {
				console.log(err);
				return res.json({ error: "failed to create signed bucker" });
			}
			return res.json({ url: data });
		});
	} catch (err) {
		console.log(err);
		return res.json({ error: "Failed to get signed url" });
	}
});

const server = app.listen(process.env.PORT || 6000, () => {
	console.log(`Listening on port ${server.address().port}`);
});
