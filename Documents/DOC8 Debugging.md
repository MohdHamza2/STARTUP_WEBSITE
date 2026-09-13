DOCUMENT 8 — DEBUG THE APPLICATION
What it does
This document defines the complete debugging methodology for the project.
The purpose of debugging is to make the AI/developer find the actual root cause of a problem instead of randomly changing code until something appears to work.
The core principle from the reference is:
Don't guess. Find the root cause, explain why it happens, provide the smallest appropriate fix, and verify it.
Debugging must be performed systematically for every feature and every bug, regardless of whether the problem occurs in the frontend, backend, database, API, browser, file upload, animation, responsive UI, authentication, or deployment.
________________________________________
1. CORE DEBUGGING RULE
NEVER RANDOMLY CHANGE CODE TO MAKE AN ERROR DISAPPEAR.
When an error occurs:
Error
 ↓
Observe the problem
 ↓
Identify expected behavior
 ↓
Identify actual behavior
 ↓
Collect the error
 ↓
Inspect relevant code
 ↓
Reproduce the problem
 ↓
Find root cause
 ↓
Understand why it happens
 ↓
Determine smallest correct fix
 ↓
Implement fix
 ↓
Verify the fix
 ↓
Retest the feature
 ↓
Run regression testing
 ↓
Confirm no new bugs
Only after this process should the issue be considered resolved.
________________________________________
2. DEBUGGING INPUT
Whenever debugging is required, provide the debugging process with the following information whenever available:
Expected:
[EXPECTED BEHAVIOR]

Actual:
[ACTUAL BEHAVIOR]

Error:
[ERROR MESSAGE]

Code:
[RELEVANT CODE]

Steps to Reproduce:
[STEPS]

Environment:
[Browser / OS / Development / Production]

Recent Changes:
[WHAT WAS CHANGED BEFORE THE BUG APPEARED]
The AI/developer must use this information to investigate the issue.
________________________________________
3. EXPECTED VS ACTUAL
The first step is always to establish the difference between what should happen and what actually happens.
Example
Expected:

User submits the recruiting form and receives
a successful confirmation.

Actual:

User clicks Submit and the form remains stuck
on the loading state.
The debugging process should focus on explaining:
Why is the actual behavior different from the expected behavior?
________________________________________
4. REPRODUCE THE BUG
Before changing code, reproduce the problem.
Example:
1. Open recruiting page.
2. Enter valid candidate information.
3. Upload a valid resume.
4. Click Submit.
5. Observe loading state.
6. Confirm that the form never completes.
If the bug cannot be reproduced, investigate:
•	Environment differences
•	Browser differences
•	User input differences
•	Network conditions
•	Timing/race conditions
•	Previously changed code
•	Configuration/environment variables
Do not assume the problem has disappeared simply because it cannot immediately be reproduced.
________________________________________
5. COLLECT EVIDENCE
Before modifying code, inspect the available evidence.
Check:
Frontend
•	Browser console
•	Network requests
•	React/Next.js errors
•	Component state
•	Form state
•	Loading state
•	Client-side validation
Backend
•	Server logs
•	API response
•	HTTP status code
•	Request payload
•	Response payload
•	Exception/stack trace
Database
•	Query errors
•	Connection errors
•	Schema problems
•	Constraints
•	Missing records
•	Incorrect data
File uploads
•	File validation
•	File size
•	File type
•	Storage response
•	Upload API response
Browser
•	Console
•	Network tab
•	Rendering problems
•	JavaScript errors
•	Failed resources
________________________________________
6. FIND THE ROOT CAUSE
The objective is not simply to identify where the error appears.
The objective is to identify why it happens.
For example:
Surface symptom:
Form is stuck loading.

Possible cause:
API isn't returning a response.

Investigate:
Why isn't API returning?

Possible cause:
Database query failed.

Investigate:
Why did database query fail?

Root cause:
Database field name does not match
the application schema.
The final fix should address:
Root Cause
rather than merely hiding:
Visible Symptom
________________________________________
7. DO NOT GUESS
The AI/developer must not respond to an error with assumptions such as:
"Maybe this will fix it."

"Let's try changing this."

"Let's rewrite the whole component."

"Let's upgrade everything."

"Let's reinstall all dependencies."
without first establishing why the problem exists.
Instead:
Evidence
 ↓
Hypothesis
 ↓
Verify hypothesis
 ↓
Root cause
 ↓
Fix
A hypothesis is acceptable, but it must be tested against evidence.
________________________________________
8. SMALLEST APPROPRIATE FIX
Once the root cause is identified, implement the smallest correct fix.
Do not unnecessarily rewrite unrelated code.
Example
If the bug is:
API expects:
phoneNumber
but frontend sends:
phone
Do not rewrite:
•	The entire form
•	API architecture
•	Database
•	Authentication
•	UI components
Instead, correct the mismatch at the appropriate layer.
________________________________________
9. PRESERVE EXISTING ARCHITECTURE
Debugging must respect the existing project architecture.
Before changing code:
•	Understand the existing implementation.
•	Identify dependencies.
•	Understand data flow.
•	Identify affected components.
•	Identify related APIs.
•	Identify database interactions.
•	Determine whether other features depend on the code.
Do not introduce an entirely new architecture merely because debugging an existing implementation is inconvenient.
________________________________________
10. DEBUGGING FRONTEND ISSUES
For frontend bugs, inspect the flow:
User Interaction
      ↓
Component
      ↓
State
      ↓
Validation
      ↓
API Request
      ↓
API Response
      ↓
State Update
      ↓
UI
Determine exactly where the flow breaks.
Examples:
•	Button does nothing.
•	Form doesn't submit.
•	Loading indicator never disappears.
•	Error message doesn't appear.
•	Data isn't displayed.
•	Animation breaks.
•	Navigation fails.
•	Mobile layout overflows.
________________________________________
11. DEBUGGING API ISSUES
When an API fails, investigate:
Frontend Request
      ↓
Request URL
      ↓
HTTP Method
      ↓
Request Headers
      ↓
Request Body
      ↓
Server Route
      ↓
Validation
      ↓
Business Logic
      ↓
Database/External Service
      ↓
Response
Check each stage instead of immediately modifying the API.
Determine:
•	Was the request actually sent?
•	Did it reach the correct endpoint?
•	Was the request body correct?
•	Did validation reject it?
•	Did business logic fail?
•	Did the database fail?
•	Did an external service fail?
•	Was the response handled correctly?
________________________________________
12. DEBUGGING DATABASE ISSUES
For database errors:
Application
 ↓
Database Request
 ↓
Query
 ↓
Schema
 ↓
Constraints
 ↓
Database Response
Investigate:
•	Table/model exists.
•	Field names match.
•	Data types match.
•	Required fields are supplied.
•	Foreign keys are valid.
•	Constraints are satisfied.
•	Database connection works.
•	Query is correctly constructed.
Do not modify the database schema blindly to make one query pass.
________________________________________
13. DEBUGGING FORM ISSUES
For forms, trace the complete flow:
Input
 ↓
Client Validation
 ↓
Submit
 ↓
API Request
 ↓
Server Validation
 ↓
Database
 ↓
Response
 ↓
Success/Error UI
Test:
•	Empty values
•	Invalid values
•	Valid values
•	Optional values
•	Duplicate submission
•	Network failure
•	API failure
•	Database failure
The bug must be located in the actual stage where the failure occurs.
________________________________________
14. DEBUGGING RESUME/FILE UPLOAD
For file upload problems:
File Selection
 ↓
Client Validation
 ↓
Upload Request
 ↓
Server Validation
 ↓
Storage
 ↓
Database Record
 ↓
Response
 ↓
UI Confirmation
Investigate each stage independently.
Possible root causes include:
•	Unsupported file type
•	File-size restriction
•	Incorrect multipart handling
•	Server validation
•	Storage failure
•	Permission problem
•	Incorrect environment configuration
•	Database record failure
•	Incorrect response handling
________________________________________
15. DEBUGGING BROWSER-ONLY BUGS
If something works in development/code but fails in the browser:
Check:
•	Browser console.
•	Network requests.
•	Hydration errors.
•	Client/server component boundaries.
•	Environment variables.
•	Browser-specific behavior.
•	JavaScript errors.
•	CSS/layout.
•	Asset loading.
•	CORS where applicable.
The browser must be treated as an actual testing environment, not merely a visual preview.
________________________________________
16. DEBUGGING ANIMATION & VIDEO
Because this project intentionally uses substantial animations and video effects, these must also be debugged systematically.
If animation fails:
Component
 ↓
Animation trigger
 ↓
Scroll/intersection detection
 ↓
Animation library
 ↓
CSS/transform
 ↓
Browser rendering
Check:
•	Animation trigger.
•	Element visibility.
•	CSS.
•	JavaScript errors.
•	Animation library configuration.
•	Mobile behavior.
•	Reduced-motion behavior.
•	Performance.
Important rule
Never remove an animation simply because it is difficult to debug.
First determine why it fails.
However, if an animation causes:
•	Broken interaction
•	Severe performance issues
•	Content becoming inaccessible
•	Browser instability
then the implementation should be redesigned appropriately.
________________________________________
17. DEBUGGING RESPONSIVE ISSUES
For mobile/tablet bugs:
Desktop works
 ↓
Test mobile
 ↓
Reproduce
 ↓
Inspect viewport
 ↓
Inspect CSS/layout
 ↓
Identify breakpoint/layout issue
 ↓
Fix
 ↓
Test desktop again
 ↓
Test tablet again
 ↓
Test mobile again
Never fix mobile by accidentally breaking desktop.
________________________________________
18. DEBUGGING SECURITY ISSUES
If a security issue is discovered:
1.	Stop treating it as an ordinary UI bug.
2.	Determine the affected surface.
3.	Reproduce safely.
4.	Identify the root cause.
5.	Determine the potential impact.
6.	Apply the smallest secure fix.
7.	Test the fix.
8.	Test related functionality.
9.	Check for similar vulnerabilities elsewhere.
Examples:
•	Sensitive information exposed.
•	Unsafe file upload.
•	Unauthorized API access.
•	Improper validation.
•	Secrets exposed in frontend.
•	Injection vulnerability.
________________________________________
19. DEBUGGING USING LOGS
Logs should be used to understand system behavior.
Useful information includes:
Request received
Request parameters
Validation result
Database operation
External service operation
Response status
Error/exception
However:
NEVER LOG SECRETS OR SENSITIVE INFORMATION.
Do not log:
•	Passwords
•	API keys
•	Private keys
•	Session secrets
•	Authentication tokens
•	Sensitive candidate information unnecessarily
________________________________________
20. AFTER FIXING THE BUG
A fix is not complete immediately after the code changes.
The following cycle is mandatory:
Bug Found
   ↓
Root Cause Identified
   ↓
Fix Implemented
   ↓
Verify Fix
   ↓
Reproduce Original Scenario
   ↓
Confirm Expected Result
   ↓
Test Edge Cases
   ↓
Browser Test
   ↓
Regression Test
   ↓
No New Problems
   ↓
Commit
________________________________________
21. REGRESSION AFTER DEBUGGING
Every fix can potentially introduce another problem.
Therefore, after fixing:
First
Retest the exact scenario that originally failed.
Second
Test related functionality.
Third
Test previously completed features that could be affected.
Example:
Resume upload bug
     ↓
Fix upload
     ↓
Test resume upload
     ↓
Test application submission
     ↓
Test candidate database record
     ↓
Test confirmation message
     ↓
Test recruiting page
________________________________________
22. DO NOT FIX UNRELATED CODE
While debugging:
Do not modify unrelated code simply because you noticed it could be improved.
If another issue is discovered:
Current Bug
   ↓
Fix current bug
   ↓
Document unrelated issue
   ↓
Create separate task/issue
This prevents debugging from turning into uncontrolled refactoring.
________________________________________
23. DEBUGGING DOCUMENTATION
Every significant bug should produce a record containing:
Bug ID:
Feature:
Date:
Environment:

Expected:
[Expected behavior]

Actual:
[Actual behavior]

Error:
[Error message]

Steps to Reproduce:
[Steps]

Root Cause:
[Actual technical cause]

Why It Happened:
[Explanation]

Fix:
[What was changed]

Files Changed:
[Files]

Verification:
[How it was tested]

Regression Testing:
[What else was tested]

Status:
Resolved / Unresolved
________________________________________
24. AI DEBUGGING INSTRUCTION
When an AI coding agent is asked to debug the application, it must follow this instruction:
Debug this issue:

Expected:
[EXPECTED]

Actual:
[ACTUAL]

Error:
[ERROR]

Code:
[CODE]

Do not guess.

First reproduce and investigate the problem.

Find the root cause.

Explain:
1. What is happening
2. Why it is happening
3. Where the problem originates
4. What the smallest appropriate fix is

Then implement the fix.

Do not rewrite unrelated code.

After fixing:
1. Verify the original problem is resolved.
2. Test the affected feature.
3. Test relevant edge cases.
4. Test the feature in the browser when applicable.
5. Run relevant regression tests.
6. Report exactly what was changed and how it was verified.

Do not consider the issue resolved until verification passes.
________________________________________
25. COMPLETE DEBUGGING CYCLE FOR THIS PROJECT
The entire project must use:
                    BUG / ERROR
                         ↓
                  Identify Problem
                         ↓
                 Expected vs Actual
                         ↓
                  Reproduce Issue
                         ↓
                 Collect Evidence
                         ↓
                 Inspect Code Flow
                         ↓
                 Find Root Cause
                         ↓
                Explain Why It Happens
                         ↓
              Determine Smallest Fix
                         ↓
                  Implement Fix
                         ↓
                    Verify Fix
                         ↓
                Test Original Scenario
                         ↓
                  Test Edge Cases
                         ↓
                  Browser Testing
                         ↓
                Regression Testing
                         ↓
                  BUG STILL EXISTS?
                    ↙           ↘
                  YES            NO
                   ↓              ↓
             Investigate       Final Verify
                   ↓              ↓
                  Fix          Document
                   ↓              ↓
                Repeat          Commit
                                  ↓
                                DONE
________________________________________
26. RELATIONSHIP WITH DOCUMENTS 5–7
This debugging document works together with the previous development rules.
Document 5 — Build
Build one feature at a time.
↓
Document 6 — Feature Development Cycle
Plan → Verify → Build → Verify → Test → Validate → Fix → Verify → Commit
↓
Document 7 — Testing
Test functionality, browser behavior, edge cases, responsiveness, APIs, database, security, performance, etc.
↓
Document 8 — Debugging
When something fails, don't guess → find the root cause → apply the smallest correct fix → verify → retest → regression test → commit.
________________________________________
27. FINAL DEBUGGING RULES
The following rules are mandatory throughout the project:
1.	Don't guess.
2.	Always reproduce the issue where possible.
3.	Compare expected vs actual behavior.
4.	Collect evidence before changing code.
5.	Find the root cause.
6.	Understand why the problem happens.
7.	Fix the smallest necessary part.
8.	Do not rewrite unrelated code.
9.	Verify the fix.
10.	Retest the original scenario.
11.	Test edge cases.
12.	Test in the browser for website functionality.
13.	Run regression tests after significant fixes.
14.	Never consider a bug fixed merely because the error disappeared once.
15.	Document significant bugs and their fixes.
16.	Do not expose secrets or sensitive information while debugging.
17.	Commit only after the fix has been verified.
The most important principle
Don't guess. Find the root cause, explain why it happens, provide the smallest appropriate fix, and tell how the fix was verified.
