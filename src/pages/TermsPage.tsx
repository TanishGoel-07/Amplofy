import { ShieldCheck } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    { num: '1', title: 'About AMPLOFY', body: 'AMPLOFY provides a platform for students to discover listings, communicate with other students, and arrange potential transactions. AMPLOFY does not currently process or guarantee payments, shipping, delivery, refunds, returns, escrow, or transactions between users.' },
    { num: '2', title: 'Eligibility', body: 'AMPLOFY is intended for use by current students of schools, colleges, universities, and other eligible educational institutions. Users must complete the student verification process before gaining full marketplace access. If you are under 18, additional parental/guardian consent and privacy requirements may apply.' },
    { num: '3', title: 'Student Verification', body: 'Users must verify their current student status by providing appropriate verification. Verification is valid for the current academic year and may need to be renewed periodically. The Verified Student badge means only that your student status has been verified — it does not imply trustworthiness, product quality guarantees, or background checks.' },
    { num: '4', title: 'Current Student Status', body: 'You must maintain current student status to use AMPLOFY. If your student status expires or changes, you must re-verify. Old or expired student IDs are not valid for permanent verification.' },
    { num: '5', title: 'User-Generated Content', body: 'You are responsible for the content you post, including listings, messages, posts, and profile information. Content must be accurate, legal, and not misleading.' },
    { num: '6', title: 'Prohibited Goods & Services', body: 'AMPLOFY prohibits listings of illegal drugs, weapons, stolen goods, counterfeit goods, fraudulent documents, fake IDs, hacking services, malware, sexually exploitative content, and any goods/services prohibited by applicable law or AMPLOFY policies.' },
    { num: '7', title: 'Listing Moderation', body: 'All listings go through a moderation process before becoming publicly visible. Listings may be rejected, removed, or sent for manual review. AMPLOFY reserves the right to remove any listing that violates these Terms.' },
    { num: '8', title: 'User Responsibility', body: 'You are responsible for your listings, claims, behaviour, communications, transactions, and compliance with applicable law. You must not use AMPLOFY to harass, threaten, defraud, or exploit others.' },
    { num: '9', title: 'Transactions', body: 'AMPLOFY does not process, guarantee, or manage transactions. All payment, shipping, pickup, delivery, and exchange arrangements are made directly between buyers and sellers. AMPLOFY does not verify that any transaction has occurred.' },
    { num: '10', title: 'Payment Disclaimer', body: 'AMPLOFY does not currently process payments, provide checkout, escrow, refunds, or buyer/seller protection. Any payment arrangement is made directly between users at their own risk.' },
    { num: '11', title: 'Shipping Disclaimer', body: 'AMPLOFY does not provide shipping, delivery, courier, or return services. All shipping and delivery arrangements are made directly between users.' },
    { num: '12', title: 'Safety', body: 'Users should follow AMPLOFY safety guidelines, use public locations for meetups, inspect products before payment, and exercise caution in all interactions. AMPLOFY cannot guarantee the safety of any interaction or transaction.' },
    { num: '13', title: 'Reporting & Moderation', body: 'Users can report listings, users, and messages. AMPLOFY may review reports and take actions including warnings, suspensions, bans, and content removal. Users will not be permanently banned based solely on an unverified report.' },
    { num: '14', title: 'Account Suspension/Termination', body: 'AMPLOFY may suspend or terminate accounts for violations of these Terms. Serious or illegal activity may result in permanent bans and escalation to appropriate authorities.' },
    { num: '15', title: 'Privacy', body: 'Your use of AMPLOFY is governed by our Privacy Policy. Student verification documents are not publicly visible. Sensitive information from IDs is not displayed on public profiles.' },
    { num: '16', title: 'Account Deletion', body: 'You may request account deletion through Settings. Deletion will affect your profile, listings, messages, reviews, and other user-generated content.' },
    { num: '17', title: 'Disclaimers', body: 'AMPLOFY is provided "as is" without warranties. AMPLOFY does not guarantee that the platform will be error-free, secure, or available at all times. AMPLOFY is not responsible for the actions of users or the outcome of transactions.' },
    { num: '18', title: 'Changes to Terms', body: 'AMPLOFY may update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the updated Terms.' },
    { num: '19', title: 'Contact', body: 'For questions about these Terms, please contact AMPLOFY through the Contact page. [Support email to be established before public launch.]' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
          <ShieldCheck size={22} className="text-brand-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">Terms &amp; Conditions</h1>
      </div>
      <p className="text-sm text-ink-400 mb-6">Last updated: September 2026</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800 leading-relaxed">
          This is a prototype. These Terms are not yet legally reviewed or binding. A qualified legal professional should review and finalize all Terms before public launch.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 mb-6">
        <p className="text-sm text-ink-600 leading-relaxed">
          AMPLOFY provides the platform for students to discover listings, communicate with other students, and arrange potential transactions. AMPLOFY does not currently process or guarantee payments, shipping, delivery, refunds, returns, escrow, or transactions between users.
        </p>
      </div>

      <div className="space-y-5">
        {sections.map(s => (
          <div key={s.num} className="bg-white rounded-2xl shadow-soft border border-ink-100 p-5">
            <h2 className="font-bold text-ink-800 mb-2 flex items-center gap-2">
              <span className="text-brand-600 text-sm">{s.num}.</span> {s.title}
            </h2>
            <p className="text-sm text-ink-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
