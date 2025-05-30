#!/bin/bash
cd /home/kavia/workspace/code-generation/studyquest-ai-26294-f363e2f3/studyquest_ai_container
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

