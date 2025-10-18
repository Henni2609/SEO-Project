# How to Use Your SEO Analyzer

## Important: Two Different URLs

You have **TWO different servers running**:

### 1. The SEO Analyzer App (What You Use)
**URL:** `http://localhost:5173`
- This is the purple gradient interface
- This is where you ENTER URLs to analyze
- This is the React application

### 2. The Test Page (What You Analyze)
**URL:** `http://localhost:8000`
- This is the simple HTML page
- This is what you will ANALYZE using the app above
- This is just sample content

## Step-by-Step Instructions:

### Step 1: Open the SEO Analyzer App
1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. In the address bar, type: `http://localhost:5173`
3. Press Enter
4. You should see:
   - Purple gradient background
   - Title: "SEO Analyzer"
   - Subtitle: "Analyze your website's SEO and get actionable recommendations"
   - A white box with a URL input field
   - An "Analyze" button

### Step 2: Test with the Local Test Page
1. In the URL input field, type: `http://localhost:8000`
2. Click the "Analyze" button
3. Wait for the analysis (you'll see "Analyzing your website...")
4. View your results!

### Step 3: Try Other Websites
You can also analyze any public website:
- `https://example.com`
- `https://google.com`
- `https://github.com`
- Any other website URL

## Troubleshooting:

### If you see a blank white page at localhost:5173:
1. Press F12 to open Developer Tools
2. Click the "Console" tab
3. Look for any red error messages
4. Try refreshing the page (Ctrl+R or Cmd+R)

### If you can't connect to localhost:5173:
1. Check that the frontend server is running
2. Look for the message "Local: http://localhost:5173/" in your terminal

### If the analysis fails:
1. Make sure you entered a complete URL with http:// or https://
2. Check that the backend server is running on port 5000
3. Make sure you have internet connection (for external websites)

## What You Should See:

### Before Analysis:
- Purple gradient background
- White input box in the center
- URL field and Analyze button

### During Analysis:
- Loading spinner
- "Analyzing your website..." message

### After Analysis:
- Overall SEO Score (0-100) in white box with purple background
- 6 category cards showing:
  - Meta Tags
  - Headings
  - Content
  - Technical SEO
  - Images
  - Links
- Recommendations section with colored priority badges
- Technical Details grid at the bottom
- "New Analysis" button at the top right

## Need Help?
- Make sure ALL three servers are running
- Check terminal for any error messages
- Try refreshing the browser page
- Clear browser cache if needed
