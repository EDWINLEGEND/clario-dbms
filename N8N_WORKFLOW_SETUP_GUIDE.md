# n8n Workflow Setup Guide for Clario Reminder System

This guide provides step-by-step instructions for creating an n8n workflow that processes reminder webhooks from the Clario backend and sends notifications via email and WhatsApp.

## Prerequisites

- Docker and Docker Compose installed
- n8n container running (from the project's docker-compose.yml)
- Access to n8n UI at http://localhost:5679

## Part A: Starting n8n

1. **Start the n8n container:**
   ```bash
   cd /path/to/clario-dbms
   docker-compose up n8n -d
   ```

2. **Access n8n UI:**
   - Open your browser and navigate to http://localhost:5679
   - Create an account or log in if prompted

## Part B: Creating the Reminder Workflow

### Step 1: Create a New Workflow

1. Click the **"+ New Workflow"** button in the n8n interface
2. Give your workflow a descriptive name: **"Clario Reminder Dispatcher"**

### Step 2: Add the Webhook Start Node

1. **Add Webhook Node:**
   - Click the **"+"** button to add a new node
   - Search for and select **"Webhook"** node
   - This will be your starting node

2. **Configure the Webhook:**
   - Set **HTTP Method** to `POST`
   - Set **Path** to `reminder-dispatch`
   - Leave **Authentication** as `None`
   - Set **Response Mode** to `Respond Immediately`
   - Set **Response Code** to `200`

3. **Activate and Get URL:**
   - Click **"Listen for Test Event"** or **"Execute Node"**
   - n8n will provide a **Test URL** like: `http://localhost:5679/webhook/reminder-dispatch`
   - **IMPORTANT:** Copy this URL - you'll need it for the backend configuration

### Step 3: Add the Switch (Router) Node

1. **Add Switch Node:**
   - Click the **"+"** button after the Webhook node
   - Search for and select **"Switch"** node
   - Connect it to the Webhook node

2. **Configure the Switch:**
   - Set **Mode** to `Rules`
   - **Rule 1 (Email):**
     - **Operation:** `Equal`
     - **Value 1:** `{{ $json.body.channel }}`
     - **Value 2:** `email`
   - **Rule 2 (WhatsApp):**
     - **Operation:** `Equal`
     - **Value 1:** `{{ $json.body.channel }}`
     - **Value 2:** `whatsapp`

### Step 4: Add Email Path (MailHog)

1. **Add Send Email Node:**
   - From the **first output** of the Switch node, add a new node
   - Search for and select **"Send Email"** node

2. **Configure Email Node:**
   - **SMTP Host:** `localhost`
   - **SMTP Port:** `1025`
   - **Security:** `None`
   - **From Email:** `noreply@clario.app`
   - **To Email:** `{{ $json.body.user.email }}`
   - **Subject:** `Clario Reminder: {{ $json.body.milestone ? $json.body.milestone.title : 'Scheduled Reminder' }}`
   - **Email Format:** `HTML`
   - **Message:**
     ```html
     <h2>📅 Reminder from Clario</h2>
     <p>Hello {{ $json.body.user.name || 'there' }},</p>
     <p>{{ $json.body.message }}</p>
     
     {{#if $json.body.milestone}}
     <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
       <h3>📋 Milestone Details:</h3>
       <p><strong>Project:</strong> {{ $json.body.milestone.project.title }}</p>
       <p><strong>Milestone:</strong> {{ $json.body.milestone.title }}</p>
       <p><strong>Due Date:</strong> {{ $json.body.milestone.dueDate }}</p>
     </div>
     {{/if}}
     
     <p>Best regards,<br>The Clario Team</p>
     <hr>
     <small>This is an automated reminder. Reminder ID: {{ $json.body.reminderId }}</small>
     ```

### Step 5: Add WhatsApp Path (Twilio)

1. **Add Twilio Node:**
   - From the **second output** of the Switch node, add a new node
   - Search for and select **"Twilio"** node

2. **Configure Twilio Credentials:**
   - **Account SID:** Your Twilio Account SID
   - **Auth Token:** Your Twilio Auth Token
   - **Operation:** `Send SMS` or `Send WhatsApp Message`

3. **Configure Message:**
   - **From:** Your Twilio phone number (e.g., `+1234567890`)
   - **To:** `{{ $json.body.user.phone || '+1234567890' }}` *(Note: You may need to add phone field to user model)*
   - **Message:**
     ```
     📅 Clario Reminder
     
     Hello {{ $json.body.user.name || 'there' }}!
     
     {{ $json.body.message }}
     
     {{#if $json.body.milestone}}
     📋 Project: {{ $json.body.milestone.project.title }}
     🎯 Milestone: {{ $json.body.milestone.title }}
     📅 Due: {{ $json.body.milestone.dueDate }}
     {{/if}}
     
     - Clario Team
     ```

### Step 6: Add Error Handling (Optional)

1. **Add Set Node for Logging:**
   - Add a **"Set"** node after each notification node
   - Configure it to log success/failure information
   - Set values like:
     - `status`: `sent`
     - `timestamp`: `{{ new Date().toISOString() }}`
     - `reminderId`: `{{ $json.body.reminderId }}`

### Step 7: Save and Activate

1. **Save the Workflow:**
   - Click **"Save"** button
   - Give it a descriptive name: **"Clario Reminder Dispatcher"**

2. **Activate the Workflow:**
   - Toggle the **"Active"** switch in the top-right corner
   - The workflow is now live and ready to receive webhooks

## Part C: Backend Configuration

### Update Environment Variables

Update your backend `.env` file with the webhook URL from Step 2:

```env
# n8n webhook configuration
N8N_WEBHOOK_URL="http://localhost:5679/webhook/reminder-dispatch"
```

### Test the Integration

1. **Create a test reminder** with a past `sendDate`
2. **Call the dispatch endpoint:**
   ```bash
   curl -X POST http://localhost:4000/reminders/dispatch \
     -H "Content-Type: application/json" \
     -H "X-API-KEY: clario-dispatch-2025-secure-key-n8n-webhook"
   ```
3. **Check n8n execution logs** for successful webhook processing
4. **Check MailHog** (http://localhost:8025) for test emails

## Part D: Production Considerations

### Security Enhancements

1. **Add Webhook Authentication:**
   - Configure webhook authentication in n8n
   - Add corresponding headers in backend dispatch code

2. **Environment-Specific URLs:**
   - Use different webhook URLs for development/production
   - Configure proper HTTPS endpoints in production

### Monitoring and Logging

1. **Add Logging Nodes:**
   - Log successful/failed notifications
   - Store execution data for debugging

2. **Error Notifications:**
   - Add error handling paths
   - Send admin notifications for failed dispatches

### Scaling Considerations

1. **Webhook Queuing:**
   - Consider adding queue management for high-volume scenarios
   - Implement retry logic for failed notifications

2. **Rate Limiting:**
   - Configure appropriate rate limits for email/SMS providers
   - Add delays between batch notifications if needed

## Troubleshooting

### Common Issues

1. **Webhook URL Not Working:**
   - Ensure n8n container is running
   - Check that the workflow is activated
   - Verify the webhook path matches the backend configuration

2. **Email Not Sending:**
   - Confirm MailHog is running on port 1025
   - Check SMTP configuration in the email node

3. **WhatsApp/SMS Not Working:**
   - Verify Twilio credentials are correct
   - Ensure phone numbers are in correct format
   - Check Twilio account balance and permissions

### Testing Commands

```bash
# Test webhook directly
curl -X POST http://localhost:5679/webhook/reminder-dispatch \
  -H "Content-Type: application/json" \
  -d '{
    "reminderId": 1,
    "channel": "email",
    "user": {
      "name": "Test User",
      "email": "test@example.com"
    },
    "message": "Test reminder message"
  }'

# Test dispatch endpoint
curl -X POST http://localhost:4000/reminders/dispatch \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: clario-dispatch-2025-secure-key-n8n-webhook"
```

## Next Steps

1. **Set up automated cron job** to call the dispatch endpoint regularly
2. **Configure production email/SMS providers** (SendGrid, Twilio, etc.)
3. **Add monitoring and alerting** for failed notifications
4. **Implement user preferences** for notification channels and timing

---

**Note:** This workflow processes reminders sent from the Clario backend dispatch endpoint. The backend handles finding due reminders, calling this webhook, and updating reminder statuses based on the response.