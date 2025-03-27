# Puppeteer Lambda Boilerplate

A working boilerplate for running Puppeteer in AWS Lambda. This project provides a headless Chrome setup using `@sparticuz/chromium` and includes stealth plugins to avoid detection.

## Prerequisites

- Node.js 18.x (recommended)
- AWS Account with Lambda and S3 access
- AWS CLI configured (for local deployment)

## Local Development Setup

1. Install Node.js 18:
```bash
nvm install 18
nvm use 18
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
SECRET=your-secret-key-here
```

4. Run locally:
```bash
node index.js
```

## AWS Configuration

1. Create an S3 bucket for storing the Lambda deployment package
2. Create a Lambda function with the following settings:
   - Runtime: Node.js 18.x
   - Memory: 1024 MB (recommended)
   - Timeout: 30 seconds (adjust based on your needs)
   - Architecture: x86_64

## Manual Deployment to AWS

1. Create deployment package:
```bash
zip -r lambda.zip index.js node_modules
```

2. Upload to S3:
```bash
aws s3 cp lambda.zip s3://your-bucket-name/lambda.zip
```

3. Update Lambda function:
   - Go to AWS Lambda Console
   - Select your function
   - Go to Code tab
   - Click "Upload from" -> "Amazon S3 location"
   - Paste the S3 URL of your uploaded zip file

## Automated Deployment with GitHub Actions

This project includes a GitHub Actions workflow for automated deployment. To set it up:

1. Add the following secrets to your GitHub repository:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

2. Update the workflow file (`.github/workflows/main.yml`) with your specific values:
   - Replace `{{your-bucket-name}}` with your S3 bucket name
   - Replace `{{your-function-name}}` with your Lambda function name

3. Push to the main branch to trigger the deployment

## API Usage

The Lambda function accepts POST requests with the following structure:

```json
{
  "url": "https://example.com"
}
```

Headers required:
```
secret: your-secret-key
```

## Dependencies

- @sparticuz/chromium: ^123.0.1
- puppeteer-extra: ^3.3.4
- puppeteer-core: 19.6
- puppeteer-extra-plugin-stealth: ^2.11.1
- puppeteer: ^21.5.0
- dotenv: ^16.4.5

## Alternative Solution

If you're looking for a managed solution that handles all the infrastructure and maintenance, consider using [CaptureKit](https://www.capturekit.dev/). It provides three powerful APIs in one platform:

### Screenshot API
- Reliable screenshot capture with no infrastructure management
- Full-page screenshots with lazy loading support
- Built-in ad and cookie banner blocking
- Multiple output formats (PNG, WebP, JPEG, PDF)
- Direct S3 upload integration

### Content Extraction API
- Clean, structured HTML extraction
- Metadata parsing (title, description, OpenGraph & Schema data)
- Link scraping (internal and external)
- Consistent data without maintenance headaches
- Perfect for data pipelines and web scraping

### AI Analysis API
- Instant webpage summarization
- Key insights extraction
- AI-powered content analysis
- Scale your web research process
- Focus on creating, not extracting content

All APIs are:
- Developer-first with instant access
- No credit card required for free tier
- Lightning-fast support
- Built for production use cases

## Notes

- The function uses stealth plugins to avoid detection
- Local development uses your system's Chrome installation
- Lambda deployment uses @sparticuz/chromium for AWS compatibility
- Make sure to keep your AWS credentials secure and never commit them to the repository
