import { Users, ShieldAlert, MessageSquare, Flag, Lock, Heart } from 'lucide-react';

export default function CommunityGuidelinesPage() {
  const sections = [
    { icon: ShieldAlert, title: 'Be Safe', points: [
      'Never share passwords or verification codes with anyone.',
      'Do not publicly share sensitive personal information.',
      'Be careful with advance payments — inspect products before paying where possible.',
      'Use public, well-lit locations for in-person meetups.',
    ]},
    { icon: Flag, title: 'Report Problems', points: [
      'Report suspicious listings, users, or messages.',
      'Block users who behave inappropriately.',
      'Use the Report option on listings, profiles, and messages.',
      'Trust your instincts — if something feels off, report it.',
    ]},
    { icon: Users, title: 'Be Respectful', points: [
      'Do not use AMPLOFY to harass, threaten, or bully others.',
      'Do not impersonate other students or non-students.',
      'Respect privacy — do not share others\' personal information.',
      'Be honest in your listings and communications.',
    ]},
    { icon: ShieldAlert, title: 'Stay Legal', points: [
      'Do not participate in illegal activity on AMPLOFY.',
      'Do not list prohibited, counterfeit, stolen, or dangerous items.',
      'Do not use AMPLOFY to facilitate fraud or scams.',
      'Follow applicable laws and AMPLOFY rules.',
    ]},
    { icon: MessageSquare, title: 'Communicate Safely', points: [
      'Keep important communication within AMPLOFY.',
      'Do not publicly reveal your phone number or home address.',
      'Do not share private contact information in listings.',
      'Be cautious when arranging meetups — tell someone where you are going.',
    ]},
    { icon: Heart, title: 'Build Community', points: [
      'Support fellow student creators and sellers.',
      'Leave honest reviews after genuine transactions.',
      'Be welcoming to new students joining the platform.',
      'Help make AMPLOFY a positive space for students.',
    ]},
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
          <Users size={22} className="text-brand-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">Community Guidelines</h1>
      </div>
      <p className="text-ink-500 mb-6">Follow these guidelines to keep AMPLOFY safe and welcoming for all students.</p>

      <div className="space-y-5">
        {sections.map(s => (
          <div key={s.title} className="bg-white rounded-2xl shadow-soft border border-ink-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                <s.icon size={18} className="text-brand-600" />
              </div>
              <h2 className="font-bold text-ink-800">{s.title}</h2>
            </div>
            <ul className="space-y-2">
              {s.points.map((p, i) => (
                <li key={i} className="text-sm text-ink-600 leading-relaxed flex items-start gap-2">
                  <span className="text-brand-400 mt-1">•</span> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
