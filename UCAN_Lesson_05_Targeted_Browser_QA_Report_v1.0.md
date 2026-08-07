# UCAN Lesson 05 Targeted Browser QA Report v1.0

## Environment recovery

- Defect: `L05-BQ-ENV-001`.
- Requested endpoint: `http://127.0.0.1:8765/`.
- Attempt 1: PowerShell/.NET `HttpListener`; process started but the endpoint remained unreachable (`Unable to connect to the remote server`).
- Attempt 2: PowerShell/.NET `TcpListener`; process started but the endpoint remained unreachable (`Unable to connect to the remote server`).
- Python is unavailable/inaccessible. No Node/PHP/static-server runtime was used.

## Browser QA result

BQ-01–BQ-35: **BLOCKED**. The browser cannot load the local endpoint, so browser-level behavior, console, mobile, migration and PDF interaction cannot be truthfully assessed.

No Lesson code, vendor bytes, PNG bytes, Git refs, or repository settings were changed during environment recovery. No temporary server artifact was added.

## Next action

Provide a working localhost listener accessible to the in-app browser, then rerun BQ-01–BQ-35 unchanged.
