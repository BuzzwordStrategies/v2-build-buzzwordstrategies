# Buzzword Strategies Bundle Builder

A modern, interactive bundle builder for Buzzword Strategies' digital marketing services. Built with React and Tailwind CSS.

## Features

- Industry-specific tier descriptions
- Interactive subscription length slider with discount visualization
- Real-time pricing calculations
- Bundle and subscription discounts
- Persistent cart state
- Mobile-responsive design
- DocuSign integration for contracts

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your DocuSign credentials:
   ```
   DOCUSIGN_INTEGRATION_KEY=your_key_here
   DOCUSIGN_USER_ID=your_user_id_here
   DOCUSIGN_ACCOUNT_ID=your_account_id_here
   DOCUSIGN_BASE_URL=https://demo.docusign.net/restapi
   DOCUSIGN_PRIVATE_KEY=your_private_key_here
   ```
4. Start the development server: `npm start`

## Deployment

This project is configured for Netlify deployment. Simply connect your GitHub repository to Netlify, and it will automatically deploy on push to main.

## Structure

```
src/
├── components/
│   └── BundleBuilder.js    # Main bundle builder component
├── App.js                  # Root application component
├── index.js               # Application entry point
└── index.css              # Global styles with Tailwind imports

netlify/
└── functions/
    └── create-docusign-envelope.js  # DocuSign integration
```

## Technologies

- React 18
- Tailwind CSS
- Netlify Functions
- DocuSign API
- Local Storage for persistence