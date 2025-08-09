## Overview

This document lists six bugs that were discovered and resolved in the  
Lead Management & Scheduling App.

---

### 1. Missing Industry Info in Saved Leads

**File**: `src/types/Lead.ts`  
**Severity**: Critical  
**Status**: Fixed

#### Issue Observed

Industry details entered on the form were not stored in the database.

#### Underlying Cause

The TypeScript interface for `Lead` was outdated and lacked the `industry` field.

#### Solution Implemented

Extended the interface to include `industry` and tested the data flow from form to database.

#### Result

- ✅ All submitted fields now saved
- ✅ Improved data completeness for reports
- ✅ Prevented silent data loss

---

### 2. Unnecessary useEffect Hook

**File**: `src/components/LeadForm.tsx`  
**Severity**: Minor  
**Status**: Fixed

#### Issue Observed

A `useEffect` ran on mount, resetting state without any clear reason.

#### Underlying Cause

Code remained from an earlier development phase and no longer served a purpose.

#### Solution Implemented

Removed the unused hook, reducing complexity.

#### Result

- ✅ Cleaner code structure
- ✅ Slight boost to render efficiency

---

### 3. AI Output Retrieval Error

**File**: `src/services/aiHandler.ts`  
**Severity**: Critical  
**Status**: Fixed

#### Issue Observed

The AI frequently returned fallback responses instead of the intended answers.

#### Underlying Cause

The handler accessed the wrong array index (`choices[1]` instead of `choices[0]`).

#### Solution Implemented

Corrected the index reference to `[0]` for accurate output retrieval.

#### Result

- ✅ More accurate AI replies
- ✅ Reduced fallback usage
- ✅ Better end-user satisfaction

---

### 4. Leads Not Persisting After Submission

**File**: `src/services/databaseService.ts`  
**Severity**: Major  
**Status**: Fixed

#### Issue Observed

Leads disappeared when the user refreshed the page.

#### Underlying Cause

Submission logic stored leads locally but skipped inserting them into Supabase.

#### Solution Implemented

Added a database insert function to the submission process.

#### Result

- ✅ Leads are now permanently stored
- ✅ No loss of submitted data
- ✅ Backend and frontend remain in sync

---

### 5. Duplicate Confirmation Email Sends

**File**: `src/services/emailService.ts`  
**Severity**: Critical  
**Status**: Fixed

#### Issue Observed

Users were sent two identical confirmation emails per submission.

#### Underlying Cause

The send-email routine was triggered in two different execution paths.

#### Solution Implemented

Removed the extra trigger and added a safeguard to prevent double sends.

#### Result

- ✅ Single confirmation email per submission
- ✅ Reduced email service overhead
- ✅ Lower spam flag risk

---

### 6. React Router Deprecation Notices

**File**: `src/routes/routerConfig.ts`  
**Severity**: Minor  
**Status**: Fixed

#### Issue Observed

Console logs contained v7 deprecation warnings during app navigation.

#### Underlying Cause

Two recommended flags (`startTransition` and `relativeSplatPath`) were missing from configuration.

#### Solution Implemented

Added both flags as per the React Router v7 migration guide.

#### Result

- ✅ No more warning messages
- ✅ Configuration ready for future updates
