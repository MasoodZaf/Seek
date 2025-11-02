# Seek Learning Platform - Testing Guide

## Quick Access

**Application URL:** http://localhost:3000

**Default Test Accounts:**
- **Admin Account:**
  - Email: `admin@seek.com`
  - Password: `admin123456`

- **Regular User Account:**
  - Email: `test@seek.com`
  - Password: `test123456`

---

## Prerequisites for Testing

### 1. Required Software
- **Docker Desktop** - Must be running for code execution features
- **MongoDB** - Local instance on port 27017
- **Node.js** - Version 14+ recommended
- **Modern Web Browser** - Chrome, Firefox, Safari, or Edge

### 2. Verify Servers are Running

**Backend Server:**
- URL: http://localhost:5001
- Health Check: http://localhost:5001/health
- API Docs: http://localhost:5001/api-docs

**Frontend Server:**
- URL: http://localhost:3000

**Check Server Status:**
```bash
# Check backend
curl http://localhost:5001/health

# Check frontend
curl http://localhost:3000
```

---

## Complete Testing Checklist

### Phase 1: Authentication & User Management

#### 1.1 Login Testing
- [ ] Open http://localhost:3000
- [ ] Login with admin account (admin@seek.com / admin123456)
- [ ] Verify dashboard loads successfully
- [ ] Check user profile displays correctly in header
- [ ] Test logout functionality
- [ ] Login with test user account (test@seek.com / test123456)

#### 1.2 Navigation Testing
- [ ] Verify sidebar opens/closes on mobile view
- [ ] Test all navigation menu items
- [ ] Check dark mode toggle works correctly
- [ ] Verify theme persists after page refresh

---

### Phase 2: Core Learning Features

#### 2.1 Tutorials Testing

**Tutorial Categories to Test:**
1. **Programming Tutorials** (Sidebar → Tutorials → Programming)
   - [ ] View tutorial list (112 tutorials should be available)
   - [ ] Open a JavaScript tutorial
   - [ ] Open a Python tutorial
   - [ ] Open a Java tutorial
   - [ ] Verify syntax highlighting works
   - [ ] Check code examples display correctly

2. **Database Tutorials** (Sidebar → Tutorials → Database)
   - [ ] View database tutorial list
   - [ ] Open an SQL tutorial
   - [ ] Open a MongoDB tutorial
   - [ ] Test tutorial navigation (next/previous)

**Tutorial Features:**
- [ ] Search functionality works
- [ ] Filter by difficulty (Beginner/Intermediate/Advanced)
- [ ] Filter by category
- [ ] Bookmark tutorials (if implemented)
- [ ] Progress tracking updates correctly

---

#### 2.2 Code Editor & Execution Testing

**Navigate to Practice/Playground:**
- [ ] Click "Practice" in sidebar
- [ ] Code editor loads successfully

**Test Each Language:**

1. **JavaScript:**
```javascript
console.log("Hello from JavaScript!");
const numbers = [1, 2, 3, 4, 5];
console.log("Sum:", numbers.reduce((a, b) => a + b));
```
- [ ] Code executes successfully
- [ ] Output displays correctly
- [ ] Execution time shown

2. **Python:**
```python
print("Hello from Python!")
numbers = [1, 2, 3, 4, 5]
print(f"Sum: {sum(numbers)}")
```
- [ ] Python code executes
- [ ] Output displays correctly

3. **TypeScript:**
```typescript
interface Person {
  name: string;
  age: number;
}
const person: Person = { name: "Developer", age: 25 };
console.log(`Hello, ${person.name}! You are ${person.age} years old.`);
```
- [ ] TypeScript code compiles and runs
- [ ] Type checking works

4. **Java:**
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int num : numbers) sum += num;
        System.out.println("Sum: " + sum);
    }
}
```
- [ ] Java code compiles and runs
- [ ] Output displays correctly

5. **C++:**
```cpp
#include <iostream>
#include <vector>
#include <numeric>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    vector<int> numbers = {1, 2, 3, 4, 5};
    int sum = accumulate(numbers.begin(), numbers.end(), 0);
    cout << "Sum: " << sum << endl;
    return 0;
}
```
- [ ] C++ code compiles and runs
- [ ] Output displays correctly

**Additional Languages to Test:**
- [ ] C
- [ ] Go
- [ ] Rust
- [ ] C#
- [ ] PHP
- [ ] Ruby
- [ ] Kotlin

**Code Editor Features:**
- [ ] Syntax highlighting works for all languages
- [ ] Line numbers display correctly
- [ ] Code indentation works
- [ ] Copy/Paste functionality
- [ ] Clear output button works
- [ ] Language selector works
- [ ] Error messages display for invalid code

---

#### 2.3 Code Translation Testing

**Navigate to Code Translator:**
- [ ] Click "Code Translator" in sidebar
- [ ] Translator interface loads

**Test Translation:**
```javascript
// Source: JavaScript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(fibonacci(10));
```

- [ ] Select source language: JavaScript
- [ ] Select target language: Python
- [ ] Click "Translate"
- [ ] Verify Python code is generated correctly
- [ ] Test translated code executes successfully

**Test Multiple Translations:**
- [ ] JavaScript → Python
- [ ] Python → Java
- [ ] Java → C++
- [ ] TypeScript → JavaScript

---

### Phase 3: Gamification Features

#### 3.1 Coding Challenges

**Navigate to Challenges:**
- [ ] Click "Challenges" in sidebar
- [ ] Challenge list displays

**Test Challenge Flow:**
1. [ ] Select a beginner-level challenge
2. [ ] Read problem description carefully
3. [ ] Write solution in code editor
4. [ ] Submit solution
5. [ ] Verify test cases run
6. [ ] Check if solution passes all tests
7. [ ] View submission results

**Challenge Features:**
- [ ] Filter by difficulty (Easy/Medium/Hard)
- [ ] Filter by category (Arrays, Strings, etc.)
- [ ] Filter by status (Completed/Incomplete)
- [ ] Search challenges by name
- [ ] View challenge statistics
- [ ] View leaderboard (if available)

#### 3.2 Coding Games

**Navigate to Games:**
- [ ] Click "Games" in sidebar
- [ ] Game list displays

**Test Each Game Type:**
1. [ ] Code Quiz games
2. [ ] Algorithm challenges
3. [ ] Debugging games
4. [ ] Speed coding games

**Game Features:**
- [ ] Game starts correctly
- [ ] Timer works (if applicable)
- [ ] Score tracking works
- [ ] Game completes successfully
- [ ] Results display correctly

---

### Phase 4: Advanced Features

#### 4.1 Progress Tracking

**User Dashboard:**
- [ ] View learning progress
- [ ] Check completed tutorials count
- [ ] Check completed challenges count
- [ ] View achievement badges (if available)
- [ ] View learning streak (if available)

#### 4.2 Search Functionality

**Global Search:**
- [ ] Search for "array" - verify results from tutorials
- [ ] Search for "javascript" - verify multiple results
- [ ] Search for "sorting" - verify algorithm tutorials appear
- [ ] Test empty search
- [ ] Test special characters in search

---

### Phase 5: UI/UX Testing

#### 5.1 Responsive Design

**Desktop View (1920x1080):**
- [ ] Sidebar displays correctly
- [ ] Content area is properly sized
- [ ] Code editor is readable
- [ ] Footer displays at bottom

**Tablet View (768x1024):**
- [ ] Sidebar collapses to hamburger menu
- [ ] Content adapts to smaller width
- [ ] Code editor remains functional
- [ ] Touch interactions work

**Mobile View (375x667):**
- [ ] Navigation menu works
- [ ] Code editor is usable
- [ ] Buttons are touch-friendly
- [ ] Text is readable without zooming

#### 5.2 Accessibility Testing

**Keyboard Navigation:**
- [ ] Tab through all interactive elements
- [ ] Press 'Enter' on buttons works
- [ ] Press 'Escape' closes modals
- [ ] Arrow keys work in code editor

**Screen Reader Testing:**
- [ ] Page has proper heading hierarchy
- [ ] Images have alt text
- [ ] Form inputs have labels
- [ ] Error messages are announced

#### 5.3 Theme Testing

**Light Mode:**
- [ ] All text is readable
- [ ] Contrast is sufficient
- [ ] Code syntax highlighting works
- [ ] Footer displays correctly

**Dark Mode:**
- [ ] All text is readable
- [ ] Contrast is sufficient
- [ ] Code syntax highlighting works
- [ ] Footer displays correctly
- [ ] Theme toggle icon changes

#### 5.4 Footer Testing
- [ ] Footer displays on all pages
- [ ] Copyright year shows 2025
- [ ] Developer credit "MBZ Tech and 6 Nerds" displays
- [ ] Heart emoji displays correctly
- [ ] Footer links work (About, Privacy, Terms, Contact)
- [ ] Footer adapts to light/dark mode
- [ ] Footer is responsive on mobile

---

### Phase 6: Performance Testing

#### 6.1 Load Time Testing

**Initial Load:**
- [ ] Homepage loads in < 3 seconds
- [ ] Tutorial page loads in < 2 seconds
- [ ] Code editor loads in < 2 seconds

**Code Execution:**
- [ ] JavaScript executes in < 1 second
- [ ] Python executes in < 2 seconds
- [ ] Java executes in < 3 seconds (includes compilation)
- [ ] C++ executes in < 3 seconds (includes compilation)

#### 6.2 Concurrent User Testing

**Multiple Browser Tabs:**
- [ ] Open 3-5 tabs with different tutorials
- [ ] Switch between tabs - verify state persists
- [ ] Execute code in multiple tabs simultaneously
- [ ] Check for memory leaks

---

### Phase 7: Error Handling

#### 7.1 Invalid Code Testing

**Test Error Messages:**
```javascript
// Syntax error
console.log("Hello World"
```
- [ ] Syntax error displays correctly
- [ ] Error message is helpful

```python
# Runtime error
x = 10 / 0
```
- [ ] Runtime error displays correctly
- [ ] Stack trace shown (if applicable)

#### 7.2 Network Error Testing

**Simulate Network Issues:**
- [ ] Turn off WiFi
- [ ] Try to execute code
- [ ] Verify error message displays
- [ ] Turn WiFi back on
- [ ] Verify app recovers gracefully

#### 7.3 Timeout Testing

**Long-Running Code:**
```javascript
// Infinite loop
while(true) {
    console.log("Running...");
}
```
- [ ] Code times out after 10 seconds
- [ ] Timeout error displays
- [ ] Container is killed properly
- [ ] Next execution works correctly

---

### Phase 8: Security Testing

#### 8.1 Authentication Security

**Test Login Security:**
- [ ] Try login with wrong password - should fail
- [ ] Try login with non-existent user - should fail
- [ ] Check if JWT token is stored securely
- [ ] Verify refresh token functionality

#### 8.2 Code Execution Security

**Test Malicious Code Prevention:**
```javascript
// Try to access file system
const fs = require('fs');
fs.readFileSync('/etc/passwd');
```
- [ ] File system access should be blocked
- [ ] Error message displays

```python
# Try to import restricted modules
import os
os.system('ls -la /')
```
- [ ] System commands should be blocked
- [ ] Container isolation working

---

## Test Scenarios for Different User Roles

### Scenario 1: Complete Beginner

**User Profile:** Never used coding platform before

**Test Flow:**
1. [ ] Register/Login successfully
2. [ ] Navigate to "Tutorials" → "Programming"
3. [ ] Find and open "JavaScript Basics" tutorial
4. [ ] Read tutorial content
5. [ ] Try example code in practice area
6. [ ] Complete first challenge (if available)
7. [ ] Check progress dashboard

### Scenario 2: Intermediate Developer

**User Profile:** Knows one language, learning another

**Test Flow:**
1. [ ] Login
2. [ ] Open Code Translator
3. [ ] Translate JavaScript code to Python
4. [ ] Execute translated Python code
5. [ ] Modify and test variations
6. [ ] Attempt medium-difficulty challenge
7. [ ] Check leaderboard

### Scenario 3: Advanced Programmer

**User Profile:** Experienced developer testing platform

**Test Flow:**
1. [ ] Login
2. [ ] Jump to hard challenges
3. [ ] Test multiple language solutions
4. [ ] Use advanced features (if available)
5. [ ] Check performance metrics
6. [ ] Provide feedback

---

## Bug Reporting Template

When you find a bug, please report it with this format:

```
**Bug Title:** [Short description]

**Environment:**
- Browser: [Chrome/Firefox/Safari/Edge]
- OS: [Windows/Mac/Linux]
- Screen Size: [Desktop/Tablet/Mobile]

**Steps to Reproduce:**
1. Go to [page]
2. Click on [element]
3. Enter [data]
4. See error

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[Attach screenshots if possible]

**Console Errors:**
[Copy any browser console errors]

**Severity:**
- [ ] Critical (App broken)
- [ ] High (Major feature broken)
- [ ] Medium (Minor feature issue)
- [ ] Low (Cosmetic issue)
```

---

## Performance Benchmarks

### Expected Performance Metrics

**Page Load Times:**
- Homepage: < 2 seconds
- Tutorial page: < 2 seconds
- Code editor: < 1 second

**Code Execution Times:**
- Interpreted languages (JS, Python): < 2 seconds
- Compiled languages (Java, C++): < 5 seconds
- Complex algorithms: < 10 seconds

**API Response Times:**
- GET requests: < 500ms
- POST requests: < 1 second
- Code execution: < 10 seconds

---

## Test Coverage Goals

**Target Coverage:**
- [ ] Authentication: 100%
- [ ] Tutorial System: 100%
- [ ] Code Execution: 100%
- [ ] Code Translation: 90%
- [ ] Challenges: 90%
- [ ] Games: 80%
- [ ] UI Components: 80%

---

## Additional Testing Tools

### Browser DevTools Testing

**Console Tab:**
```javascript
// Check for errors
// Should see no red errors during normal usage
```

**Network Tab:**
- [ ] Check API response times
- [ ] Verify no 404 errors
- [ ] Check payload sizes

**Performance Tab:**
- [ ] Record page load
- [ ] Check for memory leaks
- [ ] Verify FPS during animations

### Lighthouse Audit

**Run Lighthouse:**
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select all categories
4. Click "Generate report"

**Target Scores:**
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80

---

## Common Issues & Solutions

### Issue 1: Code Won't Execute

**Symptoms:** Code submission hangs or times out

**Solutions:**
- Check if Docker is running
- Verify backend server is running on port 5001
- Check browser console for errors
- Try refreshing the page

### Issue 2: Login Fails

**Symptoms:** Cannot login with correct credentials

**Solutions:**
- Clear browser cookies/cache
- Check if backend server is running
- Verify MongoDB is running
- Check browser console for errors

### Issue 3: Tutorials Not Loading

**Symptoms:** Tutorial list is empty

**Solutions:**
- Check backend logs for database connection
- Verify MongoDB has tutorial data
- Check network tab for API errors
- Try hard refresh (Ctrl+Shift+R)

### Issue 4: Dark Mode Not Working

**Symptoms:** Theme toggle doesn't change appearance

**Solutions:**
- Clear localStorage
- Refresh page
- Check browser console for errors

---

## Testing Sign-off

**Tester Name:** ___________________
**Date:** ___________________
**Testing Duration:** ___________________

**Overall Results:**
- Total Tests: _____
- Passed: _____
- Failed: _____
- Blocked: _____

**Critical Issues Found:** _____
**High Issues Found:** _____
**Medium Issues Found:** _____
**Low Issues Found:** _____

**Recommendation:**
- [ ] Ready for Production
- [ ] Minor Fixes Required
- [ ] Major Fixes Required
- [ ] Not Ready

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

## Post-Testing Checklist

After completing all tests:

- [ ] Document all bugs found
- [ ] Prioritize bugs by severity
- [ ] Create GitHub issues for bugs (if using GitHub)
- [ ] Share test results with development team
- [ ] Schedule regression testing after fixes
- [ ] Update this testing guide if needed

---

## Contact for Testing Support

**Project Lead:** MBZ Tech and 6 Nerds

**For Questions:**
- Check `README.md` for setup instructions
- Check `DEPLOYMENT.md` for deployment info
- Check `PRODUCTION_IMPROVEMENTS.md` for production features
- Check `AI_FEATURES_GUIDE.md` for AI features (coming soon)

---

**Document Version:** 1.0
**Last Updated:** October 29, 2025
**Status:** Production Ready - 100%

---

## Quick Test Commands

```bash
# Start both servers (from project root)
cd backend && npm start &
cd frontend && npm start &

# Run backend tests
cd backend && npm test

# Check backend health
curl http://localhost:5001/health

# Check API documentation
open http://localhost:5001/api-docs

# Open application
open http://localhost:3000

# Stop all servers
pkill -f "node server.js"
pkill -f "react-scripts"
```

---

**Happy Testing! 🚀**
