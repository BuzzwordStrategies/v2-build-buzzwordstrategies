markdown# Buzzword Strategies Bundle Builder

A modern, interactive bundle builder for Buzzword Strategies' digital marketing services. Built with React, Express, and integrated with Stripe for payments.

## Features

- Industry-specific tier descriptions
- Interactive subscription length slider with discount visualization
- Real-time pricing calculations
- Bundle and subscription discounts
- Persistent cart state
- Mobile-responsive design
- Stripe integration for payments
- Continuous data saving to Supabase

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your environment variables:
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
4. Start the development servers: `npm run dev`

## Project Structure
/
├── netlify/
│   └── functions/              # Netlify serverless functions
├── server/
│   ├── routes/                 # Express API routes
│   └── server.js               # Express server entry point
├── src/
│   ├── components/             # React components
│   ├── setupProxy.js           # Development proxy configuration
│   ├── App.js                  # Root React component
│   └── index.js                # React entry point
├── .env                        # Environment variables (not in repo)
├── netlify.toml                # Netlify configuration
└── package.json                # Project dependencies

## Development

- `npm run dev`: Runs both the React app and Express server
- `npm run server`: Runs only the Express server
- `npm start`: Runs only the React app

## Deployment

This project is configured for Netlify deployment. The Express server should be deployed separately to a platform like Heroku, Render, or similar.
