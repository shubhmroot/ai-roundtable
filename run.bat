@echo off
title AI Roundtable - Multi-Agent Podcast
echo ====================================================
echo Starting AI Roundtable Studio (ElevenLabs Voice AI)
echo ====================================================
cd /d "%~dp0"
echo Starting Server & Client...
npm run dev
pause
