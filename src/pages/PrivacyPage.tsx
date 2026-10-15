import { Lock, Eye, Trash2, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    { title: 'Information We Collect', body: 'AMPLOFY collects information you provide during account creation and verification, including your name, email, educational institution, and student verification documents. We also collect information about your activity on the platform, such as listings, messages, and interactions.' },
    { title: 'Why We Collect Information', body: 'We collect information to verify student status, provide marketplace features, maintain platform safety, prevent fraud and prohibited activity, and improve the platform. We follow data-minimization principles and only collect what is necessary.' },
    { title: 'Why Student Verification Is Required', body: 'Student verification ensures that AMPLOFY remains a student-only community. It helps prevent non-students from accessing the platform and protects the integrity of the marketplace.' },
    { title: 'How Verification Information Is Handled', body: 'Student verification documents (such as student IDs) are used solely for verification purposes. They are stored securely and are not shared with other users. Access is restricted to authorized verification and moderation personnel only.' },
    { title: 'Student IDs Are Not Publicly Displayed', body: 'Your student ID, student ID number, date of birth, address, phone number, and other sensitive information from your ID are never displayed on your public profile or visible to other users.' },
    { title: 'What Appears on Your Public Profile', body: 'Your public profile may show your display name, profile picture, bio, educational institution, course/field of study, year of study, interests, skills, listings, and Verified Student badge. You have control over what information is visible.' },
    { title: 'How You Can Manage Your Information', body: 'You can edit your profile information, update your verification status, manage your listings, and control your privacy settings through your account settings. You can also block users and manage your blocked list.' },
    { title: 'Account & Data Deletion', body: 'You can request account deletion through Settings → Account → Delete Account. This will affect your profile, listings, messages, reviews, and other user-generated content. Some data may be retained for legal or safety purposes where required.' },
    { title: 'How Information Is Protected', body: 'We take reasonable measures to protect your information using industry-standard security practices. However, no system is 100% secure, and we cannot guarantee absolute security.' },
    { title: 'Data Retention', body: 'We retain your information for as long as your account is active or as needed to provide services. Verification data is retained for the current academic year and may be deleted or archived after re-verification. Some data may be retained longer for legal, safety, or moderation purposes.' },
    { title: 'Children\'s Privacy', body: 'AMPLOFY may be used by students under 18. For users under 18, additional parental/guardian consent and privacy protections may apply. We do not use targeted advertising, behavioural tracking, or unnecessary profiling of younger users. We do not collect more information than necessary from younger users.' },
    { title: 'Contact', body: 'For privacy questions or requests, please contact AMPLOFY through the Contact page. [Support email to be established before public launch.]' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
          <Lock size={22} className="text-brand-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">Privacy Policy</h1>
      </div>
      <p className="text-sm text-ink-400 mb-6">Last updated: September 2026</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800 leading-relaxed">
          This is a prototype. This Privacy Policy is not yet legally reviewed. A qualified legal professional should review and finalize this policy before public launch.
        </p>
      </div>

      <div className="space-y-5">
        {sections.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-soft border border-ink-100 p-5">
            <h2 className="font-bold text-ink-800 mb-2">{s.title}</h2>
            <p className="text-sm text-ink-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
