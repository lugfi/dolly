const express = require('express');
const crypto = require('crypto');
const simpleGit = require('simple-git');
const git = simpleGit();

const app = express();
const PORT = 3000;

const sigHeaderName = 'X-Hub-Signature';
const secret = "REPLACE_ME";

const verifySecret = (req, res, next) => {
  const payload = JSON.stringify(req.body)
  if (!payload) {
    return next('Request body empty')
  }

  const sig = req.get(sigHeaderName) || ''
  const hmac = crypto.createHmac('sha1', secret)
  const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8')
  const checksum = Buffer.from(sig, 'utf8')
  if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
    return next(`Request body digest (${digest}) did not match ${sigHeaderName} (${checksum})`)
  }
  return next();
};

app.post('/', express.json(),verifySecret, async (req, res) => {
	console.log("Pulling from master...");
	await git.pull('origin', 'master', {'--no-rebase': null});
	console.log(`Sucessful updated at ${new Date()}`);
  	res.sendStatus(200);	
});


app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
