export default function Banner() {
  return (
    <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <span className="text-3xl md:text-4xl">⚡</span>
            <span>The Stable ABI Cometh!</span>
            <span className="text-3xl md:text-4xl">⚡</span>
          </div>
          <p className="text-base md:text-lg font-medium opacity-95">
            Repent your <code className="bg-amber-800 px-2 py-0.5 rounded text-amber-100 font-mono">unsafe</code> sins!
            Are you ready to be saved by fearless concurrency?
          </p>
          <p className="text-sm md:text-base mt-2 italic opacity-90">
            "Blessed are the borrowck-compliant, for they shall inherit memory safety"
          </p>
        </div>
      </div>
    </div>
  );
}
