/**
 * mockData.js — Pre-populated realistic financial data for
 * Faculty of Computing, University of Calabar (UNICAL)
 * All figures in Nigerian Naira (₦).
 *
 * Physical Design Schema (Chapter 3.3.2.2):
 *   Users, Transactions, Budgets, Reconciliations, AuditLogs
 *
 * Purpose: Provides demo data for a live academic defense presentation
 * without requiring a backend database connection.
 */

// ─── USERS TABLE (Physical Schema) ────────────────────────────────────────────
// Fields: user_id | full_name | email | role (DATA_ENTRY|AUDITOR|ADMIN) | password_hash | created_at
export const USERS = [
  { user_id:'USR-001', full_name:'Chukwuma Obi',       email:'c.obi@unical.edu.ng',    role:'DATA_ENTRY', password_hash:'$2b$10$xK9vD1QmLpR3sT8uW4yZ6e', created_at:'2023-09-01T08:00:00Z', ipAddress:'10.20.5.101' },
  { user_id:'USR-002', full_name:'Ngozi Eze',           email:'n.eze@unical.edu.ng',    role:'DATA_ENTRY', password_hash:'$2b$10$aB2cD3eF4gH5iJ6kL7mN8o', created_at:'2023-09-01T08:30:00Z', ipAddress:'10.20.5.105' },
  { user_id:'USR-003', full_name:'Dr. Effiong Bassey',  email:'admin@unical.edu.ng',    role:'AUDITOR',    password_hash:'$2b$10$pQ1rS2tU3vW4xY5zA6bC7d', created_at:'2023-08-15T09:00:00Z', ipAddress:'10.20.5.210' },
  { user_id:'USR-004', full_name:'Prof. Asuquo Edet',   email:'a.edet@unical.edu.ng',   role:'ADMIN',      password_hash:'$2b$10$eE8fF9gG0hH1iI2jJ3kK4l', created_at:'2023-08-15T09:30:00Z', ipAddress:'10.20.5.300' },
  { user_id:'USR-005', full_name:'Dr. Amaka Nwosu',     email:'a.nwosu@unical.edu.ng',  role:'DATA_ENTRY', password_hash:'$2b$10$mM5nN6oO7pP8qQ9rR0sS1t', created_at:'2023-10-01T10:00:00Z', ipAddress:'10.20.5.115' },
];

// ─── Chart of Accounts: Standard Account Codes ───────────────────────────────
export const ACCOUNT_CODES = [
  { code:'COA-1001', legacyCode:'REV-001', name:'Government Grants & Subventions',    category:'Revenue'      },
  { code:'COA-1002', legacyCode:'REV-002', name:'Tetfund Research Allocation',         category:'Revenue'      },
  { code:'COA-1003', legacyCode:'REV-003', name:'Student Tuition & Levies',            category:'Revenue'      },
  { code:'COA-1004', legacyCode:'REV-004', name:'Consultancy & IGR',                   category:'Revenue'      },
  { code:'COA-2001', legacyCode:'EXP-101', name:'Staff Salaries & Emoluments',         category:'Expenditure'  },
  { code:'COA-2002', legacyCode:'EXP-102', name:'Research & Academic Materials',       category:'Expenditure'  },
  { code:'COA-2003', legacyCode:'EXP-103', name:'Laboratory Equipment & Supplies',     category:'Expenditure'  },
  { code:'COA-2004', legacyCode:'EXP-104', name:'Utilities & Maintenance',             category:'Expenditure'  },
  { code:'COA-2005', legacyCode:'EXP-105', name:'Travel & Conference Expenses',        category:'Expenditure'  },
  { code:'COA-2006', legacyCode:'EXP-106', name:'Office & Administrative Expenses',    category:'Expenditure'  },
  { code:'COA-2007', legacyCode:'EXP-107', name:'ICT Infrastructure & Subscriptions',  category:'Expenditure'  },
  { code:'COA-2008', legacyCode:'EXP-108', name:'Student Welfare & Scholarships',      category:'Expenditure'  },
  { code:'COA-3001', legacyCode:'ASS-201', name:'Computer Lab Assets',                 category:'Assets'       },
  { code:'COA-4001', legacyCode:'LIA-301', name:'Vendor Payables',                     category:'Liabilities'  },
];

// ─── Financial Transactions (Ledger Entries) ─────────────────────────────────
// Schema: txn_id | coa_code | category | description | debit(DECIMAL) | credit(DECIMAL)
//         | status(PENDING|APPROVED|REJECTED|FLAGGED) | created_by | approved_by | timestamp
export const INITIAL_TRANSACTIONS = [
  { id:'TXN-2024-001', txn_id:'TXN-2024-001', date:'2024-01-15', timestamp:'2024-01-15T08:30:00Z', accountCode:'REV-001', coa_code:'COA-1001', category:'Revenue',      description:'FGN Subvention Q1 2024 — Federal Government Release',                    debit:0,       credit:12500000, balance:12500000, status:'Approved', enteredBy:'Chukwuma Obi (Data Entry)',     created_by:'USR-001', approvedBy:'Dr. Effiong Bassey (Auditor)',       approved_by:'USR-003' },
  { id:'TXN-2024-002', txn_id:'TXN-2024-002', date:'2024-01-22', timestamp:'2024-01-22T09:05:00Z', accountCode:'EXP-101', coa_code:'COA-2001', category:'Expenditure', description:'Staff Salaries — January 2024 (Academic + Non-Academic)',                debit:4800000,  credit:0,        balance:7700000,  status:'Approved', enteredBy:'Chukwuma Obi (Data Entry)',     created_by:'USR-001', approvedBy:'Dr. Effiong Bassey (Auditor)',       approved_by:'USR-003' },
  { id:'TXN-2024-003', txn_id:'TXN-2024-003', date:'2024-02-05', timestamp:'2024-02-05T11:20:00Z', accountCode:'REV-002', coa_code:'COA-1002', category:'Revenue',      description:'TETFund Research Grant — AI & Machine Learning Lab Project',            debit:0,        credit:5000000,  balance:12700000, status:'Approved', enteredBy:'Ngozi Eze (Data Entry)',        created_by:'USR-002', approvedBy:'Dr. Effiong Bassey (Auditor)',       approved_by:'USR-003' },
  { id:'TXN-2024-004', txn_id:'TXN-2024-004', date:'2024-02-14', timestamp:'2024-02-14T10:55:00Z', accountCode:'EXP-103', coa_code:'COA-2003', category:'Expenditure', description:'Procurement: 20× Dell Workstations for CS Lab 3',                       debit:3200000,  credit:0,        balance:9500000,  status:'Approved', enteredBy:'Ngozi Eze (Data Entry)',        created_by:'USR-002', approvedBy:'Prof. Asuquo Edet (Faculty Admin)',  approved_by:'USR-004' },
  { id:'TXN-2024-005', txn_id:'TXN-2024-005', date:'2024-02-22', timestamp:'2024-02-22T13:15:00Z', accountCode:'EXP-105', coa_code:'COA-2005', category:'Expenditure', description:'IEEE Conference Travel — Dr. Amaka Nwosu (ICSE Lagos)',                 debit:285000,   credit:0,        balance:9215000,  status:'Approved', enteredBy:'Chukwuma Obi (Data Entry)',     created_by:'USR-001', approvedBy:'Dr. Effiong Bassey (Auditor)',       approved_by:'USR-003' },
  { id:'TXN-2024-006', txn_id:'TXN-2024-006', date:'2024-03-01', timestamp:'2024-03-01T09:45:00Z', accountCode:'REV-003', coa_code:'COA-1003', category:'Revenue',      description:'Student Portal Fees — 2023/2024 Academic Session (500-Level)',          debit:0,        credit:1875000,  balance:11090000, status:'Approved', enteredBy:'Ngozi Eze (Data Entry)',        created_by:'USR-002', approvedBy:'Dr. Effiong Bassey (Auditor)',       approved_by:'USR-003' },
  { id:'TXN-2024-007', txn_id:'TXN-2024-007', date:'2024-03-10', timestamp:'2024-03-10T11:00:00Z', accountCode:'EXP-104', coa_code:'COA-2004', category:'Expenditure', description:'EEDC Power Bills — Q1 2024 (Faculty Block A & B)',                      debit:420000,   credit:0,        balance:10670000, status:'Approved', enteredBy:'Chukwuma Obi (Data Entry)',     created_by:'USR-001', approvedBy:'Dr. Effiong Bassey (Auditor)',       approved_by:'USR-003' },
  { id:'TXN-2024-008', txn_id:'TXN-2024-008', date:'2024-03-18', timestamp:'2024-03-18T15:40:00Z', accountCode:'EXP-107', coa_code:'COA-2007', category:'Expenditure', description:'Annual Microsoft Campus Agreement Renewal — Office 365 & Azure',        debit:1100000,  credit:0,        balance:9570000,  status:'Flagged',  enteredBy:'Ngozi Eze (Data Entry)',        created_by:'USR-002', approvedBy:null,                                 approved_by:null,      flagReason:'Vendor invoice number missing. Pending verification.' },
  { id:'TXN-2024-009', txn_id:'TXN-2024-009', date:'2024-04-02', timestamp:'2024-04-02T10:30:00Z', accountCode:'REV-004', coa_code:'COA-1004', category:'Revenue',      description:'NDDC Software Dev Consultancy — State Enterprise Project',             debit:0,        credit:2200000,  balance:11770000, status:'Approved', enteredBy:'Ngozi Eze (Data Entry)',        created_by:'USR-002', approvedBy:'Prof. Asuquo Edet (Faculty Admin)',  approved_by:'USR-004' },
  { id:'TXN-2024-010', txn_id:'TXN-2024-010', date:'2024-04-15', timestamp:'2024-04-15T09:30:00Z', accountCode:'EXP-101', coa_code:'COA-2001', category:'Expenditure', description:'Staff Salaries — April 2024 (Academic + Non-Academic)',                debit:4800000,  credit:0,        balance:6970000,  status:'Approved', enteredBy:'Chukwuma Obi (Data Entry)',     created_by:'USR-001', approvedBy:'Dr. Effiong Bassey (Auditor)',       approved_by:'USR-003' },
  { id:'TXN-2024-011', txn_id:'TXN-2024-011', date:'2024-04-28', timestamp:'2024-04-28T14:00:00Z', accountCode:'EXP-102', coa_code:'COA-2002', category:'Expenditure', description:'Journal Subscriptions: IEEE Xplore + ACM DL (Annual)',                 debit:680000,   credit:0,        balance:6290000,  status:'Approved', enteredBy:'Ngozi Eze (Data Entry)',        created_by:'USR-002', approvedBy:'Dr. Effiong Bassey (Auditor)',       approved_by:'USR-003' },
  { id:'TXN-2024-012', txn_id:'TXN-2024-012', date:'2024-05-06', timestamp:'2024-05-06T10:20:00Z', accountCode:'EXP-106', coa_code:'COA-2006', category:'Expenditure', description:'Stationery, Printing & Binding — End of Semester Exams',               debit:195000,   credit:0,        balance:6095000,  status:'Approved', enteredBy:'Chukwuma Obi (Data Entry)',     created_by:'USR-001', approvedBy:'Dr. Effiong Bassey (Auditor)',       approved_by:'USR-003' },
  { id:'TXN-2024-013', txn_id:'TXN-2024-013', date:'2024-05-20', timestamp:'2024-05-20T09:15:00Z', accountCode:'EXP-108', coa_code:'COA-2008', category:'Expenditure', description:'Merit Scholarships — Top 10 Final Year Students (2023/2024)',           debit:500000,   credit:0,        balance:5595000,  status:'Pending',  enteredBy:'Ngozi Eze (Data Entry)',        created_by:'USR-002', approvedBy:null,                                 approved_by:null },
  { id:'TXN-2024-014', txn_id:'TXN-2024-014', date:'2024-06-03', timestamp:'2024-06-03T10:30:00Z', accountCode:'EXP-103', coa_code:'COA-2003', category:'Expenditure', description:'Network Switch & Fibre Cabling — Lab 1 Infrastructure Upgrade',         debit:875000,   credit:0,        balance:4720000,  status:'Pending',  enteredBy:'Ngozi Eze (Data Entry)',        created_by:'USR-002', approvedBy:null,                                 approved_by:null },
  { id:'TXN-2024-015', txn_id:'TXN-2024-015', date:'2024-06-10', timestamp:'2024-06-10T14:00:00Z', accountCode:'EXP-105', coa_code:'COA-2005', category:'Expenditure', description:'NITDA Workshop Attendance — 4 Staff Members (Abuja)',                    debit:620000,   credit:0,        balance:4100000,  status:'Rejected', enteredBy:'Chukwuma Obi (Data Entry)',     created_by:'USR-001', approvedBy:'Prof. Asuquo Edet (Faculty Admin)',  approved_by:'USR-004', flagReason:'Duplicate submission. Original TXN-2024-005 already processed.' },
  { id:'TXN-2024-016', txn_id:'TXN-2024-016', date:'2024-06-15', timestamp:'2024-06-15T08:00:00Z', accountCode:'REV-002', coa_code:'COA-1002', category:'Revenue',      description:'NCC Research Partnership Grant — Cybersecurity Lab Tranche 1',        debit:0,        credit:3500000,  balance:7600000,  status:'Approved', enteredBy:'Dr. Amaka Nwosu (Data Entry)',   created_by:'USR-005', approvedBy:'Dr. Effiong Bassey (Auditor)',       approved_by:'USR-003' },
  { id:'TXN-2024-017', txn_id:'TXN-2024-017', date:'2024-06-28', timestamp:'2024-06-28T11:45:00Z', accountCode:'EXP-101', coa_code:'COA-2001', category:'Expenditure', description:'Staff Salaries — June 2024 (Academic + Non-Academic)',                 debit:4800000,  credit:0,        balance:2800000,  status:'Approved', enteredBy:'Chukwuma Obi (Data Entry)',     created_by:'USR-001', approvedBy:'Dr. Effiong Bassey (Auditor)',       approved_by:'USR-003' },
  { id:'TXN-2024-018', txn_id:'TXN-2024-018', date:'2024-07-05', timestamp:'2024-07-05T09:20:00Z', accountCode:'REV-003', coa_code:'COA-1003', category:'Revenue',      description:'Acceptance Fee Collection — 2024/2025 Incoming Batch (300 Students)',  debit:0,        credit:4500000,  balance:7300000,  status:'Approved', enteredBy:'Ngozi Eze (Data Entry)',        created_by:'USR-002', approvedBy:'Dr. Effiong Bassey (Auditor)',       approved_by:'USR-003' },
  { id:'TXN-2024-019', txn_id:'TXN-2024-019', date:'2024-07-12', timestamp:'2024-07-12T10:00:00Z', accountCode:'EXP-103', coa_code:'COA-2003', category:'Expenditure', description:'10× HP ProBook Laptops — Postgraduate Research Lab',                   debit:1850000,  credit:0,        balance:5450000,  status:'Approved', enteredBy:'Ngozi Eze (Data Entry)',        created_by:'USR-002', approvedBy:'Prof. Asuquo Edet (Faculty Admin)',  approved_by:'USR-004' },
  { id:'TXN-2024-020', txn_id:'TXN-2024-020', date:'2024-07-20', timestamp:'2024-07-20T15:30:00Z', accountCode:'EXP-107', coa_code:'COA-2007', category:'Expenditure', description:'VSAT Internet Upgrade — 100Mbps Dedicated Line (Annual)',               debit:960000,   credit:0,        balance:4490000,  status:'Pending',  enteredBy:'Chukwuma Obi (Data Entry)',     created_by:'USR-001', approvedBy:null,                                 approved_by:null },
];

// ─── Bank Statement Entries (for Reconciliation) ─────────────────────────────
// Deliberately includes mismatches and unmatched entries for demo purposes.
export const BANK_STATEMENTS = [
  { id:'BST-001', date:'2024-01-15', description:'FGN Subvention Credit — Ministry of Education',   credit:12500000, debit:0,       reference:'FMOE/24/Q1/002',    matchedTxn:'TXN-2024-001', status:'Matched' },
  { id:'BST-002', date:'2024-01-22', description:'UNICAL Salary Payroll Run — January',              credit:0,        debit:4800000, reference:'UNICAL/PAY/JAN24',  matchedTxn:'TXN-2024-002', status:'Matched' },
  { id:'BST-003', date:'2024-02-05', description:'TETFund Disbursement — Research Grant Tranche 1',  credit:5000000,  debit:0,       reference:'TF/RG/2024/0051',   matchedTxn:'TXN-2024-003', status:'Matched' },
  { id:'BST-004', date:'2024-02-14', description:'Equipment Payment — Dell Technologies Ltd',        credit:0,        debit:3150000, reference:'CHQ/00441',          matchedTxn:'TXN-2024-004', status:'Discrepancy', discrepancyAmount:50000, discrepancyNote:'Bank debit ₦3,150,000 differs from ledger ₦3,200,000 by ₦50,000' },
  { id:'BST-005', date:'2024-02-22', description:'Travel Advance — Staff Conference Allowance',      credit:0,        debit:285000,  reference:'TRF/ICSE/02',        matchedTxn:'TXN-2024-005', status:'Matched' },
  { id:'BST-006', date:'2024-03-01', description:'Portal Fees — Student Levy Collection',            credit:1875000,  debit:0,       reference:'PRT/LEVY/FEB24',    matchedTxn:'TXN-2024-006', status:'Matched' },
  { id:'BST-007', date:'2024-03-10', description:'EEDC — Faculty Electricity Bill Deduction',        credit:0,        debit:420000,  reference:'EEDC/BLK-A/MAR',    matchedTxn:'TXN-2024-007', status:'Matched' },
  { id:'BST-008', date:'2024-03-25', description:'Unidentified Debit — Processing Fee',              credit:0,        debit:45000,   reference:'AUTO/CHRG/MAR24',    matchedTxn:null,           status:'Unmatched', discrepancyNote:'No corresponding internal transaction found. Requires investigation.' },
  { id:'BST-009', date:'2024-04-02', description:'NDDC Consultancy Payment Received',                credit:2200000,  debit:0,       reference:'NDDC/SW/APR24',      matchedTxn:'TXN-2024-009', status:'Matched' },
  { id:'BST-010', date:'2024-04-15', description:'UNICAL Salary Payroll Run — April',                credit:0,        debit:4800000, reference:'UNICAL/PAY/APR24',   matchedTxn:'TXN-2024-010', status:'Matched' },
];

// ─── RECONCILIATIONS TABLE (Physical Schema) ──────────────────────────────────
// Fields: recon_id | txn_id | bank_ref | status (MATCHED|DISCREPANCY) | notes
export const RECONCILIATIONS = [
  { recon_id:'REC-001', txn_id:'TXN-2024-001', bank_ref:'FMOE/24/Q1/002',    status:'MATCHED',     notes:'Exact match confirmed by Auditor on 2024-01-16' },
  { recon_id:'REC-002', txn_id:'TXN-2024-002', bank_ref:'UNICAL/PAY/JAN24',  status:'MATCHED',     notes:'Payroll transfer matches IPPIS record' },
  { recon_id:'REC-003', txn_id:'TXN-2024-003', bank_ref:'TF/RG/2024/0051',   status:'MATCHED',     notes:'TETFund disbursement confirmed via GIFMIS portal' },
  { recon_id:'REC-004', txn_id:'TXN-2024-004', bank_ref:'CHQ/00441',          status:'DISCREPANCY', notes:'Bank records ₦3,150,000; ledger shows ₦3,200,000. ₦50k variance under investigation' },
  { recon_id:'REC-005', txn_id:'TXN-2024-005', bank_ref:'TRF/ICSE/02',        status:'MATCHED',     notes:'Travel advance confirmed by HR Dept' },
  { recon_id:'REC-006', txn_id:'TXN-2024-006', bank_ref:'PRT/LEVY/FEB24',    status:'MATCHED',     notes:'Portal collection matched against Student Affairs register' },
  { recon_id:'REC-007', txn_id:'TXN-2024-007', bank_ref:'EEDC/BLK-A/MAR',    status:'MATCHED',     notes:'EEDC invoice #EA-20240310 confirmed' },
  { recon_id:'REC-008', txn_id:null,            bank_ref:'AUTO/CHRG/MAR24',   status:'DISCREPANCY', notes:'Unidentified bank charge — no internal transaction reference. Escalated to Faculty Admin' },
  { recon_id:'REC-009', txn_id:'TXN-2024-009', bank_ref:'NDDC/SW/APR24',      status:'MATCHED',     notes:'NDDC payment letter ref #NDDC/2024/FC/01 on file' },
  { recon_id:'REC-010', txn_id:'TXN-2024-010', bank_ref:'UNICAL/PAY/APR24',  status:'MATCHED',     notes:'April payroll run verified with Bursary records' },
];

// ─── Budget Lines (for Variance Analysis) ────────────────────────────────────
export const BUDGET_LINES = [
  { category:'Staff Salaries & Emoluments',        accountCode:'EXP-101', budgeted:28800000, actual:29600000 },
  { category:'Research & Academic Materials',      accountCode:'EXP-102', budgeted:2000000,  actual:680000   },
  { category:'Laboratory Equipment & Supplies',    accountCode:'EXP-103', budgeted:3500000,  actual:4075000  },
  { category:'Utilities & Maintenance',            accountCode:'EXP-104', budgeted:1800000,  actual:420000   },
  { category:'Travel & Conference Expenses',       accountCode:'EXP-105', budgeted:800000,   actual:905000   },
  { category:'Office & Administrative Expenses',   accountCode:'EXP-106', budgeted:500000,   actual:195000   },
  { category:'ICT Infrastructure & Subscriptions', accountCode:'EXP-107', budgeted:900000,   actual:1100000  },
  { category:'Student Welfare & Scholarships',     accountCode:'EXP-108', budgeted:600000,   actual:500000   },
  { category:'Government Grants (Revenue)',        accountCode:'REV-001', budgeted:50000000, actual:12500000 },
  { category:'TETFund Research Revenue',           accountCode:'REV-002', budgeted:5000000,  actual:5000000  },
];

// ─── BUDGETS TABLE (Physical Schema) ─────────────────────────────────────────
// Fields: budget_id | coa_code | allocated_amount | actual_spent | fiscal_year
export const BUDGETS = [
  { budget_id:'BUD-2024-001', coa_code:'COA-2001', allocated_amount:28800000, actual_spent:29600000, fiscal_year:2024 },
  { budget_id:'BUD-2024-002', coa_code:'COA-2002', allocated_amount:2000000,  actual_spent:680000,   fiscal_year:2024 },
  { budget_id:'BUD-2024-003', coa_code:'COA-2003', allocated_amount:3500000,  actual_spent:4075000,  fiscal_year:2024 },
  { budget_id:'BUD-2024-004', coa_code:'COA-2004', allocated_amount:1800000,  actual_spent:420000,   fiscal_year:2024 },
  { budget_id:'BUD-2024-005', coa_code:'COA-2005', allocated_amount:800000,   actual_spent:905000,   fiscal_year:2024 },
  { budget_id:'BUD-2024-006', coa_code:'COA-2006', allocated_amount:500000,   actual_spent:195000,   fiscal_year:2024 },
  { budget_id:'BUD-2024-007', coa_code:'COA-2007', allocated_amount:900000,   actual_spent:1100000,  fiscal_year:2024 },
  { budget_id:'BUD-2024-008', coa_code:'COA-2008', allocated_amount:600000,   actual_spent:500000,   fiscal_year:2024 },
  { budget_id:'BUD-2024-009', coa_code:'COA-1001', allocated_amount:50000000, actual_spent:12500000, fiscal_year:2024 },
  { budget_id:'BUD-2024-010', coa_code:'COA-1002', allocated_amount:5000000,  actual_spent:5000000,  fiscal_year:2024 },
];

// ─── Approval Workflow Queue ──────────────────────────────────────────────────
export const INITIAL_APPROVALS = [
  {
    id:'APR-001', txnId:'TXN-2024-013',
    description:'Merit Scholarships — Top 10 Final Year Students',
    amount:500000, requestedBy:'Ngozi Eze (Data Entry)', requestDate:'2024-05-20',
    currentStage:1, priority:'Normal', category:'Expenditure',
    stageHistory:[{ stage:0, actor:'Ngozi Eze', action:'Submitted', timestamp:'2024-05-20T09:15:00Z' }],
  },
  {
    id:'APR-002', txnId:'TXN-2024-014',
    description:'Network Switch & Fibre Cabling — Lab 1 Upgrade',
    amount:875000, requestedBy:'Ngozi Eze (Data Entry)', requestDate:'2024-06-03',
    currentStage:1, priority:'High', category:'Expenditure',
    stageHistory:[{ stage:0, actor:'Ngozi Eze', action:'Submitted', timestamp:'2024-06-03T10:30:00Z' }],
  },
  {
    id:'APR-003', txnId:'TXN-2024-008',
    description:'Microsoft Campus Agreement — Office 365 & Azure',
    amount:1100000, requestedBy:'Ngozi Eze (Data Entry)', requestDate:'2024-03-18',
    currentStage:1, priority:'Normal', category:'Expenditure',
    flagNote:'Vendor invoice number missing. Pending verification.',
    stageHistory:[
      { stage:0, actor:'Ngozi Eze', action:'Submitted', timestamp:'2024-03-18T14:00:00Z' },
      { stage:1, actor:'Dr. Effiong Bassey', action:'Flagged for Review', timestamp:'2024-03-20T11:20:00Z', note:'Vendor invoice number missing.' },
    ],
  },
  {
    id:'APR-004', txnId:'TXN-2024-016',
    description:'NCC Research Partnership Grant — Cybersecurity Lab',
    amount:3500000, requestedBy:'Dr. Amaka Nwosu (Lecturer)', requestDate:'2024-06-15',
    currentStage:2, priority:'Urgent', category:'Revenue',
    stageHistory:[
      { stage:0, actor:'Dr. Amaka Nwosu', action:'Submitted', timestamp:'2024-06-15T08:00:00Z' },
      { stage:1, actor:'Dr. Effiong Bassey', action:'Approved', timestamp:'2024-06-16T09:45:00Z' },
    ],
  },
  {
    id:'APR-005', txnId:'TXN-2024-020',
    description:'VSAT Internet Upgrade — 100Mbps Dedicated Line',
    amount:960000, requestedBy:'Chukwuma Obi (Data Entry)', requestDate:'2024-07-20',
    currentStage:1, priority:'High', category:'Expenditure',
    stageHistory:[{ stage:0, actor:'Chukwuma Obi', action:'Submitted', timestamp:'2024-07-20T15:30:00Z' }],
  },
];

// ─── AUDIT LOGS TABLE (Physical Schema) ──────────────────────────────────────
// Fields: log_id | timestamp | user_id | role | action_type | module | details | ip_address
export const INITIAL_AUDIT_LOG = [
  { id:'AUD-001', log_id:'AUD-001', timestamp:'2024-01-15T08:30:00Z', user:'Chukwuma Obi',       user_id:'USR-001', role:'Data Entry Officer',      action:'Created Record',          action_type:'CREATE',     module:'Transactions',      recordRef:'TXN-2024-001', description:'Posted FGN Subvention Q1 2024 receipt — ₦12,500,000',               details:'COA: COA-1001 | Amount: ₦12,500,000 Credit | Status: PENDING',                           outcome:'Success',                      ipAddress:'10.20.5.101', ip_address:'10.20.5.101' },
  { id:'AUD-002', log_id:'AUD-002', timestamp:'2024-01-15T14:12:00Z', user:'Dr. Effiong Bassey', user_id:'USR-003', role:'Auditor',                  action:'Approved Record',         action_type:'APPROVE',    module:'ApprovalWorkflow',  recordRef:'TXN-2024-001', description:'Auditor reviewed and approved FGN Subvention posting',               details:'Status changed: PENDING → APPROVED',                                                      outcome:'Success',                      ipAddress:'10.20.5.210', ip_address:'10.20.5.210' },
  { id:'AUD-003', log_id:'AUD-003', timestamp:'2024-01-22T09:05:00Z', user:'Chukwuma Obi',       user_id:'USR-001', role:'Data Entry Officer',      action:'Created Record',          action_type:'CREATE',     module:'Transactions',      recordRef:'TXN-2024-002', description:'Posted January 2024 staff salary disbursement — ₦4,800,000',         details:'COA: COA-2001 | Amount: ₦4,800,000 Debit | Status: PENDING',                             outcome:'Success',                      ipAddress:'10.20.5.101', ip_address:'10.20.5.101' },
  { id:'AUD-004', log_id:'AUD-004', timestamp:'2024-02-05T11:20:00Z', user:'Ngozi Eze',           user_id:'USR-002', role:'Data Entry Officer',      action:'Created Record',          action_type:'CREATE',     module:'Transactions',      recordRef:'TXN-2024-003', description:'Posted TETFund Research Grant receipt — ₦5,000,000',                 details:'COA: COA-1002 | Amount: ₦5,000,000 Credit | Status: PENDING',                            outcome:'Success',                      ipAddress:'10.20.5.105', ip_address:'10.20.5.105' },
  { id:'AUD-005', log_id:'AUD-005', timestamp:'2024-02-14T10:55:00Z', user:'Ngozi Eze',           user_id:'USR-002', role:'Data Entry Officer',      action:'Created Record',          action_type:'CREATE',     module:'Transactions',      recordRef:'TXN-2024-004', description:'Posted Dell workstation procurement — ₦3,200,000',                   details:'COA: COA-2003 | Amount: ₦3,200,000 Debit | Vendor: Dell Technologies Ltd',               outcome:'Success',                      ipAddress:'10.20.5.105', ip_address:'10.20.5.105' },
  { id:'AUD-006', log_id:'AUD-006', timestamp:'2024-02-14T16:30:00Z', user:'Prof. Asuquo Edet',   user_id:'USR-004', role:'Faculty Administrator',   action:'Approved Record',         action_type:'APPROVE',    module:'ApprovalWorkflow',  recordRef:'TXN-2024-004', description:'Faculty Admin final approval for capital expenditure > ₦2M',         details:'Status changed: AUDITOR_APPROVED → APPROVED | Threshold: ₦2,000,000',                    outcome:'Success',                      ipAddress:'10.20.5.300', ip_address:'10.20.5.300' },
  { id:'AUD-007', log_id:'AUD-007', timestamp:'2024-03-18T15:40:00Z', user:'Ngozi Eze',           user_id:'USR-002', role:'Data Entry Officer',      action:'Created Record',          action_type:'CREATE',     module:'Transactions',      recordRef:'TXN-2024-008', description:'Posted Microsoft Campus Agreement renewal — ₦1,100,000',             details:'COA: COA-2007 | Amount: ₦1,100,000 Debit | Vendor: Microsoft Corporation',               outcome:'Success',                      ipAddress:'10.20.5.105', ip_address:'10.20.5.105' },
  { id:'AUD-008', log_id:'AUD-008', timestamp:'2024-03-20T11:20:00Z', user:'Dr. Effiong Bassey', user_id:'USR-003', role:'Auditor',                  action:'Flagged Record',          action_type:'FLAG',       module:'ApprovalWorkflow',  recordRef:'TXN-2024-008', description:'Flagged Microsoft agreement — vendor invoice number absent',           details:'Reason: Invoice number missing | Status changed: PENDING → FLAGGED',                      outcome:'Flagged — Pending Resolution', ipAddress:'10.20.5.210', ip_address:'10.20.5.210' },
  { id:'AUD-009', log_id:'AUD-009', timestamp:'2024-05-20T09:15:00Z', user:'Ngozi Eze',           user_id:'USR-002', role:'Data Entry Officer',      action:'Submitted for Approval',  action_type:'SUBMIT',     module:'ApprovalWorkflow',  recordRef:'TXN-2024-013', description:'Submitted Merit Scholarship disbursement for workflow approval',      details:'Stage: 0 (Data Entry) → 1 (Auditor Review) | Amount: ₦500,000',                          outcome:'Pending Auditor Review',       ipAddress:'10.20.5.105', ip_address:'10.20.5.105' },
  { id:'AUD-010', log_id:'AUD-010', timestamp:'2024-06-10T14:00:00Z', user:'Prof. Asuquo Edet',   user_id:'USR-004', role:'Faculty Administrator',   action:'Rejected Record',         action_type:'REJECT',     module:'ApprovalWorkflow',  recordRef:'TXN-2024-015', description:'Rejected NITDA Workshop — identified as duplicate of TXN-2024-005',   details:'Reason: Duplicate. Original ref TXN-2024-005 processed on 2024-02-22',                    outcome:'Rejected',                     ipAddress:'10.20.5.300', ip_address:'10.20.5.300' },
  { id:'AUD-011', log_id:'AUD-011', timestamp:'2024-06-15T08:30:00Z', user:'Dr. Amaka Nwosu',     user_id:'USR-005', role:'Data Entry Officer',      action:'Created Record',          action_type:'CREATE',     module:'Transactions',      recordRef:'TXN-2024-016', description:'Posted NCC Research Partnership Grant — ₦3,500,000',                 details:'COA: COA-1002 | Amount: ₦3,500,000 Credit | Ref: NCC/2024/FC/001',                       outcome:'Success',                      ipAddress:'10.20.5.115', ip_address:'10.20.5.115' },
  { id:'AUD-012', log_id:'AUD-012', timestamp:'2024-07-05T09:20:00Z', user:'Ngozi Eze',           user_id:'USR-002', role:'Data Entry Officer',      action:'Created Record',          action_type:'CREATE',     module:'Transactions',      recordRef:'TXN-2024-018', description:'Posted Acceptance Fee Collection 2024/2025 — ₦4,500,000',            details:'COA: COA-1003 | Amount: ₦4,500,000 Credit | 300 students',                               outcome:'Success',                      ipAddress:'10.20.5.105', ip_address:'10.20.5.105' },
  { id:'AUD-013', log_id:'AUD-013', timestamp:'2024-07-12T10:30:00Z', user:'Prof. Asuquo Edet',   user_id:'USR-004', role:'Faculty Administrator',   action:'Approved Record',         action_type:'APPROVE',    module:'ApprovalWorkflow',  recordRef:'TXN-2024-019', description:'Approved HP ProBook procurement for PG Research Lab — ₦1,850,000',   details:'Status changed: AUDITOR_APPROVED → APPROVED | Vendor: HP Nigeria Ltd',                    outcome:'Success',                      ipAddress:'10.20.5.300', ip_address:'10.20.5.300' },
  { id:'AUD-014', log_id:'AUD-014', timestamp:'2024-07-20T15:35:00Z', user:'Chukwuma Obi',       user_id:'USR-001', role:'Data Entry Officer',      action:'Submitted for Approval',  action_type:'SUBMIT',     module:'ApprovalWorkflow',  recordRef:'TXN-2024-020', description:'Submitted VSAT Internet upgrade for approval — ₦960,000',            details:'Stage: 0 → 1 (Auditor Review) | Provider: Spectranet Nigeria',                            outcome:'Pending Auditor Review',       ipAddress:'10.20.5.101', ip_address:'10.20.5.101' },
  { id:'AUD-015', log_id:'AUD-015', timestamp:'2024-07-22T08:00:00Z', user:'System',              user_id:'SYS-001', role:'System',                  action:'Reconciliation Run',      action_type:'RECONCILE',  module:'Reconciliation',    recordRef:'REC-BATCH-JUL24', description:'Automated reconciliation batch — July 2024 bank statement processed', details:'10 entries processed | 8 Matched | 1 Discrepancy | 1 Unmatched',                          outcome:'Success — Review Required',    ipAddress:'127.0.0.1',   ip_address:'127.0.0.1' },
];

// ─── Defense Mode: Audit Principle Explanations ──────────────────────────────
export const DEFENSE_PRINCIPLES = {
  dashboard: {
    title:'Real-Time Financial Oversight',
    principle:'IPSAS 24: Presentation of Budget Information in Financial Statements',
    explanation:'The dashboard provides an executive overview of the faculty\'s financial position, enabling management to monitor budget utilization in real-time. This aligns with IPSAS 24, which mandates public sector entities to disclose comparison between budgeted and actual amounts. The KPI cards provide immediate visibility into unresolved discrepancies, supporting the auditing principle of completeness — ensuring all financial activity is captured and visible.',
    icon:'BarChart3',
  },
  coa: {
    title:'Standardized Chart of Accounts & Double-Entry Bookkeeping',
    principle:'IPSAS 1: Presentation of Financial Statements & ISA 500: Audit Evidence',
    explanation:'The Chart of Accounts (COA) provides a standardized classification framework for all financial transactions. Each entry follows double-entry bookkeeping (debit = credit), ensuring mathematical accuracy. Account codes (e.g., COA-2003, COA-1001) enable systematic categorization per IPSAS 1 disclosure requirements. The validation rules enforce completeness and accuracy — two fundamental assertions in ISA 500 audit evidence standards.',
    icon:'BookOpen',
  },
  reconciliation: {
    title:'Bank Reconciliation & Data Integrity',
    principle:'ISA 505: External Confirmations & ISA 330: Responses to Assessed Risks',
    explanation:'Reconciliation compares internal faculty ledger records against external bank statements to detect errors, omissions, or fraud. Per ISA 505, auditors must obtain external confirmations as audit evidence. Highlighted discrepancies demonstrate the system\'s ability to detect material misstatements — a core objective of substantive audit procedures under ISA 330. The color-coded matching interface provides instant visual evidence of financial data integrity.',
    icon:'GitCompare',
  },
  variance: {
    title:'Budget Variance Analysis & Anomaly Detection',
    principle:'IPSAS 24: Budget Comparatives & ISA 520: Analytical Procedures',
    explanation:'Variance analysis compares budgeted allocations against actual expenditures to identify significant deviations. ISA 520 requires auditors to apply analytical procedures to detect unusual relationships that may indicate misstatements. Items exceeding 15% variance are flagged as anomalies — a threshold-based approach consistent with materiality assessment principles. Red highlights indicate over-budget spending requiring management explanation, while green indicates favorable savings.',
    icon:'TrendingUp',
  },
  approval: {
    title:'Segregation of Duties & Authorization Controls',
    principle:'COSO Internal Control Framework: Control Activities & ISA 315',
    explanation:'The multi-level approval workflow enforces segregation of duties — a fundamental internal control principle. No single individual can initiate, authorize, and record a transaction. The three-stage pipeline (Data Entry → Auditor → Faculty Admin) ensures that transactions above materiality thresholds receive appropriate authorization levels. This design directly addresses ISA 315\'s requirement for entities to implement authorization controls to prevent unauthorized transactions.',
    icon:'GitBranch',
  },
  auditTrail: {
    title:'Electronic Audit Trail & Non-Repudiation',
    principle:'ISA 230: Audit Documentation & ISAE 3402: Assurance on Controls',
    explanation:'The immutable audit trail captures every system action with timestamp, user identity, and outcome — creating an indelible record that satisfies ISA 230\'s audit documentation requirements. Non-repudiation ensures that no user can deny their recorded actions, which is critical for accountability. The locked (read-only) nature of the log demonstrates the control principle that audit evidence must be preserved in its original form, protecting against record tampering.',
    icon:'Shield',
  },
  docs: {
    title:'Academic Documentation & System Design Methodology',
    principle:'OOD: Object-Oriented Design Principles & SDLC: Structured Development Lifecycle',
    explanation:'This section presents the complete academic documentation for the Computerised Financial Audit Support System (CFASS) as developed for the Faculty of Computing, University of Calabar. It covers Chapter 3 (System Analysis and Design Methodology) with full OOD diagrams, logical and physical design specifications, and Chapter 4 (System Implementation) with testing strategies, technology justification, and operational results.',
    icon:'BookMarked',
  },
};
