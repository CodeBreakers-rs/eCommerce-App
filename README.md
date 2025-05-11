# 🛍️ E-Commerce Project with CommerceTools

## 🌟 Project Overview

**Project Name**: CommerceTools E-Commerce Platform  
**Purpose**: Build a modern e-commerce solution powered by CommerceTools API with robust development workflows  
**Status**: In Development (Sprint 1)  

This project implements a full-featured e-commerce platform using CommerceTools as the backend service. The current sprint focuses on setting up the development environment, project infrastructure, and CommerceTools integration.

## 🏗️ Sprint 1 Focus Areas
- Repository setup and organization
- Project management board configuration
- CommerceTools project and API client setup
- Development environment configuration
- Testing and quality assurance setup

## 🛠 Technology Stack

### Core Infrastructure
- **Version Control**: GitHub
- **Project Management**: [Trello]
- **Package Manager**: npm

### Development Tools
- **Bundler**: Vite
- **Language**: TypeScript
- **Framework**: React
- **Linting**: ESLint
- **Formatting**: Prettier
- **Git Hooks**: Husky
- **Testing**: Vitest

### CommerceTools Integration
- **API Client**: CommerceTools SDK
- **Authentication**: OAuth 2.0
- **Data Model**: products, carts, orders

## 🚀 Getting Started

### Prerequisites
- Node.js v22+
- CommerceTools account with admin access
- GitHub account

### Installation

1. **Clone the repository**: https://github.com/CodeBreakers-rs/eCommerce-App.git
   2. cd eCommerce-App
   3. Install dependencies: npm install
   4. Set up environment variables: create .env file based on .env.example
   5. Then fill in your CommerceTools credentials: 
   CT_PROJECT_KEY=your_project_key
   CT_CLIENT_ID=your_client_id
   CT_CLIENT_SECRET=your_client_secret
   CT_API_URL=https://api.europe-west1.gcp.commercetools.com
   CT_AUTH_URL=https://auth.europe-west1.gcp.commercetools.com
   6. npm run dev