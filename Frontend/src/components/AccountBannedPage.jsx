const AccountBannedPage = () => (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="bg-gray-800 border border-red-600 rounded-xl shadow-xl p-10 flex flex-col items-center">
        <svg
          className="w-16 h-16 text-red-500 mb-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M8 8l8 8M16 8l-8 8" />
        </svg>
        <h1 className="text-3xl font-bold text-red-500 mb-4">Account Banned</h1>
        <p className="text-white text-lg mb-3 text-center">
          Your account has been <span className="text-red-400 font-semibold">permanently banned</span>.<br />
          If you think this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
  
  export default AccountBannedPage;