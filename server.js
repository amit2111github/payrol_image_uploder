const app = require("express")();
const fileUpload = require("express-fileupload");
app.use(fileUpload());
require("dotenv").config();
const aws = require("aws-sdk");
const region = "us-east-1";
const fs = require("fs");
const path = require("path");
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

aws.config.update({ region, accessKeyId, secretAccessKey });

const s3 = new aws.S3();

// app.get("/create/:name", (req, res) => {
// 	const { name } = req.params;
// 	s3.createBucket({ Bucket: name }, (err, data) => {
// 		if (err) {
// 			console.log(err);
// 			return res.json({ error: "failed to create bucker" });
// 		}

// 		return res.json(data);
// 	});
// });

// app.get("/delete/:name", (req, res) => {
// 	const { name } = req.params;
// 	s3.deleteBucket({ Bucket: name }, (err, data) => {
// 		if (err) {
// 			console.log(err);
// 			return res.json({ error: "failed to delete bucker" });
// 		}
// 		return res.json(data);
// 	});
// });

app.post("/upload", (req, res) => {
	const file = req.files.myFile;
	console.log(file);
	const Bucket = "payrool";
	s3.upload({ Bucket, Key: file.name, Body: file.data }, (err, data) => {
		if (err) return res.json({ error: "Failed to Upload file", msg: err });
		// console.log(data.Location);
		return res.json({ url: data.Location });
	});
});

// app.post("/view/", (req, res) => {
// 	console.log("inside 1");
// 	const Bucket = "amit-demo-bucket-1";
// 	const { Key } = req.body;
// 	const Expires = 60 * 5;
// 	s3.getSignedUrl("getObject", { Bucket, Key, Expires }, (err, data) => {
// 		if (err) {
// 			console.log(err);
// 			return res.json({ error: "failed to create signed bucker" });
// 		}
// 		const ws = fs.createReadStream(data);
// 		ws.pipe(res);
// 	});
// });

const server = app.listen(process.env.PORT || 5000, () => {
	console.log(`Listening on port ${server.address().port}`);
});
