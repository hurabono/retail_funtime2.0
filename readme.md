# Retail Fun Time
![Thumnail](https://ik.imagekit.io/stephanie/git-thum/retailruntime.png?updatedAt=1786471909814)
A workforce app for retail teams: clock in and out, schedules, leave requests, payroll, and announcements, with managers and employees seeing different apps behind the same login.

Retail staff and their managers lose time to the same small questions every week. How many hours did I work. Was my leave approved. Is my pay right. When am I on next. Those answers usually live in a paper binder, a group chat, and a manager's memory. Retail Fun Time puts them in one place, in real time.

Built as a seven month capstone project with a team.

**Manager view**

<img width="300" height="583" alt="retail-manager" src="https://github.com/user-attachments/assets/0d48d051-1aa5-45d2-acea-3697f49ed56b" />


*Post an announcement, edit an employee record, build a schedule, add shifts, review payroll.*

**Employee view**

<img width="300" height="583" alt="retail-employee" src="https://github.com/user-attachments/assets/b656be18-2b83-436c-a965-4c71cfef7ad8" />


*Home, request time off, check the schedule, read the paycheck breakdown, clock in.*

## Two apps, one codebase

The core design decision: a manager and an employee open the same app and get different software.

**Employees**
- Clock in and out, and see their own working hours
- Request leave, holidays, and sick days, and track request status
- View their schedule, payroll, and pay history
- Receive announcements in real time

**Managers**
- View and edit employee records, set hourly wages
- Build and publish schedules
- Approve or reject leave and sick day requests
- Review time logs across the team
- Run payroll and post announcements

This is enforced in the routing itself. `app/(root)/(tabs)` and `app/(root)/(managerTabs)` are separate route groups, resolved from the authenticated user's role, so an employee has no navigable path into manager screens rather than merely having the buttons hidden.

## Architecture

```
Expo / React Native client  ──►  Node.js REST API (Render)
        │                                 │
  Role-based routing                  JWT auth
  (tabs) / (managerTabs)              Employee, schedule, payroll data
```

Authentication is JWT based. The token is stored with AsyncStorage and attached by an Axios request interceptor in [`services/api.ts`](./services/api.ts). Sensitive values use `expo-secure-store`.

Payroll required getting time interval arithmetic right across shift boundaries, which turned out to be the least glamorous and most rewritten part of the project.

## Built with

| | |
|---|---|
| Client | React Native, Expo, Expo Router, TypeScript |
| Styling | NativeWind (Tailwind CSS for React Native), React Native Paper |
| State and storage | React Context, AsyncStorage, `expo-secure-store` |
| HTTP | Axios with a JWT request interceptor |
| Backend | Node.js REST API, deployed on Render |
| Native build | Android project included under `android/` |

## Run it locally

```bash
npm install
npx expo start
```

Open in Expo Go, an Android emulator, or an iOS simulator. The client points at the deployed backend, so no local API is needed to try it.

## Known limitation

Registration currently lets anyone sign up as a manager. There is no verification step, so the role boundary the app enforces everywhere else can be bypassed at the front door.

The fix belongs at registration rather than in the routing: pre-approved manager codes or invitation-only signup, with an admin approval queue behind it. Role-scoped access tokens and an audit log of manager actions would make the boundary provable after the fact rather than only enforced at render time.

Documenting this rather than quietly leaving it was deliberate. It is the clearest thing I learned on the project: access control that lives only in the UI is not access control.

---

Built by Stephanie (Heesu) Cho with a capstone team. September 2024 to April 2025.
