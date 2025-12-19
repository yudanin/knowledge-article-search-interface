/**
 * Mock article data
 * Same data as frontend src/services/mockData.ts
 */

const articles = [
  {
    id: 'art_00000001',
    title: 'How to Process Customer Refunds',
    content: `This article explains the step-by-step process for handling customer refund requests. 
    
**Step 1: Verify the Purchase**
First, locate the customer's order in the system using their email or order number. Verify that the purchase is within the refund eligibility window (typically 30 days).

**Step 2: Check Refund Eligibility**
Review the product's return policy. Some items like digital downloads or personalized products may not be eligible for refunds.

**Step 3: Process the Refund**
If eligible, initiate the refund through the payment system. The refund will be processed to the original payment method within 5-7 business days.

**Step 4: Confirm with Customer**
Send a confirmation email to the customer with the refund details and expected timeline.`,
    category: 'Billing',
    tags: ['refund', 'billing', 'returns', 'customer-service'],
    relevanceScore: 0.95,
    status: 'published',
    createdDate: '2024-01-15T10:00:00Z',
    lastUpdated: '2024-12-01T14:30:00Z',
    viewCount: 1542,
    author: 'system'
  },
  {
    id: 'art_00000002',
    title: 'Troubleshooting Login Issues',
    content: `Common solutions for customers experiencing login problems.

**Password Reset**
If the customer forgot their password, guide them to the "Forgot Password" link on the login page. They'll receive a reset email within 5 minutes.

**Account Locked**
After 5 failed login attempts, accounts are temporarily locked for 30 minutes. If urgent, an admin can unlock the account manually.

**Two-Factor Authentication Issues**
If the customer can't access their 2FA device, they can use backup codes. If those are unavailable, verify their identity and reset 2FA.

**Browser Issues**
Clear cookies and cache, or try a different browser. Ensure JavaScript is enabled.`,
    category: 'Technical Support',
    tags: ['login', 'password', 'authentication', '2fa', 'troubleshooting'],
    relevanceScore: 0.88,
    status: 'published',
    createdDate: '2024-02-20T09:15:00Z',
    lastUpdated: '2024-11-15T11:00:00Z',
    viewCount: 2103,
    author: 'system'
  },
  {
    id: 'art_00000003',
    title: 'Subscription Plan Comparison Guide',
    content: `Overview of available subscription plans and their features.

**Basic Plan - $9.99/month**
- Up to 100 searches per day
- Email support
- Basic analytics

**Professional Plan - $29.99/month**
- Unlimited searches
- Priority email & chat support
- Advanced analytics
- API access

**Enterprise Plan - Custom Pricing**
- Everything in Professional
- Dedicated account manager
- Custom integrations
- SLA guarantees
- On-premise deployment option

**Upgrade Process**
Customers can upgrade anytime. The price difference is prorated for the current billing cycle.`,
    category: 'Billing',
    tags: ['subscription', 'plans', 'pricing', 'upgrade', 'features'],
    relevanceScore: 0.82,
    status: 'published',
    createdDate: '2024-03-10T08:00:00Z',
    lastUpdated: '2024-10-20T16:45:00Z',
    viewCount: 987,
    author: 'system'
  },
  {
    id: 'art_00000004',
    title: 'Setting Up Email Notifications',
    content: `How to configure email notification preferences for customers.

**Accessing Notification Settings**
Navigate to Account Settings > Notifications. All email preferences can be managed from this single page.

**Available Notifications**
- Order confirmations (enabled by default)
- Shipping updates
- Promotional emails
- Newsletter
- Security alerts (cannot be disabled)

**Frequency Options**
- Instant: Receive emails as events occur
- Daily digest: One summary email per day
- Weekly digest: One summary email per week

**Troubleshooting**
If customers aren't receiving emails, check spam folders first. Also verify the email address is correct in their profile.`,
    category: 'Account Management',
    tags: ['email', 'notifications', 'settings', 'preferences'],
    relevanceScore: 0.75,
    status: 'published',
    createdDate: '2024-04-05T13:20:00Z',
    lastUpdated: '2024-09-18T10:30:00Z',
    viewCount: 654,
    author: 'system'
  },
  {
    id: 'art_00000005',
    title: 'Handling Escalated Customer Complaints',
    content: `Best practices for managing escalated customer issues.

**When to Escalate**
Escalate when: customer requests a supervisor, issue requires policy exception, customer is extremely dissatisfied, or issue involves legal/compliance concerns.

**Escalation Process**
1. Acknowledge the customer's frustration
2. Document the complete issue history
3. Transfer to Team Lead with full context
4. Follow up within 24 hours

**De-escalation Techniques**
- Listen actively without interrupting
- Empathize with their situation
- Focus on solutions, not blame
- Offer concrete next steps with timelines

**Documentation Requirements**
Log all escalations in the CRM with: reason for escalation, customer sentiment, resolution offered, and outcome.`,
    category: 'Customer Service',
    tags: ['escalation', 'complaints', 'conflict-resolution', 'best-practices'],
    relevanceScore: 0.91,
    status: 'published',
    createdDate: '2024-05-12T11:45:00Z',
    lastUpdated: '2024-12-10T09:00:00Z',
    viewCount: 1876,
    author: 'system'
  },
  {
    id: 'art_00000006',
    title: 'Product Return Shipping Labels',
    content: `How to generate and send return shipping labels to customers.

**Generating a Return Label**
1. Open the order in the admin panel
2. Click "Create Return"
3. Select items being returned
4. Choose shipping carrier (UPS default)
5. Click "Generate Label"

**Sending to Customer**
Labels can be sent via:
- Email (automatic with return confirmation)
- SMS link
- Customer can print from their account

**Label Costs**
- Defective items: Company covers shipping
- Change of mind: Customer pays (deducted from refund)
- Wrong item sent: Company covers shipping + $10 credit

**Tracking Returns**
All return shipments are automatically tracked. Status updates appear in the order history.`,
    category: 'Shipping',
    tags: ['returns', 'shipping', 'labels', 'logistics'],
    relevanceScore: 0.79,
    status: 'published',
    createdDate: '2024-06-08T14:00:00Z',
    lastUpdated: '2024-11-28T13:15:00Z',
    viewCount: 1234,
    author: 'system'
  },
  {
    id: 'art_00000007',
    title: 'API Integration Quick Start Guide',
    content: `Getting started with our REST API for developers.

**Authentication**
All API requests require an API key in the header:
Authorization: Bearer YOUR_API_KEY

**Base URL**
Production: https://api.example.com/v1
Sandbox: https://sandbox-api.example.com/v1

**Rate Limits**
- Basic: 100 requests/minute
- Professional: 1000 requests/minute
- Enterprise: Custom limits

**Common Endpoints**
- GET /articles - List all articles
- GET /articles/{id} - Get single article
- POST /search - Search articles
- GET /categories - List categories

**Error Handling**
All errors return JSON with 'code' and 'message' fields. HTTP status codes follow REST conventions.`,
    category: 'Technical Support',
    tags: ['api', 'integration', 'developers', 'technical'],
    relevanceScore: 0.72,
    status: 'published',
    createdDate: '2024-07-22T10:30:00Z',
    lastUpdated: '2024-12-05T15:00:00Z',
    viewCount: 432,
    author: 'system'
  },
  {
    id: 'art_00000008',
    title: 'Managing Multiple User Accounts',
    content: `Guide for customers who need to manage multiple accounts.

**Account Linking**
Customers can link up to 5 accounts under one primary account. This allows single sign-on across all linked accounts.

**How to Link Accounts**
1. Log into the primary account
2. Go to Settings > Linked Accounts
3. Click "Link New Account"
4. Enter credentials for the account to link
5. Verify via email confirmation

**Switching Between Accounts**
Use the account switcher in the top-right corner. No need to log out and back in.

**Permissions**
The primary account holder can set permissions for linked accounts:
- Full access
- View only
- Limited features

**Unlinking Accounts**
Accounts can be unlinked at any time from the Linked Accounts page.`,
    category: 'Account Management',
    tags: ['accounts', 'multi-user', 'linking', 'permissions'],
    relevanceScore: 0.68,
    status: 'published',
    createdDate: '2024-08-14T09:00:00Z',
    lastUpdated: '2024-10-30T11:45:00Z',
    viewCount: 567,
    author: 'system'
  },
  {
    id: 'art_00000009',
    title: 'Holiday Season Support Guidelines',
    content: `Special procedures for high-volume holiday support periods.

**Peak Season Dates**
- Black Friday through Cyber Monday
- December 15-31
- Post-holiday returns (Jan 1-15)

**Extended Hours**
Support is available 24/7 during peak periods. Regular hours resume January 16.

**Priority Queue**
During peak times, prioritize:
1. Order issues (missing, damaged)
2. Payment problems
3. Shipping delays
4. General inquiries

**Quick Resolution Tips**
- Offer store credit for faster resolution
- Extend return windows automatically
- Proactive communication for known delays

**Escalation Threshold**
Lower escalation threshold during holidays. When in doubt, escalate to preserve customer satisfaction.`,
    category: 'Customer Service',
    tags: ['holiday', 'seasonal', 'high-volume', 'procedures'],
    relevanceScore: 0.85,
    status: 'published',
    createdDate: '2024-09-01T08:00:00Z',
    lastUpdated: '2024-12-12T10:00:00Z',
    viewCount: 2341,
    author: 'system'
  },
  {
    id: 'art_00000010',
    title: 'Data Privacy and GDPR Compliance',
    content: `Understanding customer data rights and privacy compliance.

**Customer Rights Under GDPR**
- Right to access their data
- Right to correction
- Right to deletion ("right to be forgotten")
- Right to data portability
- Right to object to processing

**Data Access Requests**
When a customer requests their data:
1. Verify identity (government ID required)
2. Submit request to Privacy team
3. Response within 30 days (legally required)

**Deletion Requests**
Some data must be retained for legal reasons (tax records, fraud prevention). Explain what can and cannot be deleted.

**Data Breach Protocol**
If you suspect a data breach:
1. Do NOT discuss with customer
2. Immediately notify Security team
3. Document everything
4. Security team handles communication`,
    category: 'Compliance',
    tags: ['gdpr', 'privacy', 'data', 'compliance', 'legal'],
    relevanceScore: 0.77,
    status: 'published',
    createdDate: '2024-10-05T12:00:00Z',
    lastUpdated: '2024-12-08T14:20:00Z',
    viewCount: 891,
    author: 'system'
  },
  {
    id: 'art_00000011',
    title: 'Mobile App Troubleshooting',
    content: `Common issues and solutions for the mobile application.

**App Won't Open**
- Force close and reopen
- Check for app updates
- Clear app cache (Settings > Apps > Our App > Clear Cache)
- Reinstall if issues persist

**Sync Issues**
Data may take up to 5 minutes to sync between mobile and web. Pull down to refresh to force sync.

**Push Notifications Not Working**
1. Check device notification settings
2. Ensure notifications enabled in app settings
3. Check Do Not Disturb mode
4. Verify internet connection

**Slow Performance**
- Close other apps
- Ensure sufficient storage (minimum 500MB free)
- Update to latest OS version
- Check internet connection speed`,
    category: 'Technical Support',
    tags: ['mobile', 'app', 'troubleshooting', 'ios', 'android'],
    relevanceScore: 0.83,
    status: 'published',
    createdDate: '2024-11-01T10:00:00Z',
    lastUpdated: '2024-12-14T09:30:00Z',
    viewCount: 1567,
    author: 'system'
  },
  {
    id: 'art_00000012',
    title: 'Gift Card Purchase and Redemption',
    content: `Complete guide to gift card processes.

**Purchasing Gift Cards**
- Available in $25, $50, $100, and custom amounts
- Digital delivery via email (instant)
- Physical cards ship within 3-5 business days

**Redemption Process**
1. Go to checkout
2. Click "Apply Gift Card"
3. Enter 16-digit code
4. Remaining balance applied to order

**Balance Check**
Customers can check balance at: account page, checkout, or by contacting support.

**Common Issues**
- Code already used: Check order history for previous redemption
- Code invalid: Verify code entered correctly, check for expiration
- Partial balance: Gift cards can be used across multiple orders

**Expiration**
Gift cards expire 2 years from purchase date. Balance cannot be restored after expiration.`,
    category: 'Billing',
    tags: ['gift-card', 'payment', 'redemption', 'balance'],
    relevanceScore: 0.71,
    status: 'published',
    createdDate: '2024-11-15T11:30:00Z',
    lastUpdated: '2024-12-10T16:00:00Z',
    viewCount: 723,
    author: 'system'
  }
];

const categories = [
  { id: 'cat_billing', name: 'Billing', description: 'Payment, refunds, and subscription issues', articleCount: 4 },
  { id: 'cat_technical', name: 'Technical Support', description: 'Technical troubleshooting and how-to guides', articleCount: 3 },
  { id: 'cat_customer', name: 'Customer Service', description: 'Customer interaction best practices', articleCount: 2 },
  { id: 'cat_account', name: 'Account Management', description: 'Account settings and user management', articleCount: 2 },
  { id: 'cat_shipping', name: 'Shipping', description: 'Shipping and logistics', articleCount: 1 },
  { id: 'cat_compliance', name: 'Compliance', description: 'Legal and regulatory compliance', articleCount: 1 }
];

module.exports = { articles, categories };
