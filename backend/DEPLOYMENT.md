# Deploying Backend to Render

This guide will help you deploy the OneBox backend to Render.

## Prerequisites

1. **Elasticsearch Cloud Service**: Since Render doesn't provide Elasticsearch, you'll need to use a cloud service like:
   - [Elastic Cloud](https://www.elastic.co/cloud/) (Free tier available)
   - [Bonsai](https://bonsai.io/) (Free tier available)
   - [Searchly](https://www.searchly.com/) (Free tier available)

2. **GitHub Repository**: Your code should be in a GitHub repository.

## Step 1: Set up Elasticsearch

1. Sign up for an Elasticsearch cloud service (recommended: Bonsai for simplicity)
2. Create a new cluster
3. Note down your Elasticsearch URL (it will look like: `https://username:password@host:port`)

## Step 2: Deploy to Render

### Option A: Using Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `onebox-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Starter` (or choose based on your needs)

### Option B: Using render.yaml (Recommended)

1. The `render.yaml` file is already configured in this repository
2. In Render Dashboard, click "New +" and select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect and use the `render.yaml` configuration

## Step 3: Configure Environment Variables

In your Render service dashboard, go to "Environment" tab and add these variables:

### Required Variables:
```
IMAP_HOST1=imap.gmail.com
IMAP_PORT1=993
IMAP_USER1=sahasubhadip54@gmail.com
IMAP_PASSWORD1=vjuh vyqf xmym vqxw
IMAP_HOST2=imap.gmail.com
IMAP_PORT2=993
IMAP_USER2=techandsudi54@gmail.com
IMAP_PASSWORD2=ybut kgwf qwjk fiwe
GOOGLE_API_KEY=AIzaSyCTVlbNUi8NGVyzdxqMsH7kwfofWLHKmFQ
ELASTICSEARCH_URL=https://your-elasticsearch-url
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/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
WEBHOOK_URL=https://webhook.site/271faf2e-3336-44ae-a4a4-eeb6a5bbc15f
```

### Optional Variables:
```
SLACK_CHANNEL=#general
WEBHOOK_TIMEOUT=5000
NODE_ENV=production
```

## Step 4: Update Elasticsearch URL

Replace `https://your-elasticsearch-url` with your actual Elasticsearch URL from Step 1.

## Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Wait for the build to complete (usually 2-5 minutes)

## Step 6: Test the Deployment

Once deployed, your service will be available at:
`https://your-service-name.onrender.com`

Test the health endpoint:
```bash
curl https://your-service-name.onrender.com/health
```

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check the build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Environment Variables**:
   - Double-check all environment variables are set correctly
   - Ensure Elasticsearch URL is accessible from Render

3. **CORS Issues**:
   - Update the `allowedOrigins` array in `src/server.ts` with your frontend URL

4. **Elasticsearch Connection**:
   - Verify your Elasticsearch URL is correct
   - Ensure the service is accessible from Render's servers
   - Check if authentication is required

### Logs

View logs in the Render dashboard under the "Logs" tab to debug issues.

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `IMAP_HOST1` | First email account IMAP host | Yes |
| `IMAP_PORT1` | First email account IMAP port | Yes |
| `IMAP_USER1` | First email account username | Yes |
| `IMAP_PASSWORD1` | First email account password | Yes |
| `IMAP_HOST2` | Second email account IMAP host | Yes |
| `IMAP_PORT2` | Second email account IMAP port | Yes |
| `IMAP_USER2` | Second email account username | Yes |
| `IMAP_PASSWORD2` | Second email account password | Yes |
| `GOOGLE_API_KEY` | Google AI API key for embeddings | Yes |
| `ELASTICSEARCH_URL` | Elasticsearch connection URL | Yes |
| `SLACK_WEBHOOK_URL` | Slack webhook URL for notifications | No |
| `WEBHOOK_URL` | Webhook URL for notifications | No |
| `SLACK_CHANNEL` | Slack channel for notifications | No |
| `WEBHOOK_TIMEOUT` | Webhook timeout in milliseconds | No |
| `PORT` | Server port (set by Render) | No |
| `NODE_ENV` | Environment (production) | No |

## API Endpoints

Once deployed, your API will be available at:
- Health check: `GET /health`
- All API routes: `GET/POST /api/*`

## Next Steps

1. Deploy your frontend to Render or another hosting service
2. Update the CORS configuration in `src/server.ts` with your frontend URL
3. Test the complete application flow 