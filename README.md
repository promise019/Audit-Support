# Computerised Financial Audit Support System (CFASS)

**Faculty of Computing, University of Calabar (UNICAL)**  
*Computerized Financial Audit and Compliance Management System*

---

## Student & Presenter Overview

This document provides a complete guide for students, presenters, and defense candidates using the Computerised Financial Audit Support System (CFASS). 

Read through this guide before launching the application or presenting the project to an examination panel. It covers:
1. System purpose and core functionality in non-technical terms.
2. How to explain each module during a project defense.
3. A structured 5-minute live demonstration plan.

---

## Quick Start: Running the Application

To run the application locally, execute the following commands in the project root directory:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

After starting the server, open your web browser and navigate to `http://localhost:5173`.

---

## System Overview

CFASS is a specialized web-based application designed for university faculty administration to digitize financial record-keeping, automate compliance checks, and enforce internal financial controls. 

It replaces paper-based ledgers and manual spreadsheets with:
- Automated bank statement reconciliation.
- Multi-tier payment approval chains.
- Real-time budget variance tracking.
- An unalterable digital audit log for complete accountability.

---

## Feature Explanations & Defense Guide

### 1. Role-Based Authentication & Access Control
- **Description:** Restricts access and functionality based on user roles.
- **Roles:**
  - **Data Entry Officer:** Can record financial transactions and submit payment requests, but cannot approve them.
  - **Auditor:** Can review entries, flag missing documentation, and approve standard transactions.
  - **Faculty Administrator (Dean):** Has final authorization rights for high-value capital expenditures.
- **Key Defense Point:** Implements Segregation of Duties so no single user can initiate, authorize, and approve a payment independently.

---

### 2. Executive Financial Dashboard
- **Description:** A high-level overview of faculty financial status.
- **Key Metrics:**
  - **Total Revenue:** Summary of all incoming funds (grants, tuition, TETFund allocations, software consulting).
  - **Total Expenditure:** Summary of all outgoing expenses (salaries, equipment purchases, utility bills).
  - **Net Balance:** Remaining balance calculated automatically.
  - **Risk Indicators:** Highlighting unresolved bank statement discrepancies and pending approval requests.

---

### 3. Chart of Accounts & General Ledger
- **Description:** The central financial ledger where all revenue and expenditure entries are categorized.
- **Functionality:** Uses standardized account codes (such as `EXP-103` for lab equipment and `REV-001` for government subventions). Enforces double-entry validation on all new transactions.
- **Key Defense Point:** Ensures proper classification and prevents unrecorded or miscategorized transactions.

---

### 4. Automated Bank Reconciliation
- **Description:** Automatically compares internal faculty transaction records against bank statements.
- **Status Identifiers:**
  - **Matched:** Internal ledger records match bank statement entries exactly.
  - **Discrepancy:** Flags mismatches between internal voucher figures and bank debit amounts (for example, a ₦50,000 difference on computer procurement entry `BST-004`).
  - **Unmatched:** Identifies bank deductions that do not have a corresponding internal voucher (such as unrecorded bank fees in entry `BST-008`).
- **Key Defense Point:** Automatically detects accounting errors, missing invoices, and unauthorized bank deductions.

---

### 5. Budget Variance Analysis
- **Description:** Monitors actual spending against approved annual budget allocations.
- **Functionality:** Calculates variance percentages per expense line. If actual expenditure exceeds budget allocation by more than 15%, the system automatically flags an Anomaly Warning.
- **Key Defense Point:** Provides early warning indicators to prevent unapproved budget overruns during the financial year.

---

### 6. Multi-Stage Approval Workflow
- **Description:** A sequential three-stage approval process for financial disbursements:  
  `Stage 1: Data Entry Officer` -> `Stage 2: Auditor` -> `Stage 3: Faculty Administrator (Dean)`
- **Available Actions:**
  - **Approve:** Advances the item to the next stage or completes final authorization.
  - **Flag for Review:** Pauses approval and records a note requesting additional documentation.
  - **Reject:** Declines the request permanently with a recorded reason.
- **Key Defense Point:** Enforces internal control activities in accordance with standard financial management principles.

---

### 7. Immutable Electronic Audit Trail
- **Description:** A read-only event log that automatically records every system activity.
- **Recorded Data:** Includes exact timestamp, user name, user role, action taken, record reference ID, and user IP address.
- **Key Defense Point:** The audit trail is append-only and cannot be edited or deleted by any user or administrator, providing non-repudiation and verifiable audit evidence.

---

### 8. Academic Defense Mode
- **Description:** A toggle feature in the top navigation bar designed for project defense presentations.
- **Functionality:** Displays contextual information panels explaining the theoretical accounting and auditing standards governing each module:
  - **Dashboard:** IPSAS 24 (Budget Information Presentation)
  - **Chart of Accounts:** IPSAS 1 (Financial Statements) & ISA 500 (Audit Evidence)
  - **Reconciliation:** ISA 505 (External Confirmations) & ISA 330 (Audit Risk Response)
  - **Variance Analysis:** ISA 520 (Analytical Procedures)
  - **Approval Workflow:** COSO Internal Control Framework & ISA 315
  - **Audit Trail:** ISA 230 (Audit Documentation) & ISAE 3402
- **Key Defense Point:** Demonstrates that the software implementation directly aligns with established international standards.

---

## Recommended Live Presentation Walkthrough

When presenting the project to an examination panel:

1. **Introduction & Dashboard:** Open the application and present the Executive Dashboard summary metrics (Revenue, Expenditure, Net Balance, and Risk Indicators).
2. **General Ledger:** Navigate to the Chart of Accounts and explain how transactions are recorded using standard account codes.
3. **Bank Reconciliation:** Open the Reconciliation module and point out matched records alongside detected discrepancies (e.g. the ₦50,000 variance and unmatched bank charge).
4. **Approval Workflow:** Demonstrate the three-stage approval pipeline, showing how payment requests are reviewed, flagged, or approved.
5. **Audit Trail:** Open the Audit Trail to show that all previous actions have been logged with timestamps and IP addresses.
6. **Academic Standards:** Toggle Academic Defense Mode ON to show the governing IPSAS and ISA standard references for each module.

---

## Defense Q&A Reference

| Question | Suggested Response |
| :--- | :--- |
| **How does the system ensure audit trail integrity?** | The audit log is append-only and read-only. No interface exists to alter or delete logged actions. |
| **How is segregation of duties enforced?** | Role-based permissions prevent Data Entry Officers from approving payment requests. Approvals require multi-tier clearance. |
| **What is the purpose of bank reconciliation?** | It cross-verifies internal financial records against external bank records to spot timing differences, bank errors, or unauthorized debits. |
| **Which standards guide the system design?** | IPSAS (International Public Sector Accounting Standards) for reporting and ISA (International Standards on Auditing) for audit compliance. |

---

## System Architecture & Stack

- **Frontend:** React 18 (Vite SPA)
- **Styling:** Tailwind CSS (Slate and Navy Blue design system)
- **Icons:** Lucide React
- **State Management:** React Context API (`AuditContext.jsx`)
- **Data Source:** Pre-populated financial dataset (`mockData.js`) modeled on University of Calabar faculty accounts.

---

*CFASS v1.0 — Faculty of Computing, University of Calabar*
