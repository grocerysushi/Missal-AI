# Catholic Missal - Complete Liturgical Platform

A comprehensive Catholic liturgical platform providing daily Mass readings, traditional prayers, and liturgical calendar information through both a beautiful web interface and a complete REST API.

## ✨ Features

### 📖 Web Application
- **Daily Liturgical Readings**: First Reading, Responsorial Psalm, Second Reading (when applicable), and Gospel
- **Traditional Catholic Prayers**: Complete collection of 20+ essential prayers organized by category
- **Liturgical Calendar Integration**: Proper seasons, colors, feast days, and celebrations
- **Offline Support**: Progressive Web App with service worker caching
- **Responsive Design**: Beautiful on desktop, tablet, and mobile devices
- **Print-Friendly**: Optimized layouts for printing readings and prayers
- **Keyboard Navigation**: Full keyboard accessibility support
- **Catholic Aesthetic**: Traditional colors, typography, and reverent design

### 🔌 REST API
- **Catholic Missal API v1**: Complete standardized API for liturgical data
- **Calendar Endpoints**: Liturgical seasons, celebrations, and feast day information
- **Readings Endpoints**: Daily Mass readings with liturgical metadata
- **Prayers Endpoints**: Categorized access to traditional Catholic prayers
- **Standardized Responses**: JSON API following Catholic Missal API specification
- **CORS Enabled**: Ready for mobile apps and third-party integrations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/grocerysushi/Missal-AI.git
cd Missal-AI
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Access the application:
   - **Web Interface**: [http://localhost:3006](http://localhost:3006)
   - **API Documentation**: [http://localhost:3006/api/v1/info](http://localhost:3006/api/v1/info)

### Quick API Test

```bash
# Get today's liturgical calendar
curl http://localhost:3006/api/v1/calendar/today

# Get today's readings
curl http://localhost:3006/api/v1/readings/today

# Get common prayers
curl http://localhost:3006/api/v1/prayers/common
```

## 🏗️ Tech Stack

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom Catholic liturgical theme
- **Runtime**: Edge Runtime for optimal performance

### Data Sources
- **Primary**: USCCB (United States Conference of Catholic Bishops) official readings
- **Prayers**: USCCB Basic Prayers Collection
- **Calendar**: Internal liturgical calendar calculations
- **Fallback**: Comprehensive error handling with graceful degradation

### Features
- **Caching**: Intelligent multi-layer caching (localStorage + in-memory)
- **PWA**: Full Progressive Web App support with service worker
- **API**: RESTful Catholic Missal API v1 with CORS support
- **Deployment**: Vercel-optimized with edge functions

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
2. Deploy automatically with git push
3. The application is pre-configured for edge runtime and optimized performance

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_BASE_URL`: Your application's base URL for PWA features (optional)

### Customization

The application can be customized by editing:
- `src/app/globals.css`: Liturgical colors, fonts, and styling
- `src/lib/liturgical-calendar.ts`: Calendar calculations and celebrations
- `src/lib/prayers-data.ts`: Prayer collection and categories
- `src/lib/usccb-scraper.ts`: Reading extraction logic
- `public/manifest.json`: PWA configuration

### Data Sources

The application uses official Catholic sources:
- **USCCB**: Primary source for daily readings
- **USCCB Basic Prayers**: Traditional Catholic prayers collection
- **Liturgical Calendar**: Based on official Church documents
- **Fallbacks**: Comprehensive error handling ensures availability

## 📖 API Documentation

The Catholic Missal API v1 provides comprehensive access to liturgical data through RESTful endpoints.

### Base URL
```
http://localhost:3006/api/v1
```

### Endpoints Overview

#### 📊 API Information
- **`GET /api/v1/info`** - API information and available endpoints

#### 📅 Calendar Endpoints
- **`GET /api/v1/calendar/today`** - Today's liturgical information
- **`GET /api/v1/calendar/{date}`** - Liturgical information for specific date (YYYY-MM-DD)

#### 📖 Readings Endpoints
- **`GET /api/v1/readings/today`** - Today's Mass readings
- **`GET /api/v1/readings/{date}`** - Mass readings for specific date (YYYY-MM-DD)

#### 🙏 Prayers Endpoints
- **`GET /api/v1/prayers/common`** - Common Catholic prayers (foundational)
- **`GET /api/v1/prayers/category/{category}`** - Prayers by category

### Prayer Categories
- `foundational` - Essential prayers (Our Father, Hail Mary, etc.)
- `creeds` - Apostles' Creed, Nicene Creed
- `devotional` - Angelus, Memorare, Anima Christi, etc.
- `acts` - Acts of Faith, Hope, and Love
- `liturgical` - Regina Caeli and seasonal prayers

### Example Responses

#### Calendar Response (Christmas Day)
```json
{
  "success": true,
  "liturgical_day": {
    "date": "2025-12-25",
    "season": "Christmas",
    "weekday": "Thursday",
    "celebrations": [{
      "name": "The Nativity of the Lord",
      "rank": "Solemnity",
      "color": "White",
      "description": "Christmas Day",
      "proper_readings": true
    }],
    "color": "White",
    "source": "Internal liturgical calendar calculations",
    "last_updated": "2025-09-21T00:00:00.000Z"
  },
  "source_attribution": "Liturgical calendar calculations based on official Church documents..."
}
```

#### Readings Response
```json
{
  "success": true,
  "readings": {
    "date": "2025-09-21",
    "first_reading": {
      "reference": "1 Timothy 6:13-16",
      "citation": "1 Timothy 6:13-16",
      "text": "Beloved: I charge you before God...",
      "source": "USCCB (United States Conference of Catholic Bishops)"
    },
    "responsorial_psalm": {
      "reference": "Psalm 100:1b-2, 3, 4, 5",
      "citation": "Psalm 100:1b-2, 3, 4, 5",
      "text": "R. (2) Come with joy into the presence of the Lord...",
      "refrain": "Come with joy into the presence of the Lord",
      "source": "USCCB (United States Conference of Catholic Bishops)"
    },
    "gospel": {
      "reference": "Luke 8:4-15",
      "citation": "Luke 8:4-15",
      "text": "When a large crowd gathered...",
      "source": "USCCB (United States Conference of Catholic Bishops)"
    },
    "source": "USCCB (United States Conference of Catholic Bishops)",
    "last_updated": "2025-09-21T00:00:00.000Z"
  },
  "source_attribution": "Readings sourced from USCCB and other official Catholic sources..."
}
```

#### Prayers Response
```json
{
  "success": true,
  "prayers": [
    {
      "name": "Our Father",
      "category": "foundational",
      "text": "Our Father, who art in heaven...",
      "source": "USCCB Basic Prayers Collection",
      "language": "en",
      "copyright_notice": "Traditional Catholic prayers from USCCB collection"
    }
  ],
  "category": "Common Catholic Prayers",
  "source_attribution": "Prayers from the USCCB Basic Prayers Collection..."
}
```

### Error Handling
All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Error description",
  "detail": "Detailed error information"
}
```

## 🛠️ Development

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── readings/       # Legacy readings API (maintained for compatibility)
│   │   └── v1/             # Catholic Missal API v1
│   │       ├── calendar/   # Calendar endpoints
│   │       ├── readings/   # Enhanced readings endpoints
│   │       ├── prayers/    # Prayer endpoints
│   │       └── info/       # API information
│   ├── prayers/            # Prayers page
│   ├── globals.css         # Global styles with Catholic theme
│   ├── layout.tsx          # Root layout with PWA support
│   └── page.tsx            # Home page (readings interface)
├── components/             # React components
│   ├── layout/             # Layout components (Header)
│   ├── navigation/         # Navigation components (DatePicker, DayNavigation)
│   ├── prayers/           # Prayer components (PrayersMenu, PrayerDisplay)
│   └── readings/           # Reading display components
└── lib/                    # Utilities and services
    ├── api-converters.ts   # API data conversion utilities
    ├── api-types.ts        # Catholic Missal API type definitions
    ├── cache.ts            # Multi-layer caching system
    ├── liturgical-calendar.ts # Enhanced liturgical calendar calculations
    ├── prayers-data.ts     # Complete prayers collection
    ├── types.ts            # Internal type definitions
    ├── usccb-scraper.ts    # USCCB readings scraper (enhanced)
    └── sw-registration.ts  # Service worker registration
```

### Adding New Features

#### Extending the API
1. **New Endpoints**: Add routes under `src/app/api/v1/`
2. **Data Types**: Extend types in `api-types.ts`
3. **Converters**: Add conversion logic in `api-converters.ts`

#### Liturgical Enhancements
1. **Calendar Features**: Extend `liturgical-calendar.ts`
2. **New Celebrations**: Add to the celebrations database
3. **Season Logic**: Enhance seasonal calculations

#### UI Components
1. **Reading Components**: Add to `components/readings/`
2. **Prayer Components**: Add to `components/prayers/`
3. **Navigation**: Enhance `components/navigation/`
4. **Styling**: Use Tailwind classes with liturgical color variables

## 📄 License

This project is for educational and devotional purposes. Please ensure compliance with liturgical and copyright requirements for any public deployment.

## 🌟 Use Cases

### For Developers
- **Mobile Apps**: Use the REST API to build Catholic mobile applications
- **Parish Websites**: Integrate liturgical data into parish websites
- **Prayer Applications**: Access categorized traditional Catholic prayers
- **Calendar Integration**: Include liturgical seasons and feast days

### For Personal Use
- **Daily Prayer**: Beautiful interface for daily Mass readings
- **Prayer Life**: Complete collection of traditional Catholic prayers
- **Liturgical Learning**: Understand seasons, celebrations, and feast days
- **Offline Access**: PWA functionality for use anywhere

### For Organizations
- **Educational**: Teaching liturgical seasons and Catholic traditions
- **Parish Ministry**: Support for prayer groups and liturgical planning
- **Third-party Integration**: API access for Catholic software systems

## 🔗 Related Projects

This implementation is compatible with and inspired by:
- [Catholic Missal API](https://github.com/grocerysushi/catholicmissalapi) - Original API specification
- [USCCB Official Resources](https://bible.usccb.org) - Primary data source
- [Catholic Calendar](https://www.vatican.va) - Liturgical calendar standards

## 🙏 Disclaimer

This application is for private use in personal prayer and devotion. It is not intended for official liturgical use. Always refer to official Catholic sources for authoritative liturgical information.

All liturgical content is sourced from official Catholic sources including USCCB and traditional prayer collections. Proper attribution is provided for all sources.

## 🤝 Contributing

Contributions are welcome! Please ensure any changes:
- Respect the reverent nature of the application
- Maintain theological accuracy
- Follow liturgical standards
- Include proper source attribution
- Preserve the Catholic aesthetic

### Areas for Contribution
- Additional prayer collections
- Enhanced liturgical calendar features
- Improved accessibility
- Translations (future feature)
- Bug fixes and performance improvements

## 📱 Mobile Development

The REST API is perfect for mobile app development:

```javascript
// Example: Fetch today's readings in a React Native app
const response = await fetch('https://your-domain.com/api/v1/readings/today');
const data = await response.json();

if (data.success) {
  const readings = data.readings;
  // Use readings in your mobile app
}
```

## 📊 Performance & Reliability

- **Edge Runtime**: Optimized for global performance
- **Intelligent Caching**: Multi-layer caching reduces load times
- **Error Handling**: Graceful fallbacks ensure availability
- **CORS Enabled**: Ready for cross-origin requests
- **Type Safety**: Full TypeScript coverage

---

## 🎯 Roadmap

- [ ] Additional liturgical calendars (other regions)
- [ ] Enhanced feast day database
- [ ] Prayer translations
- [ ] Audio prayer features
- [ ] Advanced liturgical calculations
- [ ] Saints database integration

---

*Ad Majorem Dei Gloriam* ✠

**For the Greater Glory of God**
