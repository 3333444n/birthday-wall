#!/bin/bash

echo "🔥 Attempting to deploy Firebase Storage rules..."

# Try to deploy storage rules
if firebase deploy --only storage; then
    echo "✅ Storage rules deployed successfully!"
    echo "📸 Photo uploads will now use Firebase Storage"
else
    echo "⚠️ Storage deployment failed - service may not be enabled yet"
    echo "🎯 The app will continue to work with local storage fallback"
    echo ""
    echo "To enable Firebase Storage:"
    echo "1. Go to: https://console.firebase.google.com/project/danybday-346c2/storage"
    echo "2. Click 'Get Started' to enable Storage"
    echo "3. Run this script again: ./deploy-storage.sh"
fi