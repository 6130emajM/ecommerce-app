# E-Commerce App

## Live App
https://ecommerce-app-swe01.vercel.app

## Overview
A React e-commerce app with Firebase, Redux, and a full CI/CD pipeline.

## Tech Stack
- React + TypeScript
- Redux Toolkit
- Firebase (Auth + Firestore)
- Jest + React Testing Library
- GitHub Actions (CI/CD)
- Vercel (hosting)

## Testing
Run tests locally: npm test

## CI/CD Pipeline
Every push to main:
1. Runs Jest tests
2. Builds the app
3. Deploys to Vercel only if tests pass
