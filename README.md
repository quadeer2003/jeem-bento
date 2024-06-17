<h1 align="center">🍱 Jeem Bento</h1>

<p align="center">
 Your customizable workspace management and productivity app
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#bento-types"><strong>Bento Types</strong></a> ·
  <a href="#api-setup"><strong>API Setup</strong></a>
</p>
<br/>

<p align="center">
  <strong>Organize Everything In One Beautiful Bento Grid</strong><br/>
  A customizable bento grid workspace that adapts to your workflow. Drag, drop, and design your perfect productivity environment.
</p>
<br/>

## ✨ Features

### 🎨 Beautiful Landing Page
- Modern, responsive landing page with interactive grid background
- Smooth animations and transitions
- Dark mode support
- Call-to-action sections for sign up and sign in

### 📦 Bento Grid Layout
- **Drag & Drop**: Effortlessly rearrange your bentos with intuitive functionality
- **Responsive Design**: Beautiful grid that adapts to any screen size
- **Customizable**: Resize and position bentos exactly how you want them
- **Glassmorphism Effects**: Modern UI with backdrop blur and transparency

### 🔧 Built With
- [Next.js 14](https://nextjs.org) - React framework with App Router
- [Supabase](https://supabase.com) - Authentication and database
- [Tailwind CSS](https://tailwindcss.com) - Utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [BlockNote](https://www.blocknotejs.org/) - Rich text editor for notes
- [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout) - Draggable grid system

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v18 or higher)
2. **pnpm** (recommended) or npm/yarn
3. A **Supabase account** - Create one at [supabase.com](https://supabase.com)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd jeem-bento
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a Supabase project at [database.new](https://database.new)

4. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_NINJAS_KEY=your_api_ninjas_key
   ```

   Get your Supabase credentials from your [project's API settings](https://app.supabase.com/project/_/settings/api)

5. Run the database migrations (found in the SQL files in the project root)

6. Start the development server:
   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Bento Types

Jeem Bento supports multiple types of customizable widgets:

### 📝 Productivity
- **Notes**: Rich text editor with BlockNote for capturing thoughts and ideas
- **Pomodoro Timer**: Productivity timer with customizable work and break periods
- **Quick Mail**: Add contacts and quickly open Gmail with pre-filled recipients

### 🔗 Organization
- **Links**: Quick access to your favorite websites with custom backgrounds
- **Contacts**: Manage and organize your important contacts
- **Websites**: Bookmark and categorize frequently visited sites

### 🎨 Widgets
- **Photo**: Display your favorite images
- **Calendar**: Embedded calendar integration
- **YouTube**: Embedded YouTube videos
- **Quote of the Day**: Random inspirational quotes (powered by API-Ninjas)
- **Weather**: Current weather information for any location (powered by Open-Meteo)
- **Screenshots**: Quick access to saved screenshots

## 🔑 API Setup

### Required APIs

1. **API-Ninjas (Quote of the Day)**
   - Sign up at [api-ninjas.com](https://api-ninjas.com/)
   - Get your API key from the dashboard
   - Add to `.env.local` as `NEXT_PUBLIC_API_NINJAS_KEY`

### Free APIs (No Key Required)

- **Open-Meteo (Weather)**: Free weather API, no registration needed

### Database Schema

Run the following SQL to update your Supabase database:

```sql
ALTER TABLE bento_items 
  DROP CONSTRAINT IF EXISTS bento_items_type_check;

ALTER TABLE bento_items 
  ADD CONSTRAINT bento_items_type_check 
  CHECK (type IN ('photo', 'calendar', 'youtube', 'links', 'screenshots', 'contacts', 'websites', 'pomodoro', 'quote', 'quickmail', 'weather', 'notes'));
```

## 🎨 Customization

- **Themes**: Built-in dark mode support with theme switcher
- **Layouts**: Fully customizable grid layouts saved per workspace
- **Colors**: Gradient backgrounds and customizable color schemes
- **Sizes**: Resize bentos to fit your workflow

## 📱 Usage

1. **Create an Account**: Sign up from the landing page
2. **Create a Workspace**: Start with a default workspace or create a new one
3. **Add Bentos**: Click "Add Bento" and choose from various types
4. **Customize**: Drag, drop, resize, and configure each bento
5. **Enjoy**: Your personalized workspace is automatically saved

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

<p align="center">Made with ❤️ by the Jeem Bento team</p>
