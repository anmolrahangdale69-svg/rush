# Security Specification for Bokde Travels

## 1. Data Invariants
- Each booking in `/bookings/{bookingId}` MUST have a `userId` matching the authenticated user (`request.auth.uid`), preventing any cross-user booking reads or writes.
- A user can only view their own bookings via filtered queries where `resource.data.userId == request.auth.uid`.
- A user can only update their own bookings, and can only alter the `status` field (e.g. from `pending` to `cancelled`).
- User profile in `/users/{userId}` can only be read, created, or updated by the matching authenticated user where `request.auth.uid == userId`.
- No user can access or view another user's PII (name, phone, email, bookings).
- Document IDs must conform to sanitized patterns: alphanumeric, hyphens, and underscores.

## 2. The "Dirty Dozen" Threat Payloads
1. **Unauthenticated List on /bookings**: An unauthenticated request tries to fetch all bookings. Expected: DENIED.
2. **Cross-Tenant Booking Read**: User A tries to `get` `/bookings/booking_B` where `userId == 'User_B'`. Expected: DENIED.
3. **Cross-Tenant Booking List**: User A runs a query without `where('userId', '==', 'User_A')`. Expected: DENIED.
4. **Fake User ID Injection on Create**: User A attempts to create a booking with `userId: 'User_B'`. Expected: DENIED.
5. **Unauthorized User Profile Read**: User A tries to read `/users/User_B`. Expected: DENIED.
6. **Unauthorized User Profile Write**: User A tries to write to `/users/User_B`. Expected: DENIED.
7. **Junk Path ID Attack**: Attacker injects a 2KB non-alphanumeric document ID. Expected: DENIED.
8. **Shadow Field Injection**: Booking write contains unauthorized extra admin fields like `{ isAdmin: true }`. Expected: DENIED.
9. **Status Hijacking on Update**: User tries to change `userId` or `totalPrice` or `createdAt` on an existing booking. Expected: DENIED.
10. **Re-Activating Cancelled Booking**: User tries to flip a cancelled booking back or inject arbitrary fields on update. Expected: DENIED.
11. **Blanket Write to Root**: Attacker attempts writing to `/{document=**}`. Expected: DENIED.
12. **PII Harvesting via Missing Auth**: Unauthenticated client attempts to query `/users`. Expected: DENIED.
