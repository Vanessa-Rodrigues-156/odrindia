# Troubleshooting Database Connection Issues

If you're experiencing database connection errors like `getaddrinfo EAI_AGAIN`, here are some steps to resolve them:

## Common Error Messages

- `getaddrinfo EAI_AGAIN ep-flat-block-a4ofoeyu-pooler.us-east-1.aws.neon.tech`
- `Failed to create meeting`
- `Failed to load meetings`

## Root Causes

1. **DNS Resolution Issues**: Your system cannot resolve the database hostname to an IP address
2. **Network Connectivity Problems**: Your network connection may be unstable or limited
3. **Database Server Unavailability**: The Neon database server may be temporarily down
4. **Firewall or VPN Restrictions**: Network policies might be blocking the connection

## Immediate Solutions

1. **Check Your Internet Connection**:
   - Try accessing other websites to verify your general internet connectivity
   - Reset your network equipment if needed

2. **Test DNS Resolution**:
   ```bash
   ping ep-flat-block-a4ofoeyu-pooler.us-east-1.aws.neon.tech
   ```
   If this fails, it confirms a DNS resolution issue.

3. **Try Alternative DNS Servers**:
   - Use Google's DNS (8.8.8.8)
   - Use Cloudflare's DNS (1.1.1.1)

## Long-Term Solutions

### For Developers

1. **Implement Fallback Database**:
   Add this to your `.env.local` file:
   ```
   USE_LOCAL_DB=true
   ```

2. **Add Connection Retries**:
   The application has been updated to retry database operations.

3. **Check Database Status**:
   - Verify the database is active in your Neon dashboard
   - Ensure your IP is allowed in the database security settings

### For Production

1. **Ensure Stable Internet Connection**: Use a reliable internet connection

2. **Verify Database Configuration**: Check that all environment variables are set correctly

3. **Monitor Database Performance**: Set up monitoring for your database to catch issues early

## Contact Support

If problems persist, please contact support with:
- Screenshots of the error
- Time when the error occurred
- Steps to reproduce the issue
