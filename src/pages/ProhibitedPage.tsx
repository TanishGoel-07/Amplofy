import { Link } from 'react-router-dom';
import { Ban, ArrowRight, AlertTriangle } from 'lucide-react';

const prohibited = [
  { title: 'Illegal Drugs', desc: 'Any controlled substances, recreational drugs, or drug paraphernalia are strictly prohibited.' },
  { title: 'Weapons', desc: 'Firearms, ammunition, knives, explosives, and any other weapons are not allowed.' },
  { title: 'Stolen Goods', desc: 'Listing stolen or illegally obtained property is illegal and strictly prohibited.' },
  { title: 'Counterfeit Goods', desc: 'Fake or replica branded products that infringe on intellectual property rights are not allowed.' },
  { title: 'Fraudulent Documents', desc: 'Fake IDs, certificates, diplomas, or any fraudulent documents are strictly prohibited.' },
  { title: 'Dangerous Products', desc: 'Products that pose a danger to health or safety, including hazardous chemicals and materials.' },
  { title: 'Prescription Medication', desc: 'Prescription drugs and medications cannot be listed or sold on the platform.' },
  { title: 'Other Prohibited Items', desc: 'Any other products or services prohibited by applicable local, state, or national law.' },
];

export default function ProhibitedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto bg-error-50 rounded-3xl flex items-center justify-center mb-5">
          <Ban size={32} className="text-error-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">Prohibited Items Policy</h1>
        <p className="text-lg text-ink-600 max-w-2xl mx-auto">
          AMPLOFY maintains a strict policy to keep the marketplace safe, legal, and trustworthy.
        </p>
      </div>

      {/* Warning banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> Only list legal and permitted products/services. Violating this policy may result in listing removal, account suspension, and reporting to authorities where applicable. Students are responsible for ensuring their listings comply with all applicable laws.
        </p>
      </div>

      {/* Prohibited list */}
      <div className="space-y-3 mb-8">
        {prohibited.map(item => (
          <div key={item.title} className="bg-white rounded-2xl shadow-soft border border-ink-100 p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-error-50 flex items-center justify-center shrink-0">
              <Ban size={20} className="text-error-600" />
            </div>
            <div>
              <h2 className="font-bold text-ink-800 mb-1">{item.title}</h2>
              <p className="text-sm text-ink-600 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* What happens if you violate */}
      <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 mb-8">
        <h2 className="font-bold text-ink-800 mb-4">What Happens If You Violate This Policy</h2>
        <div className="space-y-3">
          {[
            'First violation: Listing removed and warning issued',
            'Second violation: Temporary account restriction',
            'Serious violations: Immediate account suspension',
            'Illegal activity: Reported to relevant authorities',
          ].map(action => (
            <div key={action} className="flex items-center gap-2 text-sm text-ink-600">
              <span className="w-1.5 h-1.5 bg-error-500 rounded-full" />
              {action}
            </div>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/safety" className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700 hover:bg-ink-50 transition-colors">
          Safety Guidelines
        </Link>
        <Link to="/sell" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
          List a Product <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
