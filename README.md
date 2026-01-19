# AI Trading Hub Frontend

A production-ready frontend for the AI Trading Hub backend, built with Next.js 14, TypeScript, and Tailwind CSS. Features a comprehensive trading dashboard with AI-powered signals, market analysis, and portfolio management.

## 🚀 Features

- **Real-time AI Signals**: Live trading signals powered by Hybrid PPO + Llama3 engine
- **Advanced Charting**: TradingView integration with technical indicators
- **Stock Screener**: Filter assets by technical indicators and AI signals
- **Portfolio Management**: Watchlist, alerts, and trading journal
- **Backtesting**: Test AI strategies on historical data
- **Market Data**: Real-time prices, market depth, and economic calendar
- **User Management**: Role-based access (Free, Premium, Admin, Owner)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: Zustand
- **API**: Axios with automatic token handling
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: TradingView integration
- **Notifications**: Sonner

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- AI Trading Hub backend running (see backend README)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd arc
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_API_KEY=your_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

### Backend Setup

Make sure your AI Trading Hub backend is running:

```bash
# From the backend directory
cd ../trading-hub-backend
pip install -r requirements.txt
python main.py
```

The backend should be running on `http://localhost:8000`.

## 📱 Available Features

### Dashboard

- Live market signals with AI analysis
- Real-time price updates
- Bandarmology indicators
- Whale activity monitoring

### Asset Search

- Search across stocks and forex pairs
- Real-time signals and market data
- Quick add to watchlist
- Popular symbols shortcuts

### Watchlist Management

- Add/remove favorite assets
- Real-time price tracking
- Signal notifications
- Market data integration

### Alerts System

- Price alerts with custom conditions
- Technical indicator alerts
- Volume alerts
- Telegram notifications

### Advanced Charts

- TradingView integration
- Multiple timeframes
- Technical indicators (RSI, MACD, etc.)
- Market depth visualization
- Bandar line analysis

### Stock Screener

- Filter by technical indicators
- RSI, MACD, and volume filters
- Bandar accumulation detection
- AI signal scoring
- Real-time results

### Trading Journal

- Trade history tracking
- Performance analytics
- Win rate calculations
- Risk management metrics
- P&L analysis

### Backtesting

- Historical strategy testing
- Performance metrics
- Equity curve visualization
- Risk analysis
- Multi-timeframe testing

### Settings

- Balance configuration for money management
- Telegram bot integration
- API key management
- Account preferences

## 🔐 Authentication

The app supports role-based access:

- **Free**: Basic features, limited signals
- **Premium**: Full access to all features
- **Admin**: User management capabilities
- **Owner**: System administration, file management

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Main dashboard layout
│   │   ├── dashboard/          # Main dashboard with signals
│   │   ├── search/            # Asset search
│   │   ├── watchlist/         # Watchlist management
│   │   ├── alerts/            # Alert system
│   │   ├── charts/            # Advanced charting
│   │   ├── screener/          # Stock screener
│   │   ├── journal/           # Trading journal
│   │   ├── backtest/          # Strategy backtesting
│   │   ├── settings/          # User settings
│   │   ├── owner/             # Owner tools (future)
│   │   └── admin/             # Admin panel (future)
│   ├── login/                 # Authentication
│   ├── globals.css            # Global styles
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── dashboard/             # Dashboard-specific components
│   ├── SearchCommand.tsx      # Global search
│   └── AuthGuard.tsx          # Authentication guard
├── lib/
│   ├── api.ts                 # API client configuration
│   ├── store.ts               # Zustand state management
│   └── utils.ts               # Utility functions
└── types/                     # TypeScript type definitions
```

## 🎨 Design System

- **Dark Theme**: Professional trading-focused design
- **Zinc Color Palette**: Consistent UI colors
- **Responsive**: Mobile-first design approach
- **Accessible**: WCAG compliant components
- **Performance**: Optimized loading and rendering

## 🔗 API Integration

The frontend integrates with the AI Trading Hub backend API:

- Authentication: `/auth/login`, `/auth/register`
- Dashboard: `/dashboard/all`
- Market Data: `/market/chart`, `/market/depth`
- User Data: `/user/watchlist`, `/user/settings/*`
- Trading Tools: `/screener/run`, `/backtest/run`, `/alerts/*`
- Admin: `/admin/*`, `/owner/*`

## 🚀 Build & Deploy

### Build for production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Make sure to set the environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the AI Trading Hub system. See LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the backend API documentation
- Review the troubleshooting guide
- Open an issue on GitHub

---

**Built with ❤️ for traders by AI**
