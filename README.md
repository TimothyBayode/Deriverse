# Deriverse

**Deriverse** is an analytical tool built for traders on the **Solana Devnet** (for now).
It helps traders monitor performance, track trade history, maintain journals, analyze win/loss rates, calculate PnL, and gain deeper insight into their trading behavior.

---

## Overview

Trading without analytics is guessing.

Deriverse provides traders with a structured dashboard to:

* Monitor trade history
* Track Profit & Loss (PnL)
* Calculate win/lose rates
* Maintain trading journals
* Analyze performance trends
* Review trading behavior over time

Currently, Deriverse operates on **Solana Devnet**, making it ideal for testing strategies and analyzing trades in a development environment.

---

## Wallet Integration

Deriverse includes a fully functional **wallet connection system**.

Wallet connection works 100%
Users can successfully connect and authenticate via supported Solana wallets

This lays the foundation for real-time trade tracking once live data integration is available.

---

## Current Data Handling

At the moment, Deriverse uses **mock data** for analytics and dashboard visualization.

### Why?

The current documentation does not provide a public API endpoint to fetch trade data directly from Deriverse.

However:

* The system architecture is built to support dynamic data
* The mock data structure mirrors expected real API responses
* Integration can be implemented seamlessly once an official endpoint is available

When an API endpoint is provided, it can be easily integrated into the existing data-fetching logic for full real-time functionality.

---

## Tech Stack

* **Frontend:** React, Vite, Tailwind
* **Blockchain:** Solana Devnet
* **Wallet Integration:** Solana Wallet Adapter
* **Styling:** (Tailwind, CSS, etc.)

---

## Planned Enhancements

* Live trade data integration (once API endpoint is available)
* Advanced analytics & visual charts
* Exportable trade reports
* Strategy performance breakdown
* Mainnet support

---

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/deriverse.git

# Navigate into the project
cd deriverse

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Development Environment

Deriverse currently operates on:

```
Solana Devnet
```

Make sure your wallet is set to Devnet before connecting.

---

## Disclaimer

Deriverse is currently in development and running on Solana Devnet.
All analytics shown are based on mock data until official API integration is available.

This tool does not provide financial advice.

---

## Contributing

Contributions are welcome.

If you'd like to improve the platform:

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Submit a pull request
