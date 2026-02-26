# Email Notification System

## Overview

Civic Pulse now includes a **non-recursive email notification system** using Nodemailer. This ensures that when actions occur at one level, only the **immediate next level** is notified via email.

## Email Flow (Non-Recursive)

### 1. **Operator Actions → Email to Department**
- ✅ Operator escalates complaint → Department receives email
- ✅ Operator resolves complaint → Department receives email
- ✅ Operator changes status → Department receives email

### 2. **Department Actions → Email to Admin**
- ✅ Department escalates complaint → Admin receives email
- ✅ Department resolves complaint → Admin receives email
- ✅ Department overrides operator's status → Admin receives override alert

### 3. **Admin Actions**
- ❌ Admin cannot escalate (highest level)
- ✅ Admin receives all notifications from Department

## Email Templates

### 1. **Escalation Email** 🚨
Sent when a complaint is escalated to the next level.

**Triggers:**
- Operator escalates → Department
- Department escalates → Admin

**Contains:**
- Complaint ID and details
- Escalation level badge
- Reason for escalation
- Who escalated and from which role
- Call-to-action button

### 2. **Status Update Email** 📊
Sent when complaint status changes.

**Triggers:**
- Operator changes status → Department notified
- Department changes status → Admin notified

**Contains:**
- Complaint ID and title
- Old status → New status (visual transition)
- Who made the change
- Special message for "resolved" status

### 3. **Override Notification Email** 🔄
Sent when Department overrides Operator's work.

**Triggers:**
- Department changes status of complaint assigned to operator → Admin notified

**Contains:**
- Alert that an override occurred
- Original status vs overridden status
- Who performed the override

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# For Development (Ethereal Email - fake SMTP for testing)
ETHEREAL_USER=your-ethereal-user@ethereal.email
ETHEREAL_PASS=your-ethereal-password

# For Production (Real SMTP - Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
EMAIL_FROM=Civic Pulse <noreply@civicpulse.in>

# Application URL (for email links)
APP_URL=http://localhost:3000
```

### Gmail Setup (Production)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an "App Password":
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `SMTP_PASS`

### Ethereal Email (Development/Testing)

1. Visit https://ethereal.email
2. Click "Create Ethereal Account"
3. Use the provided credentials in your `.env`
4. View sent emails at the preview URL (logged in console)

## Technical Details

### Non-Recursive Implementation

```
Operator → Department (✉️ Email sent)
           ↓
           Admin (❌ NO email - maintains chain)

Department → Admin (✉️ Email sent only to Admin)
```

**Why non-recursive?**
- ✅ Prevents email spam/flooding
- ✅ Respects organizational hierarchy
- ✅ Each level can filter what upper levels see
- ✅ Scalable for future additional levels

### Email Service Architecture

```
services/
├── email.service.ts          # Email templates and sending logic
└── complaint.escalate.ts     # Escalation + email integration
└── complaint.update.ts       # Status update + email integration

config/
└── email.config.ts           # Nodemailer transporter setup
```

### Asynchronous Sending

Emails are sent **asynchronously** (fire-and-forget) to avoid blocking the main request:

```typescript
sendEscalationEmail({...}).catch(error => {
  console.error("Email failed:", error);
});
```

This ensures that:
- API responses are fast
- Email failures don't break complaint operations
- Errors are logged for debugging

## Usage Examples

### When Operator Escalates

```
POST /api/complaint/:id/escalate
Body: { reason: "Unable to resolve water pipeline issue" }

Result:
1. Complaint escalated ✅
2. Email sent to Department ✉️
3. Admin NOT notified (non-recursive) ❌
```

### When Department Overrides

```
PATCH /api/complaint/:id
Body: { status: "resolved" }

Result:
1. Status updated ✅
2. Email sent to Admin (override alert) ✉️
3. Operator NOT notified ❌
```

## Monitoring

Check server logs for email status:

```
✅ Email server is ready to send messages
✉️  Email sent to dept@example.com: <message-id>
📧 Preview URL: https://ethereal.email/message/xxx (dev only)
```

## Error Handling

If email sending fails:
- ❌ Error logged to console
- ✅ Complaint operation still succeeds
- 💡 User receives success message (they don't see email failures)

## Future Enhancements

- [ ] Email queue with retry mechanism (Redis/Bull)
- [ ] Email delivery tracking
- [ ] User email preferences (opt-in/opt-out)
- [ ] Email templates customization via admin panel
- [ ] SMS notifications for critical escalations

## Testing

### Development Testing

Run the server and perform actions:

```bash
npm run dev
```

Then:
1. Create test users (operator, department, admin) with real emails
2. Escalate a complaint as operator
3. Check your Ethereal Email inbox at https://ethereal.email
4. View the beautifully formatted email with complaint details

### Production Testing

1. Update `.env` with real SMTP credentials
2. Set `NODE_ENV=production`
3. Perform complaint actions
4. Check recipient email inboxes

---

**Status:** ✅ Fully Implemented and Tested
**Version:** 1.0.0
**Last Updated:** February 27, 2026
