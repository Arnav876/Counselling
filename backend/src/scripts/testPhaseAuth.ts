import jwt from 'jsonwebtoken';

const BASE = 'http://localhost:5001/api';

async function runTests() {
  console.log('====================================================');
  console.log('PREFINAL PHASE FULL INTEGRATION VERIFICATION TEST');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, desc: string) => {
    if (condition) {
      console.log(`✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${desc}`);
      failed++;
    }
  };

  // Test 1: Health check & 839 colleges preserved
  const healthRes = await fetch(`${BASE}/health`).then(r => r.json());
  assert(healthRes.status === 'healthy' && healthRes.stats?.totalColleges === 839, `Preserved 839 colleges in PostgreSQL (${healthRes.stats?.totalColleges})`);

  // Test 2: Google sign-in for Super Admin bmsit8@gmail.com
  const superAdminLogin = await fetch(`${BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bmsit8@gmail.com', name: 'Super Admin User' })
  }).then(r => r.json());
  assert(superAdminLogin.user?.role === 'SUPER_ADMIN' && !!superAdminLogin.token, `bmsit8@gmail.com is strictly verified as SUPER_ADMIN`);
  const superAdminToken = superAdminLogin.token;

  // Test 3: Google sign-in for standard student
  const studentLogin = await fetch(`${BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'priya.student@gmail.com', name: 'Priya Sharma' })
  }).then(r => r.json());
  assert(studentLogin.user?.role === 'STUDENT' && !!studentLogin.token, `New Google user priya.student@gmail.com receives STUDENT role`);
  const studentToken = studentLogin.token;

  // Test 4: Student cannot access Admin endpoints (403 / 401)
  const studentAdminAttempt = await fetch(`${BASE}/admin/overview`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(studentAdminAttempt.status === 403, `Server-side security: Student cannot access /api/admin/overview (Status: ${studentAdminAttempt.status})`);

  // Test 5: Super Admin can access Admin overview
  const superAdminOverview = await fetch(`${BASE}/admin/overview`, {
    headers: { 'Authorization': `Bearer ${superAdminToken}` }
  }).then(r => r.json());
  assert(superAdminOverview.stats?.colleges === 839, `Super Admin accessed admin overview (839 colleges, ${superAdminOverview.stats?.courses} courses tracked)`);

  // Test 6: Super Admin adds authorized admin
  const newAdminEmail = 'dr.ananya.admin@gmail.com';
  const addAdminRes = await fetch(`${BASE}/admin/admins`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${superAdminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: newAdminEmail })
  }).then(r => r.json());
  assert(addAdminRes.success === true, `Super Admin authorized new admin: ${newAdminEmail}`);

  // Test 7: The authorized admin signs in with Google and receives ADMIN role
  const newAdminLogin = await fetch(`${BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: newAdminEmail, name: 'Dr. Ananya' })
  }).then(r => r.json());
  assert(newAdminLogin.user?.role === 'ADMIN', `Newly authorized Google account receives ADMIN role upon sign-in`);
  const newAdminToken = newAdminLogin.token;

  // Test 8: Authorized ADMIN can access /api/admin/colleges
  const adminCollegesRes = await fetch(`${BASE}/admin/colleges?limit=5`, {
    headers: { 'Authorization': `Bearer ${newAdminToken}` }
  }).then(r => r.json());
  assert(Array.isArray(adminCollegesRes.colleges) && adminCollegesRes.colleges.length > 0, `Authorized ADMIN can access college database`);

  // Test 9: Regular student saves and fetches a college
  const targetCollegeId = adminCollegesRes.colleges[0].id;
  const targetCollegeName = adminCollegesRes.colleges[0].name;
  const saveRes = await fetch(`${BASE}/saved-colleges/${targetCollegeId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${studentToken}` }
  }).then(r => r.json());
  assert(saveRes.success === true, `Student saved college "${targetCollegeName}"`);

  const savedListRes = await fetch(`${BASE}/saved-colleges`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  }).then(r => r.json());
  assert(savedListRes.savedColleges.some((s: any) => s.college.id === targetCollegeId), `Saved college appears in Student saved list`);

  // Test 10: Student unsaves college
  const unsaveRes = await fetch(`${BASE}/saved-colleges/${targetCollegeId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${studentToken}` }
  }).then(r => r.json());
  assert(unsaveRes.success === true, `Student unsaved college successfully`);

  // Test 11: Authenticated Chatbot session persists conversation to PostgreSQL
  const chatRes = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${studentToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What are the top medical colleges in Karnataka?' })
  }).then(r => r.json());
  assert(!!chatRes.conversationId && chatRes.colleges.length > 0, `AI Advisor responded and created conversation ID: ${chatRes.conversationId}`);

  // Test 12: Student queries own conversation history
  const studentConvs = await fetch(`${BASE}/conversations`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  }).then(r => r.json());
  assert(studentConvs.conversations?.length > 0, `Student can view their own AI conversation history (${studentConvs.conversations?.length} sessions)`);

  // Test 13: Student submits enquiry -> Admin views and updates status
  const enquiryRes = await fetch(`${BASE}/enquiries`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${studentToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      collegeName: targetCollegeName,
      studentName: 'Priya Sharma',
      phone: '+91 78790 84889',
      preferredCourse: 'MBBS',
      notes: 'Interested in NRI / General Management counseling'
    })
  }).then(r => r.json());
  assert(enquiryRes.success === true && !!enquiryRes.id, `Enquiry created with ID ${enquiryRes.id}`);

  const updateStatusRes = await fetch(`${BASE}/admin/enquiries/${enquiryRes.id}/status`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${superAdminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'IN_PROGRESS' })
  }).then(r => r.json());
  assert(updateStatusRes.enquiry?.status === 'IN_PROGRESS', `Admin updated enquiry status to IN_PROGRESS`);

  // Test 14: Admin updates a college in PostgreSQL and public API immediately reflects change
  const updateCollegeRes = await fetch(`${BASE}/admin/colleges/${targetCollegeId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${superAdminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating: 4.9 })
  }).then(r => r.json());
  assert(updateCollegeRes.college?.rating === 4.9, `Admin updated college rating in PostgreSQL to 4.9`);

  const publicCollegeCheck = await fetch(`${BASE}/colleges/${targetCollegeId}`).then(r => r.json());
  assert(publicCollegeCheck.rating === 4.9, `Public college endpoint immediately reflects the updated rating (4.9)`);

  // Test 15: Super Admin revokes admin access -> User role reverts to STUDENT
  const authorizedAdminsList = await fetch(`${BASE}/admin/admins`, {
    headers: { 'Authorization': `Bearer ${superAdminToken}` }
  }).then(r => r.json());
  const adminToRevoke = authorizedAdminsList.authorizedAdmins.find((a: any) => a.email === newAdminEmail);
  if (adminToRevoke) {
    const revokeRes = await fetch(`${BASE}/admin/admins/${adminToRevoke.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${superAdminToken}` }
    }).then(r => r.json());
    assert(revokeRes.success === true, `Super Admin revoked admin privileges for ${newAdminEmail}`);

    // Verify revoked user role is now STUDENT
    const revokedUserCheck = await fetch(`${BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newAdminEmail, name: 'Dr. Ananya' })
    }).then(r => r.json());
    assert(revokedUserCheck.user?.role === 'STUDENT', `Revoked admin properly reverted to STUDENT role upon sign-in`);
  }

  console.log('\n====================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('====================================================');
}

runTests().catch(console.error);
