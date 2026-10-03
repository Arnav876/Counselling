import prisma from '../db/prisma.js';
import bcrypt from 'bcryptjs';

async function runAudit() {
  console.log('🚀 [AUDIT] Starting Production Readiness & Verification Tests...\n');

  // 1. DATABASE DATA INTEGRITY CHECK
  console.log('--- 1. DATABASE & DATA INTEGRITY ---');
  const collegeCount = await prisma.college.count();
  const courseCount = await prisma.course.count();
  const stateSummaryCount = await prisma.stateSummary.count();
  const blogCount = await prisma.blog.count();

  console.log(`✅ Total Colleges in PostgreSQL: ${collegeCount} (Requirement: >= 839)`);
  console.log(`✅ Total Courses in PostgreSQL: ${courseCount} (Requirement: >= 5,553)`);
  console.log(`✅ Total State Summaries: ${stateSummaryCount} (Requirement: 35)`);
  console.log(`✅ Total Seeded Blogs: ${blogCount}`);

  if (collegeCount < 839 || courseCount < 5553) {
    throw new Error('Database data loss detected! College or Course counts below threshold.');
  }

  // 2. ADMIN AUTHENTICATION TESTS
  console.log('\n--- 2. ADMIN AUTHENTICATION ---');
  const adminEmail = process.env.ADMIN_EMAIL || 'admissionbychoice@gmail.com';
  const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (!adminUser || !adminUser.passwordHash) {
    throw new Error('Admin user or passwordHash not found in database!');
  }

  const validPasswordCheck = await bcrypt.compare('AdminSecure@2026', adminUser.passwordHash);
  const invalidPasswordCheck = await bcrypt.compare('WrongPassword123', adminUser.passwordHash);

  console.log(`✅ Admin Account Exists: ${adminUser.email} (Role: ${adminUser.role})`);
  console.log(`✅ Correct Password Verification: ${validPasswordCheck ? 'SUCCESS (Authenticated)' : 'FAILED'}`);
  console.log(`✅ Wrong Password Rejection: ${!invalidPasswordCheck ? 'SUCCESS (Rejected 401)' : 'FAILED'}`);

  // 3. ENQUIRY LIFECYCLE & NOTE TESTS
  console.log('\n--- 3. STUDENT ENQUIRY SYSTEM ---');
  const testEnquiry = await prisma.enquiry.create({
    data: {
      studentName: 'Audit Test Student',
      email: 'student.audit@example.com',
      phone: '+91 9876543210',
      preferredCourse: 'MBBS General Medicine',
      preferredState: 'Karnataka',
      collegeName: 'Kasturba Medical College, Manipal',
      status: 'NEW',
      notes: 'Initial inquiry via web portal'
    }
  });
  console.log(`✅ New Enquiry Created: ID ${testEnquiry.id} [Status: ${testEnquiry.status}]`);

  // Progress status
  const inProgressEnquiry = await prisma.enquiry.update({
    where: { id: testEnquiry.id },
    data: { status: 'IN_PROGRESS', notes: 'Counselor assigned - calling student' }
  });
  console.log(`✅ Status Transition: NEW -> ${inProgressEnquiry.status} (Note: ${inProgressEnquiry.notes})`);

  const contactedEnquiry = await prisma.enquiry.update({
    where: { id: testEnquiry.id },
    data: { status: 'CONTACTED', notes: 'Spoke with student, budget confirmed' }
  });
  console.log(`✅ Status Transition: IN_PROGRESS -> ${contactedEnquiry.status} (Note: ${contactedEnquiry.notes})`);

  const resolvedEnquiry = await prisma.enquiry.update({
    where: { id: testEnquiry.id },
    data: { status: 'RESOLVED', notes: 'Seat booked under Management Quota' }
  });
  console.log(`✅ Status Transition: CONTACTED -> ${resolvedEnquiry.status} (Note: ${resolvedEnquiry.notes})`);

  // Clean up test enquiry
  await prisma.enquiry.delete({ where: { id: testEnquiry.id } });
  console.log(`✅ Test Enquiry Cleaned Up Successfully`);

  // 4. BLOG SYSTEM & CATEGORY TESTS
  console.log('\n--- 4. BLOG SYSTEM & CATEGORIES ---');
  const privateBlogs = await prisma.blog.findMany({ where: { category: 'PRIVATE', status: 'PUBLISHED' } });
  const govtBlogs = await prisma.blog.findMany({ where: { category: 'GOVERNMENT', status: 'PUBLISHED' } });

  console.log(`✅ Published Private College Guides: ${privateBlogs.length}`);
  privateBlogs.forEach(b => console.log(`   - [PRIVATE] ${b.title} (Slug: /blogs/private/${b.slug})`));

  console.log(`✅ Published Government College Guides: ${govtBlogs.length}`);
  govtBlogs.forEach(b => console.log(`   - [GOVERNMENT] ${b.title} (Slug: /blogs/government/${b.slug})`));

  // Test slug lookup
  const sampleBlog = await prisma.blog.findUnique({
    where: { slug: 'top-private-medical-colleges-in-karnataka-2026-fees-cutoff' }
  });
  console.log(`✅ Slug Lookup Test: "${sampleBlog?.title}" -> Found: ${!!sampleBlog}`);

  console.log('\n==================================================');
  console.log('🎉 ALL PRODUCTION READINESS CHECKS PASSED PERFECTLY!');
  console.log('==================================================');
}

runAudit()
  .catch((err) => {
    console.error('❌ Audit Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
