# Catholic Missal - Daily Mass Readings

A beautiful, reverent web application that provides daily Catholic Mass readings with an elegant interface designed for prayer and reflection.

## ✨ Features

- **Daily Liturgical Readings**: First Reading, Responsorial Psalm, Second Reading (when applicable), and Gospel
- **Liturgical Calendar Integration**: Proper seasons, colors, and feast days
- **AI-Powered Content**: GPT-5 integration for accurate liturgical information
- **Offline Support**: Progressive Web App with service worker caching
- **Responsive Design**: Beautiful on desktop, tablet, and mobile devices
- **Print-Friendly**: Optimized layouts for printing readings
- **Keyboard Navigation**: Full keyboard accessibility support
- **Catholic Aesthetic**: Traditional colors, typography, and reverent design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/catholic-missal.git
cd catholic-missal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Catholic theme
- **AI Integration**: OpenAI GPT-5 API
- **Caching**: LocalStorage + Service Worker
- **PWA**: Full Progressive Web App support
- **Deployment**: Vercel

## 📱 Progressive Web App

This application works as a PWA, meaning users can:
- Install it on their devices like a native app
- Use it offline with cached readings
- Receive update notifications
- Enjoy fast loading with service worker caching

## 🎨 Design Philosophy

The design respects Catholic liturgical traditions:
- **Colors**: Liturgical colors (red, gold, white, green, purple, rose)
- **Typography**: EB Garamond and Cinzel fonts for readability and reverence
- **Layout**: Clean, spacious design focused on the text
- **Accessibility**: Screen reader friendly, keyboard navigation, proper contrast

## ⌨️ Keyboard Shortcuts

- `←` or `H`: Previous day
- `→` or `L`: Next day
- `T`: Go to today
- `P`: Print readings
- `R`: Refresh readings

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEXT_PUBLIC_BASE_URL`: Your production domain

3. Deploy automatically with git push

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY`: Required - Your OpenAI API key for GPT-5 access
- `NEXT_PUBLIC_BASE_URL`: Your application's base URL for PWA features

### Customization

The application can be customized by editing:
- `src/app/globals.css`: Colors, fonts, and styling
- `src/lib/gpt5-client.ts`: AI prompts and liturgical logic
- `src/lib/liturgical-calendar.ts`: Calendar calculations
- `public/manifest.json`: PWA configuration

## 📖 API Endpoints

### `GET /api/readings/[date]`

Fetches liturgical readings for a specific date.

**Parameters:**
- `date`: YYYY-MM-DD format

**Response:**
```json
{
  "readings": {
    "date": "2024-12-25",
    "liturgicalDate": "The Nativity of the Lord (Christmas)",
    "season": "Christmas",
    "color": "white",
    "rank": "solemnity",
    "firstReading": { /* ... */ },
    "psalm": { /* ... */ },
    "secondReading": { /* ... */ },
    "gospel": { /* ... */ },
    "saint": "Optional saint name"
  }
}
```

## 🛠️ Development

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/readings/       # API routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── layout/             # Layout components
│   ├── navigation/         # Navigation components
│   └── readings/           # Reading display components
└── lib/                    # Utilities and services
    ├── cache.ts            # Caching logic
    ├── gpt5-client.ts      # AI integration
    ├── liturgical-calendar.ts # Calendar calculations
    └── sw-registration.ts   # Service worker
```

### Adding New Features

1. **New Reading Types**: Modify `LiturgicalReading` interface in `gpt5-client.ts`
2. **Calendar Features**: Extend `liturgical-calendar.ts`
3. **UI Components**: Add to appropriate `components/` subdirectory
4. **Styling**: Use Tailwind classes with custom Catholic theme variables

## 📄 License

This project is for educational and devotional purposes. Please ensure compliance with liturgical and copyright requirements for any public deployment.

## 🙏 Disclaimer

This application is for private use in personal prayer and devotion. It is not intended for official liturgical use. Always refer to official Catholic sources for authoritative liturgical information.

## 🤝 Contributing

Contributions are welcome! Please ensure any changes respect the reverent nature of the application and maintain theological accuracy.

---

*Ad Majorem Dei Gloriam* ✠
