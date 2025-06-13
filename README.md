# Calorie Tracker

A mobile-first web application for tracking daily calories using AI-powered food recognition. Take photos of your meals and get instant calorie estimates using OpenAI's Vision API.

## Features

- 📱 Mobile-optimized PWA design
- 📸 Camera integration for food photos
- 🤖 AI-powered calorie estimation using OpenAI GPT-4 Vision
- 🎯 Personal goal setting (weight loss, gain, or maintenance)
- 📊 Daily calorie tracking and progress visualization
- 💾 Local storage for offline functionality
- 🍽️ Meal categorization (breakfast, lunch, dinner, snacks)

## Setup Instructions

### 1. Clone and Install

```bash
cd calorie-tracker
npm install
```

### 2. Configure OpenAI API

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Add your API key to `.env.local`:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser or mobile device.

## Usage

1. **Set Your Goal**: Choose whether you want to lose, gain, or maintain weight
2. **Take Photos**: Use the camera button to photograph your meals
3. **Review AI Analysis**: Confirm or edit the AI's calorie estimation
4. **Track Progress**: View your daily calorie intake and remaining goals

## Mobile Features

- Responsive design optimized for phones
- Native camera access
- Touch-friendly interface
- Offline data storage
- PWA capabilities for home screen installation

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
