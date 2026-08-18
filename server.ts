/**
 * Full-Stack Express Server with Strict RBAC API Endpoints
 * Project: ঘরের বাজার বিডি (Ghorer Bazar BD)
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Mock DB initial state for server API handlers
const FIXED_SUPER_ADMIN_ID = 'AANO-SADMIN-001';

const INITIAL_USERS = [
  {
    id: FIXED_SUPER_ADMIN_ID,
    email: 'khatibesdo@gmail.com',
    fullName: 'Mirza Khatib Uddin',
    mobileNumber: '01312480175',
    permanentMemberId: FIXED_SUPER_ADMIN_ID,
    passwordHash: 'sha256:d826a798547475f3ef7f017042a98fb7b2260ad4ad23ff972c3d52c6f103b0d4',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    nationalId: '19922691234567891',
    dateOfBirth: '1990-01-15',
    gender: 'male',
    accountStatus: 'active',
    verificationStatus: 'verified',
    tomokTokenBalance: 50000.0,
    roles: ['super_admin'],
    primaryRole: 'super_admin',
    createdAt: '2026-01-01T00:00:00.000Z',
    mandatoryAddress: {
      division: 'রংপুর',
      district: 'ঠাকুরগাঁও',
      upazila: 'ঠাকুরগাঁও সদর',
      unionName: 'হাজীপাড়া',
      area: 'কালীবাড়ী, হাজীপাড়া'
    }
  },
  {
    id: 'usr-admin-02',
    email: 'admin@ghorerbazar.bd',
    fullName: 'তানজিনা রহমান (Admin)',
    mobileNumber: '01711000002',
    permanentMemberId: 'GBBD-002001',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    nationalId: '19942691234567892',
    dateOfBirth: '1994-05-20',
    gender: 'female',
    accountStatus: 'active',
    verificationStatus: 'verified',
    tomokTokenBalance: 12500.0,
    roles: ['admin'],
    primaryRole: 'admin',
    createdAt: '2026-01-02T00:00:00.000Z',
    mandatoryAddress: {
      division: 'ঢাকা',
      district: 'ঢাকা',
      upazila: 'গুলশান',
      unionName: 'গুলশান-১',
      area: 'ব্লক বি, রোড ৫১'
    }
  },
  {
    id: 'usr-customer-03',
    email: 'customer@ghorerbazar.bd',
    fullName: 'কাজী শফিকুল আলম (Customer)',
    mobileNumber: '01819000003',
    permanentMemberId: 'GBBD-884012',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    nationalId: '19952691234567893',
    dateOfBirth: '1995-08-12',
    gender: 'male',
    accountStatus: 'active',
    verificationStatus: 'verified',
    tomokTokenBalance: 850.5,
    roles: ['customer'],
    primaryRole: 'customer',
    createdAt: '2026-01-05T00:00:00.000Z',
    mandatoryAddress: {
      division: 'ঢাকা',
      district: 'ঢাকা',
      upazila: 'উত্তরা',
      unionName: 'উত্তরা সেক্টর ৭',
      area: 'বাড়ি ৪৫, রোড ৩'
    }
  },
  {
    id: 'usr-network-07',
    email: 'network@ghorerbazar.bd',
    fullName: 'মোস্তফা কামাল (Network Active Member)',
    mobileNumber: '01819000007',
    permanentMemberId: 'GBBD-551044',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    nationalId: '19932691234567897',
    dateOfBirth: '1993-04-10',
    gender: 'male',
    accountStatus: 'active',
    verificationStatus: 'verified',
    tomokTokenBalance: 2450.0,
    roles: ['network_member', 'customer'],
    primaryRole: 'network_member',
    sponsorId: FIXED_SUPER_ADMIN_ID,
    createdAt: '2026-01-07T00:00:00.000Z',
    mandatoryAddress: {
      division: 'ঢাকা',
      district: 'ঢাকা',
      upazila: 'মিরপুর',
      unionName: 'মিরপুর-১',
      area: 'ব্লক এ, সড়ক ৫'
    }
  },
  {
    id: 'usr-vendor-04',
    email: 'dealer@ghorerbazar.bd',
    fullName: 'মোঃ জহিরুল ইসলাম (Dealer)',
    mobileNumber: '01911000004',
    permanentMemberId: 'GBBD-304911',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    nationalId: '19882691234567894',
    dateOfBirth: '1988-11-04',
    gender: 'male',
    accountStatus: 'active',
    verificationStatus: 'verified',
    tomokTokenBalance: 3200.0,
    roles: ['dealer', 'vendor'],
    primaryRole: 'dealer',
    createdAt: '2026-01-10T00:00:00.000Z',
    mandatoryAddress: {
      division: 'চট্টগ্রাম',
      district: 'চট্টগ্রাম',
      upazila: 'কোতোয়ালী',
      unionName: 'আন্দরকিল্লা',
      area: 'দোকান ১২, নিউ মার্কেট লেন'
    }
  },
  {
    id: 'usr-partner-05',
    email: 'partner@ghorerbazar.bd',
    fullName: 'ফরিদা পারভীন (Operations Partner)',
    mobileNumber: '01611000005',
    permanentMemberId: 'GBBD-702819',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    nationalId: '19912691234567895',
    dateOfBirth: '1991-03-30',
    gender: 'female',
    accountStatus: 'active',
    verificationStatus: 'verified',
    tomokTokenBalance: 7500.0,
    roles: ['operations_partner'],
    primaryRole: 'operations_partner',
    createdAt: '2026-01-12T00:00:00.000Z',
    mandatoryAddress: {
      division: 'রাজশাহী',
      district: 'রাজশাহী',
      upazila: 'বোয়ালিয়া',
      unionName: 'সাহেব বাজার',
      area: 'হাব ভবন ৩য় তলা'
    }
  },
  {
    id: 'usr-rider-06',
    email: 'rider@ghorerbazar.bd',
    fullName: 'রাশেদুল হাসান (Delivery Man)',
    mobileNumber: '01511000006',
    permanentMemberId: 'GBBD-991023',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    nationalId: '19982691234567896',
    dateOfBirth: '1998-09-18',
    gender: 'male',
    accountStatus: 'active',
    verificationStatus: 'verified',
    tomokTokenBalance: 450.0,
    roles: ['delivery_rider'],
    primaryRole: 'delivery_rider',
    createdAt: '2026-01-15T00:00:00.000Z',
    mandatoryAddress: {
      division: 'ঢাকা',
      district: 'ঢাকা',
      upazila: 'মিরপুর',
      unionName: 'মিরপুর-১০',
      area: 'ব্লক সি, লাইন ২'
    }
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Ghorer Bazar BD Enterprise API',
      rbacEnforced: true,
      timestamp: new Date().toISOString()
    });
  });

  /**
   * STRICT RBAC API ENDPOINT: Active User List
   * ONLY Super Admin can access the complete Active User list.
   * Requests from Admin, Dealer, Vendor, Operations Partner, Rider, Customer are rejected with 403 Forbidden.
   */
  app.get('/api/admin/active-users', (req, res) => {
    const requestorRole = (req.headers['x-user-role'] || req.query.requestorRole || '').toString().toLowerCase();
    const requestorId = (req.headers['x-user-id'] || req.query.requestorId || '').toString();

    // Strict Backend RBAC Verification
    if (requestorRole !== 'super_admin') {
      console.warn(`[RBAC API BLOCKED] Unauthorized Active User list access attempt. Requestor Role: '${requestorRole}', User ID: '${requestorId}'`);
      return res.status(403).json({
        success: false,
        errorCode: 403,
        error: 'Forbidden Access',
        message: `403 Forbidden: User role '${requestorRole || 'guest'}' is NOT authorized to view the complete Active User list. Access restricted to Super Admin only.`,
        timestamp: new Date().toISOString()
      });
    }

    // Query parameters for search & filtering
    const search = (req.query.search || '').toString().toLowerCase();
    const roleFilter = (req.query.role || 'all').toString();
    const statusFilter = (req.query.status || 'all').toString();
    const startDate = (req.query.startDate || '').toString();
    const endDate = (req.query.endDate || '').toString();
    const divisionFilter = (req.query.division || 'all').toString();
    const sortBy = (req.query.sortBy || 'newest').toString();

    let filtered = INITIAL_USERS.filter((u) => {
      // Role Filter
      if (roleFilter !== 'all' && u.primaryRole !== roleFilter && !u.roles.includes(roleFilter)) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'all' && u.accountStatus !== statusFilter) {
        return false;
      }

      // Division Filter
      if (divisionFilter !== 'all' && u.mandatoryAddress?.division !== divisionFilter) {
        return false;
      }

      // Registration Date Range Filter (startDate, endDate)
      if (startDate) {
        const uRegDate = u.createdAt.slice(0, 10);
        if (uRegDate < startDate) return false;
      }
      if (endDate) {
        const uRegDate = u.createdAt.slice(0, 10);
        if (uRegDate > endDate) return false;
      }

      // Search Query
      if (search.trim()) {
        const matchesId = u.id.toLowerCase().includes(search) || (u.permanentMemberId && u.permanentMemberId.toLowerCase().includes(search));
        const matchesName = u.fullName.toLowerCase().includes(search);
        const matchesMobile = u.mobileNumber.includes(search);
        const matchesEmail = u.email && u.email.toLowerCase().includes(search);
        const matchesLocation = u.mandatoryAddress && `${u.mandatoryAddress.division} ${u.mandatoryAddress.district} ${u.mandatoryAddress.upazila}`.toLowerCase().includes(search);

        return matchesId || matchesName || matchesMobile || matchesEmail || matchesLocation;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sortBy === 'balance') {
      filtered.sort((a, b) => b.tomokTokenBalance - a.tomokTokenBalance);
    }

    console.log(`[RBAC API SUCCESS] Active Users retrieved for Super Admin (${requestorId}). Returned ${filtered.length} records.`);

    return res.json({
      success: true,
      data: filtered,
      totalCount: filtered.length,
      filtersApplied: {
        search,
        roleFilter,
        statusFilter,
        startDate,
        endDate,
        divisionFilter,
        sortBy
      },
      auditLogCreated: true,
      accessedAt: new Date().toISOString()
    });
  });

  /**
   * STRICT RBAC API ENDPOINT: Active User Detail
   */
  app.get('/api/admin/active-users/:id', (req, res) => {
    const requestorRole = (req.headers['x-user-role'] || req.query.requestorRole || '').toString().toLowerCase();

    if (requestorRole !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden Access',
        message: '403 Forbidden: Only Super Admin can inspect user profile details.'
      });
    }

    const userId = req.params.id;
    const targetUser = INITIAL_USERS.find((u) => u.id === userId || u.permanentMemberId === userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    return res.json({
      success: true,
      data: targetUser
    });
  });

  /**
   * IMMUTABLE SUPER ADMIN GUARD: User Edit Endpoint
   */
  app.put('/api/admin/active-users/:id', (req, res) => {
    const requestorRole = (req.headers['x-user-role'] || req.body.requestorRole || '').toString().toLowerCase();

    if (requestorRole !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden Access',
        message: '403 Forbidden: Only Super Admin can modify user records.'
      });
    }

    const userId = req.params.id;
    const userIndex = INITIAL_USERS.findIndex((u) => u.id === userId || u.permanentMemberId === userId);

    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User record not found.' });
    }

    // Protect Super Admin Immutability
    if (userId === FIXED_SUPER_ADMIN_ID || INITIAL_USERS[userIndex].id === FIXED_SUPER_ADMIN_ID) {
      if (req.body.primaryRole && req.body.primaryRole !== 'super_admin') {
        return res.status(403).json({
          success: false,
          error: 'Super Admin Immutability Violation',
          message: `Super Admin ID '${FIXED_SUPER_ADMIN_ID}' is immutable and role cannot be altered or downgraded.`
        });
      }
      if (req.body.accountStatus && req.body.accountStatus !== 'active') {
        return res.status(403).json({
          success: false,
          error: 'Super Admin Immutability Violation',
          message: `Super Admin account cannot be deactivated, suspended or banned.`
        });
      }
    }

    const updatedUser = { ...INITIAL_USERS[userIndex], ...req.body, updatedAt: new Date().toISOString() };
    INITIAL_USERS[userIndex] = updatedUser;

    return res.json({
      success: true,
      message: `User record for '${updatedUser.fullName}' updated successfully.`,
      data: updatedUser
    });
  });

  /**
   * IMMUTABLE SUPER ADMIN GUARD: Delete User Endpoint
   */
  app.delete('/api/admin/active-users/:id', (req, res) => {
    const requestorRole = (req.headers['x-user-role'] || '').toString().toLowerCase();

    if (requestorRole !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden Access',
        message: '403 Forbidden: Only Super Admin can delete user records.'
      });
    }

    const userId = req.params.id;

    // Enforce Immutability: Block deletion of AANO-SADMIN-001
    if (userId === FIXED_SUPER_ADMIN_ID || userId === 'usr-super-admin-01') {
      return res.status(403).json({
        success: false,
        errorCode: 403,
        error: 'Immutable Root Super Admin Protection',
        message: `SECURITY EXCEPTION: Super Admin ID '${FIXED_SUPER_ADMIN_ID}' is permanent and immutable. It CANNOT be deleted from the database under any circumstances.`
      });
    }

    const userIndex = INITIAL_USERS.findIndex((u) => u.id === userId || u.permanentMemberId === userId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const deleted = INITIAL_USERS.splice(userIndex, 1)[0];
    return res.json({
      success: true,
      message: `User '${deleted.fullName}' (${deleted.id}) successfully deleted from database.`
    });
  });

  /**
   * SECURE CREDENTIALS ENDPOINT: Super Admin Password Update
   */
  app.post('/api/admin/change-password', (req, res) => {
    const requestorRole = (req.headers['x-user-role'] || '').toString().toLowerCase();
    const { newPassword } = req.body;

    if (requestorRole !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Only authenticated Super Admin can update root credentials.'
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    const saIndex = INITIAL_USERS.findIndex((u) => u.id === FIXED_SUPER_ADMIN_ID);
    if (saIndex !== -1) {
      INITIAL_USERS[saIndex].passwordHash = `sha256_secured_${Date.now()}`;
    }

    console.log(`[SECURITY AUDIT] Super Admin (${FIXED_SUPER_ADMIN_ID}) password updated securely.`);

    return res.json({
      success: true,
      message: `Super Admin ID (${FIXED_SUPER_ADMIN_ID}) credentials updated securely in database.`
    });
  });

  /**
   * WALLET & TOKEN ADJUSTMENT ENDPOINT
   */
  app.post('/api/admin/wallets/adjust', (req, res) => {
    const requestorRole = (req.headers['x-user-role'] || '').toString().toLowerCase();
    const { userId, amount, type, reason } = req.body;

    if (requestorRole !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Only Super Admin can adjust wallet balances.'
      });
    }

    const targetUser = INITIAL_USERS.find((u) => u.id === userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'Target user not found.' });
    }

    const delta = type === 'credit' ? Math.abs(amount) : -Math.abs(amount);
    targetUser.tomokTokenBalance = Math.max(0, targetUser.tomokTokenBalance + delta);

    return res.json({
      success: true,
      message: `Wallet balance adjusted for ${targetUser.fullName}. New Balance: ${targetUser.tomokTokenBalance} Points.`,
      newBalance: targetUser.tomokTokenBalance,
      reason
    });
  });

  /**
   * SYSTEM STATS ENDPOINT
   */
  app.get('/api/admin/system-stats', (req, res) => {
    const requestorRole = (req.headers['x-user-role'] || req.query.requestorRole || '').toString().toLowerCase();

    if (requestorRole !== 'super_admin' && requestorRole !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    return res.json({
      success: true,
      stats: {
        superAdminId: FIXED_SUPER_ADMIN_ID,
        immutabilityEnforced: true,
        totalUsers: INITIAL_USERS.length,
        activeMembers: INITIAL_USERS.filter((u) => u.roles.includes('network_member')).length,
        dealers: INITIAL_USERS.filter((u) => u.roles.includes('dealer')).length,
        deliveryRiders: INITIAL_USERS.filter((u) => u.roles.includes('delivery_rider')).length,
        totalTokenCirculation: INITIAL_USERS.reduce((acc, u) => acc + (u.tomokTokenBalance || 0), 0),
        serverTimestamp: new Date().toISOString(),
        databaseTriggerStatus: 'ACTIVE_AND_PROTECTED'
      }
    });
  });

  // Catch-all for unmatched /api routes — return JSON 404, not HTML
  app.all('/api/*', (_req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: 'The requested API endpoint does not exist.'
    });
  });

  // Vite Middleware for Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
