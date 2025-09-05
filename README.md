# AdSpark AI - Complete PRD Implementation

**Ignite Your Social Ads: Create, Post, and Optimize in Minutes.**

AdSpark AI is a comprehensive web application that takes a product image and generates multiple engaging ad variations, alongside automated posting and performance insights for TikTok and Instagram.

## 🚀 Features Implemented

### ✅ Core Features
- **AI Ad Generation**: Upload a product image to automatically generate 3-5 distinct ad copy and visual style variations
- **Performance Benchmarking**: Compare performance of different ad variations with detailed analytics
- **Auto-Posting & Scheduling**: Directly schedule and publish ad variations to connected social accounts
- **AI Growth Hacking Insights**: Intelligent recommendations and data analytics on ad performance

### ✅ Technical Implementation
- **Authentication System**: Complete user registration, login, and profile management
- **Database Integration**: Persistent data storage with Supabase
- **AI Services**: OpenAI and ImagineArt API integration for content generation
- **Social Media Integration**: Instagram and TikTok Business API connections
- **Payment System**: Stripe integration with tiered subscription plans
- **State Management**: Zustand for efficient state management
- **Responsive Design**: Mobile-first design with Tailwind CSS

### ✅ Subscription Plans
- **Starter ($19/mo)**: 50 ad generations, 2 social accounts, basic analytics
- **Pro ($49/mo)**: 200 ad generations, 5 social accounts, advanced analytics, auto-posting
- **Agency ($99/mo)**: Unlimited generations, 10 social accounts, team features, white-label

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: Zustand with persistence
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI Services**: OpenAI API, ImagineArt API
- **Payments**: Stripe
- **Social Media**: Instagram Business API, TikTok Business API
- **UI Components**: Lucide React icons, React Hook Form
- **Notifications**: React Hot Toast

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key
- ImagineArt API key
- Stripe account
- Instagram/TikTok Business API credentials

### 1. Clone and Install
```bash
git clone <repository-url>
cd adspark-ai
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Fill in your API keys and configuration:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI API Configuration
VITE_OPENAI_API_KEY=sk-your-openai-api-key

# ImagineArt API Configuration
VITE_IMAGINE_ART_API_KEY=your-imagine-art-api-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Social Media API Configuration
VITE_INSTAGRAM_CLIENT_ID=your-instagram-client-id
VITE_INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
VITE_TIKTOK_CLIENT_ID=your-tiktok-client-id
VITE_TIKTOK_CLIENT_SECRET=your-tiktok-client-secret

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001
```

### 3. Database Setup (Supabase)

Create the following tables in your Supabase project:

```sql
-- Users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'starter',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  product_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad variations table
CREATE TABLE ad_variations (
  ad_variation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE,
  prompt TEXT,
  generated_text TEXT,
  generated_image_url TEXT,
  platform VARCHAR(50),
  style VARCHAR(100),
  status VARCHAR(50) DEFAULT 'generated',
  performance_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social accounts table
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  account_id VARCHAR(255) NOT NULL,
  account_name VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan_id VARCHAR(100),
  status VARCHAR(50),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Storage Setup (Supabase)

Create a storage bucket for product images:
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Set up storage policies
CREATE POLICY "Users can upload their own images" ON storage.objects
FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own images" ON storage.objects
FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### 5. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Development Mode

The application includes mock services for development when API keys are not available:

- **Mock AI Service**: Generates sample ad variations with realistic data
- **Mock Social Media Service**: Simulates posting to social platforms
- **Mock Payment Service**: Simulates Stripe payment flows

To use real APIs, ensure all environment variables are properly configured.

## 📱 Usage

### Getting Started
1. **Sign Up**: Create a new account or sign in with existing credentials
2. **Create Project**: Upload a product image and provide a description
3. **Generate Ads**: AI will create multiple ad variations optimized for different platforms
4. **Connect Social Accounts**: Link your Instagram and TikTok business accounts
5. **Post & Schedule**: Publish ads directly to your social media accounts
6. **Analyze Performance**: Monitor engagement and optimize based on insights

### Demo Credentials
For testing purposes, use:
- **Email**: demo@adspark.ai
- **Password**: demo123

## 🏗 Architecture

### Frontend Structure
```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── Dashboard.jsx    # Main dashboard
│   ├── ProjectCreator.jsx # Project creation
│   └── ...
├── services/            # API service layers
│   ├── supabase.js      # Database operations
│   ├── aiService.js     # AI integrations
│   ├── socialMediaService.js # Social media APIs
│   └── paymentService.js # Stripe integration
├── store/               # State management
│   ├── authStore.js     # Authentication state
│   └── projectsStore.js # Projects state
└── utils/               # Utility functions
```

### Data Flow
1. **Authentication**: Supabase Auth handles user management
2. **Project Creation**: Images uploaded to Supabase Storage, metadata to database
3. **AI Generation**: OpenAI/ImagineArt APIs generate content variations
4. **Social Posting**: Instagram/TikTok APIs handle content publishing
5. **Analytics**: Performance data collected and analyzed
6. **Payments**: Stripe manages subscriptions and billing

## 🚀 Deployment

### Production Checklist
- [ ] Set up production Supabase project
- [ ] Configure production environment variables
- [ ] Set up Stripe webhooks for subscription management
- [ ] Configure social media app permissions
- [ ] Set up domain and SSL certificate
- [ ] Configure CORS settings
- [ ] Set up monitoring and error tracking

### Deployment Options
- **Vercel**: Recommended for easy deployment
- **Netlify**: Alternative static hosting
- **AWS/GCP/Azure**: For custom infrastructure needs

## 🔐 Security Features

- **Authentication**: Secure user authentication with Supabase
- **API Key Management**: Environment-based configuration
- **Data Validation**: Input validation and sanitization
- **CORS Protection**: Proper cross-origin resource sharing setup
- **Rate Limiting**: API usage limits based on subscription tiers

## 📊 Monitoring & Analytics

- **User Analytics**: Track user engagement and feature usage
- **Performance Monitoring**: Monitor API response times and errors
- **Business Metrics**: Track subscription conversions and churn
- **Ad Performance**: Detailed analytics on ad campaign effectiveness

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact support at support@adspark.ai

---

**AdSpark AI** - Transforming social media advertising with the power of AI 🚀
