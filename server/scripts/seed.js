/**
 * seed.js — Comprehensive Mock Data Populator for MongoDB
 * Faculty of Computing, University of Calabar (CFASS)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import ChartOfAccount from '../models/ChartOfAccount.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Reconciliation from '../models/Reconciliation.js';
import AuditLog from '../models/AuditLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const SEED_USERS = [
  {
    user_id: 'USR-001',
    full_name: 'Chukwuma Obi',
    email: 'c.obi@unical.edu.ng',
    role: 'DATA_ENTRY',
    password_hash: '$2b$10$xK9vD1QmLpR3sT8uW4yZ6e0.c9FfQ6vE5B3.z9a5M3p7h1aB2c3d4', // password123
    created_at: new Date('2023-09-01T08:00:00Z'),
  },
  {
    user_id: 'USR-002',
    full_name: 'Ngozi Eze',
    email: 'n.eze@unical.edu.ng',
    role: 'DATA_ENTRY',
    password_hash: '$2b$10$xK9vD1QmLpR3sT8uW4yZ6e0.c9FfQ6vE5B3.z9a5M3p7h1aB2c3d4',
    created_at: new Date('2023-09-01T08:30:00Z'),
  },
  {
    user_id: 'USR-003',
    full_name: 'Dr. Effiong Bassey',
    email: 'admin@unical.edu.ng',
    role: 'AUDITOR',
    password_hash: '$2b$10$xK9vD1QmLpR3sT8uW4yZ6e0.c9FfQ6vE5B3.z9a5M3p7h1aB2c3d4',
    created_at: new Date('2023-08-15T09:00:00Z'),
  },
  {
    user_id: 'USR-004',
    full_name: 'Prof. Asuquo Edet',
    email: 'a.edet@unical.edu.ng',
    role: 'ADMIN',
    password_hash: '$2b$10$xK9vD1QmLpR3sT8uW4yZ6e0.c9FfQ6vE5B3.z9a5M3p7h1aB2c3d4',
    created_at: new Date('2023-08-15T09:30:00Z'),
  },
  {
    user_id: 'USR-005',
    full_name: 'Dr. Amaka Nwosu',
    email: 'a.nwosu@unical.edu.ng',
    role: 'DATA_ENTRY',
    password_hash: '$2b$10$xK9vD1QmLpR3sT8uW4yZ6e0.c9FfQ6vE5B3.z9a5M3p7h1aB2c3d4',
    created_at: new Date('2023-10-01T10:00:00Z'),
  },
];

const SEED_COAS = [
  { coa_code: 'COA-1001', legacy_code: 'REV-001', name: 'Government Grants & Subventions', category: 'Revenue' },
  { coa_code: 'COA-1002', legacy_code: 'REV-002', name: 'Tetfund Research Allocation', category: 'Revenue' },
  { coa_code: 'COA-1003', legacy_code: 'REV-003', name: 'Student Tuition & Levies', category: 'Revenue' },
  { coa_code: 'COA-1004', legacy_code: 'REV-004', name: 'Consultancy & IGR', category: 'Revenue' },
  { coa_code: 'COA-2001', legacy_code: 'EXP-101', name: 'Staff Salaries & Emoluments', category: 'Expenditure' },
  { coa_code: 'COA-2002', legacy_code: 'EXP-102', name: 'Research & Academic Materials', category: 'Expenditure' },
  { coa_code: 'COA-2003', legacy_code: 'EXP-103', name: 'Laboratory Equipment & Supplies', category: 'Expenditure' },
  { coa_code: 'COA-2004', legacy_code: 'EXP-104', name: 'Utilities & Maintenance', category: 'Expenditure' },
  { coa_code: 'COA-2005', legacy_code: 'EXP-105', name: 'Travel & Conference Expenses', category: 'Expenditure' },
  { coa_code: 'COA-2006', legacy_code: 'EXP-106', name: 'Office & Administrative Expenses', category: 'Expenditure' },
  { coa_code: 'COA-2007', legacy_code: 'EXP-107', name: 'ICT Infrastructure & Subscriptions', category: 'Expenditure' },
  { coa_code: 'COA-2008', legacy_code: 'EXP-108', name: 'Student Welfare & Scholarships', category: 'Expenditure' },
  { coa_code: 'COA-3001', legacy_code: 'ASS-201', name: 'Computer Lab Assets', category: 'Assets' },
  { coa_code: 'COA-4001', legacy_code: 'LIA-301', name: 'Vendor Payables', category: 'Liabilities' },
];

const SEED_TRANSACTIONS = [
  { txn_id: 'TXN-2024-001', coa_code: 'COA-1001', category: 'Revenue', description: 'FGN Subvention Q1 2024 — Federal Government Release', debit: 0, credit: 12500000, balance: 12500000, status: 'Approved', created_by: 'USR-001', approved_by: 'USR-003', timestamp: new Date('2024-01-15T08:30:00Z') },
  { txn_id: 'TXN-2024-002', coa_code: 'COA-2001', category: 'Expenditure', description: 'Staff Salaries — January 2024 (Academic + Non-Academic)', debit: 4800000, credit: 0, balance: 7700000, status: 'Approved', created_by: 'USR-001', approved_by: 'USR-003', timestamp: new Date('2024-01-22T09:05:00Z') },
  { txn_id: 'TXN-2024-003', coa_code: 'COA-1002', category: 'Revenue', description: 'TETFund Research Grant — AI & Machine Learning Lab Project', debit: 0, credit: 5000000, balance: 12700000, status: 'Approved', created_by: 'USR-002', approved_by: 'USR-003', timestamp: new Date('2024-02-05T11:20:00Z') },
  { txn_id: 'TXN-2024-004', coa_code: 'COA-2003', category: 'Expenditure', description: 'Procurement: 20× Dell Workstations for CS Lab 3', debit: 3200000, credit: 0, balance: 9500000, status: 'Approved', created_by: 'USR-002', approved_by: 'USR-004', timestamp: new Date('2024-02-14T10:55:00Z') },
  { txn_id: 'TXN-2024-005', coa_code: 'COA-2005', category: 'Expenditure', description: 'IEEE Conference Travel — Dr. Amaka Nwosu (ICSE Lagos)', debit: 285000, credit: 0, balance: 9215000, status: 'Approved', created_by: 'USR-001', approved_by: 'USR-003', timestamp: new Date('2024-02-22T13:15:00Z') },
  { txn_id: 'TXN-2024-006', coa_code: 'COA-1003', category: 'Revenue', description: 'Student Portal Fees — 2023/2024 Academic Session (500-Level)', debit: 0, credit: 1875000, balance: 11090000, status: 'Approved', created_by: 'USR-002', approved_by: 'USR-003', timestamp: new Date('2024-03-01T09:45:00Z') },
  { txn_id: 'TXN-2024-007', coa_code: 'COA-2004', category: 'Expenditure', description: 'EEDC Power Bills — Q1 2024 (Faculty Block A & B)', debit: 420000, credit: 0, balance: 10670000, status: 'Approved', created_by: 'USR-001', approved_by: 'USR-003', timestamp: new Date('2024-03-10T11:00:00Z') },
  { txn_id: 'TXN-2024-008', coa_code: 'COA-2007', category: 'Expenditure', description: 'Annual Microsoft Campus Agreement Renewal — Office 365 & Azure', debit: 1100000, credit: 0, balance: 9570000, status: 'Flagged', flag_reason: 'Vendor invoice number missing. Pending verification.', created_by: 'USR-002', approved_by: null, timestamp: new Date('2024-03-18T15:40:00Z') },
  { txn_id: 'TXN-2024-009', coa_code: 'COA-1004', category: 'Revenue', description: 'NDDC Software Dev Consultancy — State Enterprise Project', debit: 0, credit: 2200000, balance: 11770000, status: 'Approved', created_by: 'USR-002', approved_by: 'USR-004', timestamp: new Date('2024-04-02T10:30:00Z') },
  { txn_id: 'TXN-2024-010', coa_code: 'COA-2001', category: 'Expenditure', description: 'Staff Salaries — April 2024 (Academic + Non-Academic)', debit: 4800000, credit: 0, balance: 6970000, status: 'Approved', created_by: 'USR-001', approved_by: 'USR-003', timestamp: new Date('2024-04-15T09:30:00Z') },
  { txn_id: 'TXN-2024-011', coa_code: 'COA-2002', category: 'Expenditure', description: 'Journal Subscriptions: IEEE Xplore + ACM DL (Annual)', debit: 680000, credit: 0, balance: 6290000, status: 'Approved', created_by: 'USR-002', approved_by: 'USR-003', timestamp: new Date('2024-04-28T14:00:00Z') },
  { txn_id: 'TXN-2024-012', coa_code: 'COA-2006', category: 'Expenditure', description: 'Stationery, Printing & Binding — End of Semester Exams', debit: 195000, credit: 0, balance: 6095000, status: 'Approved', created_by: 'USR-001', approved_by: 'USR-003', timestamp: new Date('2024-05-06T10:20:00Z') },
  { txn_id: 'TXN-2024-013', coa_code: 'COA-2008', category: 'Expenditure', description: 'Merit Scholarships — Top 10 Final Year Students (2023/2024)', debit: 500000, credit: 0, balance: 5595000, status: 'Pending', created_by: 'USR-002', approved_by: null, timestamp: new Date('2024-05-20T09:15:00Z') },
  { txn_id: 'TXN-2024-014', coa_code: 'COA-2003', category: 'Expenditure', description: 'Network Switch & Fibre Cabling — Lab 1 Infrastructure Upgrade', debit: 875000, credit: 0, balance: 4720000, status: 'Pending', created_by: 'USR-002', approved_by: null, timestamp: new Date('2024-06-03T10:30:00Z') },
  { txn_id: 'TXN-2024-015', coa_code: 'COA-2005', category: 'Expenditure', description: 'NITDA Workshop Attendance — 4 Staff Members (Abuja)', debit: 620000, credit: 0, balance: 4100000, status: 'Rejected', flag_reason: 'Duplicate submission. Original TXN-2024-005 already processed.', created_by: 'USR-001', approved_by: 'USR-004', timestamp: new Date('2024-06-10T14:00:00Z') },
  { txn_id: 'TXN-2024-016', coa_code: 'COA-1002', category: 'Revenue', description: 'NCC Research Partnership Grant — Cybersecurity Lab Tranche 1', debit: 0, credit: 3500000, balance: 7600000, status: 'Approved', created_by: 'USR-005', approved_by: 'USR-003', timestamp: new Date('2024-06-15T08:00:00Z') },
  { txn_id: 'TXN-2024-017', coa_code: 'COA-2001', category: 'Expenditure', description: 'Staff Salaries — June 2024 (Academic + Non-Academic)', debit: 4800000, credit: 0, balance: 2800000, status: 'Approved', created_by: 'USR-001', approved_by: 'USR-003', timestamp: new Date('2024-06-28T11:45:00Z') },
  { txn_id: 'TXN-2024-018', coa_code: 'COA-1003', category: 'Revenue', description: 'Acceptance Fee Collection — 2024/2025 Incoming Batch (300 Students)', debit: 0, credit: 4500000, balance: 7300000, status: 'Approved', created_by: 'USR-002', approved_by: 'USR-003', timestamp: new Date('2024-07-05T09:20:00Z') },
  { txn_id: 'TXN-2024-019', coa_code: 'COA-2003', category: 'Expenditure', description: '10× HP ProBook Laptops — Postgraduate Research Lab', debit: 1850000, credit: 0, balance: 5450000, status: 'Approved', created_by: 'USR-002', approved_by: 'USR-004', timestamp: new Date('2024-07-12T10:00:00Z') },
  { txn_id: 'TXN-2024-020', coa_code: 'COA-2007', category: 'Expenditure', description: 'VSAT Internet Upgrade — 100Mbps Dedicated Line (Annual)', debit: 960000, credit: 0, balance: 4490000, status: 'Pending', created_by: 'USR-001', approved_by: null, timestamp: new Date('2024-07-20T15:30:00Z') },
];

const SEED_BUDGETS = [
  { budget_id: 'BUD-2024-001', coa_code: 'COA-2001', allocated_amount: 28800000, actual_spent: 29600000, fiscal_year: 2024 },
  { budget_id: 'BUD-2024-002', coa_code: 'COA-2002', allocated_amount: 2000000,  actual_spent: 680000,   fiscal_year: 2024 },
  { budget_id: 'BUD-2024-003', coa_code: 'COA-2003', allocated_amount: 3500000,  actual_spent: 4075000,  fiscal_year: 2024 },
  { budget_id: 'BUD-2024-004', coa_code: 'COA-2004', allocated_amount: 1800000,  actual_spent: 420000,   fiscal_year: 2024 },
  { budget_id: 'BUD-2024-005', coa_code: 'COA-2005', allocated_amount: 800000,   actual_spent: 905000,   fiscal_year: 2024 },
  { budget_id: 'BUD-2024-006', coa_code: 'COA-2006', allocated_amount: 500000,   actual_spent: 195000,   fiscal_year: 2024 },
  { budget_id: 'BUD-2024-007', coa_code: 'COA-2007', allocated_amount: 900000,   actual_spent: 1100000,  fiscal_year: 2024 },
  { budget_id: 'BUD-2024-008', coa_code: 'COA-2008', allocated_amount: 600000,   actual_spent: 500000,   fiscal_year: 2024 },
  { budget_id: 'BUD-2024-009', coa_code: 'COA-1001', allocated_amount: 50000000, actual_spent: 12500000, fiscal_year: 2024 },
  { budget_id: 'BUD-2024-010', coa_code: 'COA-1002', allocated_amount: 5000000,  actual_spent: 5000000,  fiscal_year: 2024 },
];

const SEED_RECONCILIATIONS = [
  { recon_id: 'REC-001', txn_id: 'TXN-2024-001', bank_ref: 'FMOE/24/Q1/002',    bank_amount: 12500000, internal_amount: 12500000, status: 'MATCHED',     discrepancy_amount: 0,     notes: 'Exact match confirmed by Auditor on 2024-01-16' },
  { recon_id: 'REC-002', txn_id: 'TXN-2024-002', bank_ref: 'UNICAL/PAY/JAN24',  bank_amount: 4800000,  internal_amount: 4800000,  status: 'MATCHED',     discrepancy_amount: 0,     notes: 'Payroll transfer matches IPPIS record' },
  { recon_id: 'REC-003', txn_id: 'TXN-2024-003', bank_ref: 'TF/RG/2024/0051',   bank_amount: 5000000,  internal_amount: 5000000,  status: 'MATCHED',     discrepancy_amount: 0,     notes: 'TETFund disbursement confirmed via GIFMIS portal' },
  { recon_id: 'REC-004', txn_id: 'TXN-2024-004', bank_ref: 'CHQ/00441',          bank_amount: 3150000,  internal_amount: 3200000,  status: 'DISCREPANCY', discrepancy_amount: 50000, notes: 'Bank records ₦3,150,000; ledger shows ₦3,200,000. ₦50k variance under investigation' },
  { recon_id: 'REC-005', txn_id: 'TXN-2024-005', bank_ref: 'TRF/ICSE/02',       bank_amount: 285000,   internal_amount: 285000,   status: 'MATCHED',     discrepancy_amount: 0,     notes: 'Travel advance confirmed by HR Dept' },
  { recon_id: 'REC-006', txn_id: 'TXN-2024-006', bank_ref: 'PRT/LEVY/FEB24',    bank_amount: 1875000,  internal_amount: 1875000,  status: 'MATCHED',     discrepancy_amount: 0,     notes: 'Portal collection matched against Student Affairs register' },
  { recon_id: 'REC-007', txn_id: 'TXN-2024-007', bank_ref: 'EEDC/BLK-A/MAR',    bank_amount: 420000,   internal_amount: 420000,   status: 'MATCHED',     discrepancy_amount: 0,     notes: 'EEDC invoice #EA-20240310 confirmed' },
  { recon_id: 'REC-008', txn_id: null,            bank_ref: 'AUTO/CHRG/MAR24',   bank_amount: 45000,    internal_amount: 0,        status: 'UNMATCHED',   discrepancy_amount: 45000, notes: 'Unidentified bank charge — no internal transaction reference. Escalated to Faculty Admin' },
  { recon_id: 'REC-009', txn_id: 'TXN-2024-009', bank_ref: 'NDDC/SW/APR24',      bank_amount: 2200000,  internal_amount: 2200000,  status: 'MATCHED',     discrepancy_amount: 0,     notes: 'NDDC payment letter ref #NDDC/2024/FC/01 on file' },
  { recon_id: 'REC-010', txn_id: 'TXN-2024-010', bank_ref: 'UNICAL/PAY/APR24',  bank_amount: 4800000,  internal_amount: 4800000,  status: 'MATCHED',     discrepancy_amount: 0,     notes: 'April payroll run verified with Bursary records' },
];

const SEED_AUDIT_LOGS = [
  { log_id: 'AUD-001', timestamp: new Date('2024-01-15T08:30:00Z'), user_id: 'USR-001', role: 'Data Entry Officer', action_type: 'CREATE', module: 'Transactions', details: 'Posted FGN Subvention Q1 2024 receipt — ₦12,500,000 | COA: COA-1001', ip_address: '10.20.5.101' },
  { log_id: 'AUD-002', timestamp: new Date('2024-01-15T14:12:00Z'), user_id: 'USR-003', role: 'Auditor', action_type: 'APPROVE', module: 'ApprovalWorkflow', details: 'Auditor reviewed and approved FGN Subvention posting (TXN-2024-001)', ip_address: '10.20.5.210' },
  { log_id: 'AUD-003', timestamp: new Date('2024-01-22T09:05:00Z'), user_id: 'USR-001', role: 'Data Entry Officer', action_type: 'CREATE', module: 'Transactions', details: 'Posted January 2024 staff salary disbursement — ₦4,800,000', ip_address: '10.20.5.101' },
  { log_id: 'AUD-004', timestamp: new Date('2024-02-05T11:20:00Z'), user_id: 'USR-002', role: 'Data Entry Officer', action_type: 'CREATE', module: 'Transactions', details: 'Posted TETFund Research Grant receipt — ₦5,000,000', ip_address: '10.20.5.105' },
  { log_id: 'AUD-005', timestamp: new Date('2024-02-14T10:55:00Z'), user_id: 'USR-002', role: 'Data Entry Officer', action_type: 'CREATE', module: 'Transactions', details: 'Posted Dell workstation procurement — ₦3,200,000 | Vendor: Dell Technologies Ltd', ip_address: '10.20.5.105' },
  { log_id: 'AUD-006', timestamp: new Date('2024-02-14T16:30:00Z'), user_id: 'USR-004', role: 'Faculty Administrator', action_type: 'APPROVE', module: 'ApprovalWorkflow', details: 'Faculty Admin final approval for capital expenditure > ₦2M (TXN-2024-004)', ip_address: '10.20.5.300' },
  { log_id: 'AUD-007', timestamp: new Date('2024-03-18T15:40:00Z'), user_id: 'USR-002', role: 'Data Entry Officer', action_type: 'CREATE', module: 'Transactions', details: 'Posted Microsoft Campus Agreement renewal — ₦1,100,000', ip_address: '10.20.5.105' },
  { log_id: 'AUD-008', timestamp: new Date('2024-03-20T11:20:00Z'), user_id: 'USR-003', role: 'Auditor', action_type: 'FLAG', module: 'ApprovalWorkflow', details: 'Flagged Microsoft agreement (TXN-2024-008) — vendor invoice number absent', ip_address: '10.20.5.210' },
  { log_id: 'AUD-009', timestamp: new Date('2024-05-20T09:15:00Z'), user_id: 'USR-002', role: 'Data Entry Officer', action_type: 'SUBMIT', module: 'ApprovalWorkflow', details: 'Submitted Merit Scholarship disbursement (TXN-2024-013) for workflow approval', ip_address: '10.20.5.105' },
  { log_id: 'AUD-010', timestamp: new Date('2024-06-10T14:00:00Z'), user_id: 'USR-004', role: 'Faculty Administrator', action_type: 'REJECT', module: 'ApprovalWorkflow', details: 'Rejected NITDA Workshop submission — identified as duplicate of TXN-2024-005', ip_address: '10.20.5.300' },
  { log_id: 'AUD-011', timestamp: new Date('2024-06-15T08:30:00Z'), user_id: 'USR-005', role: 'Data Entry Officer', action_type: 'CREATE', module: 'Transactions', details: 'Posted NCC Research Partnership Grant — ₦3,500,000 | Ref: NCC/2024/FC/001', ip_address: '10.20.5.115' },
  { log_id: 'AUD-012', timestamp: new Date('2024-07-05T09:20:00Z'), user_id: 'USR-002', role: 'Data Entry Officer', action_type: 'CREATE', module: 'Transactions', details: 'Posted Acceptance Fee Collection 2024/2025 — ₦4,500,000', ip_address: '10.20.5.105' },
  { log_id: 'AUD-013', timestamp: new Date('2024-07-12T10:30:00Z'), user_id: 'USR-004', role: 'Faculty Administrator', action_type: 'APPROVE', module: 'ApprovalWorkflow', details: 'Approved HP ProBook procurement for PG Research Lab — ₦1,850,000', ip_address: '10.20.5.300' },
  { log_id: 'AUD-014', timestamp: new Date('2024-07-20T15:35:00Z'), user_id: 'USR-001', role: 'Data Entry Officer', action_type: 'SUBMIT', module: 'ApprovalWorkflow', details: 'Submitted VSAT Internet upgrade for approval — ₦960,000', ip_address: '10.20.5.101' },
  { log_id: 'AUD-015', timestamp: new Date('2024-07-22T08:00:00Z'), user_id: 'SYS-001', role: 'System', action_type: 'RECONCILE', module: 'Reconciliation', details: 'Automated reconciliation batch — July 2024 bank statement processed (8 Matched, 1 Discrepancy, 1 Unmatched)', ip_address: '127.0.0.1' },
];

const seedDatabase = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cfass_db';
    console.log(`Connecting to MongoDB at: ${connUri}`);
    await mongoose.connect(connUri);

    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await ChartOfAccount.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    await Reconciliation.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('Seeding Users...');
    await User.insertMany(SEED_USERS);

    console.log('Seeding Chart of Accounts...');
    await ChartOfAccount.insertMany(SEED_COAS);

    console.log('Seeding Transactions...');
    await Transaction.insertMany(SEED_TRANSACTIONS);

    console.log('Seeding Budgets...');
    await Budget.insertMany(SEED_BUDGETS);

    console.log('Seeding Reconciliations...');
    await Reconciliation.insertMany(SEED_RECONCILIATIONS);

    console.log('Seeding Audit Trail Logs...');
    await AuditLog.insertMany(SEED_AUDIT_LOGS);

    console.log('✅ CFASS Database seeded successfully with Faculty of Computing mock data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
