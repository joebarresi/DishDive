# RecipeTok Setup Guide for macOS

Hi there! This guide will walk you through setting up and running the RecipeTok app on your Mac. I've made this guide as straightforward as possible, assuming you're starting with just the Terminal app.

## Step 1: Install Required Tools

First, let's install the tools you'll need:

1. **Open Terminal**
   - Press `Cmd + Space` to open Spotlight Search
   - Type "Terminal" and press Enter

2. **Install Homebrew** (macOS package manager)
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   - Follow any additional instructions shown in the terminal
   - You might need to run a command to add Homebrew to your PATH

3. **Install Node.js and npm**
   ```bash
   brew install node
   ```

4. **Install Git** (if not already installed)
   ```bash
   brew install git
   ```

5. **Verify installations**
   ```bash
   node --version
   npm --version
   git --version
   ```
   All commands should return version numbers, not errors.

## Step 2: Clone the Repository

1. **Create a directory for your projects** (optional)
   ```bash
   mkdir -p ~/Projects
   cd ~/Projects
   ```

2. **Clone the RecipeTok repository**
   ```bash
   git clone https://github.com/jbarresi/RecipeTok.git
   ```
   (Note: Replace with the actual repository URL if different)

3. **Navigate to the project folder**
   ```bash
   cd RecipeTok
   ```
