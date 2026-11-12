# 🛰️ Wireless Network Simulator Dashboard

> **A Web-Based Simulation and Visualization Platform for Wireless Communication Technologies**  
> B.Tech CSE (Cloud Computing) — 7th Semester Capstone Project  
> **Submitted to:** Dr. Neha Sharma  
> **Team Members:** USHA (231302137), ADITYA (231302211), POOJA (231302138), RANURAJ (231302263)

---

## 📌 Overview

Traditional networking education relies heavily on textbooks, static diagrams, and complicated simulation tools. The **Wireless Network Simulator Dashboard** bridges this gap by unifying **Learning, Visualization, Comparison, and Interactive Simulation** into a single modern, fast web application.

---

## ✨ Key Features & Modules

### 1. 📡 Wireless Technology Modules
Detailed educational insights into 4 primary wireless technologies:
- **Cellular Networks (4G / 5G)**: Cellular architecture, base stations, handovers, high mobility.
- **Satellite Networks (GEO / MEO / LEO)**: Space & ground segments, global reach, orbital characteristics.
- **Wireless LAN (Wi-Fi / IEEE 802.11)**: Access Points, MAC/PHY layers, Infrastructure & Ad-hoc modes.
- **Broadcast Networks (Radio & TV)**: One-to-many propagation, AM/FM modulation, digital broadcasting.

### 2. 📊 Interactive Performance Comparison
- Multi-metric comparison: **Coverage, Mobility, Latency, Speed, and Cost**.
- Switch dynamically between **Bar Chart** and **Radar Chart** representations using Chart.js.
- Filter technologies individually to examine relative trade-offs.

### 3. 🗺️ Coverage Map & Range Visualization
- Concentric and overlapping multi-technology coverage zone map.
- Toggle individual technology layers (Wi-Fi 🟢, Cellular 🔵, Broadcast 🟣, Satellite 🟠).
- Hover details providing relative coverage radius and key characteristics.

### 4. 🔄 Ad-hoc Network Simulator (Interactive Node Graph)
- **Node Management**: Add, move (drag-and-drop), and delete mobile device nodes on an SVG canvas.
- **Dynamic Topology**: Connect pairs of devices to establish wireless links.
- **Packet Transmission**: Interactive packet delivery animation using BFS shortest-path routing.
- **Link Breakdown & Re-routing**: Break active connections to visually demonstrate path discovery and resilience.

### 5. 📉 Signal Attenuation Visualizer
- Free-Space Path Loss (FSPL) physics simulation:  
  $$\text{FSPL (dB)} = 20\log_{10}(d) + 20\log_{10}(f) - 147.55$$
- Adjustable transmit power (dBm), operating frequencies (MHz / GHz), and physical obstacles (concrete walls, glass windows).
- Real-time signal strength gradient and distance probing table.

### 6. 📈 Throughput Calculator (Shannon–Hartley Theorem)
- Compute theoretical maximum channel capacity:  
  $$C = B \times \log_2(1 + \text{SNR})$$
- Interactive sliders for channel bandwidth ($B$) and Signal-to-Noise Ratio ($\text{SNR}$).
- Dynamic charts showing Capacity vs. SNR and Capacity vs. Bandwidth with preset profiles (Wi-Fi 6, 4G, 5G mmWave, Satellite).

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Data Visualization**: Chart.js & react-chartjs-2
- **Icons**: React Icons
- **Simulation Layer**: Custom SVG Canvas with real-time vector animations

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/wireless-network-simulator.git
   cd wireless-network-simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
   Production build will be generated in the `dist` folder.

---

## 🌐 Free Deployment Options

- **Vercel**: Import this GitHub repository directly into Vercel. Framework preset will automatically detect Vite.
- **Netlify**: Connect your GitHub repo on Netlify or drag-and-drop the generated `dist` folder at [app.netlify.com/drop](https://app.netlify.com/drop).
- **GitHub Pages**: Deploy the `dist` bundle via GitHub Actions.

---

## 👥 Authors
- **Usha** (231302137)
- **Aditya** (231302211)
- **Pooja** (231302138)
- **Ranuraj** (231302263)  
*Department of Computer Science & Engineering, 7th Semester*
