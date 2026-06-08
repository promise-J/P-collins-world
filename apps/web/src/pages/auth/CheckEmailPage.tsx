import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

export default function CheckEmailPage() {
  // Get email from URL query params instead of state (more reliable)
  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={40} className="text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
        <p className="text-gray-600 mb-4">
          We've sent a verification link to:
        </p>
        <p className="font-medium text-[#8B3A3A] mb-6">
          {email || 'your email address'}
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-700 font-medium mb-2">📧 Next steps:</p>
          <ol className="text-sm text-gray-600 space-y-1 ml-4 list-decimal">
            <li>Open your email inbox</li>
            <li>Click the verification link in the email</li>
            <li>You'll be redirected to login once verified</li>
          </ol>
        </div>
        
        <Link to="/login">
          <button className="w-full py-3 px-4 bg-[#8B3A3A] text-white rounded-lg font-medium hover:bg-[#6B2C2C] transition-colors">
            Back to Sign In
          </button>
        </Link>
      </div>
    </div>
  );
}