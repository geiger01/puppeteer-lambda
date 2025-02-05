## In order to run locally:

- Run: `npm i`
- Run: `node index.js`

## In order to push Lambda to AWS (manually):

- Run: `zip -r lambda.zip index.js node_modules`
- Copy the `lambda.zip` to S3 
- Copy uploaded file link

in the lambda UI go to
Code - > upload from -> Amazon S3 locaion -> paste the Amazon S3 link URL
# puppeteer-lambda
