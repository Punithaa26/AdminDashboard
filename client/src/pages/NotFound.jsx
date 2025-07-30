import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
      <div className="text-center space-y-8">
        {/* 404 Animation */}
        <div className="relative">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#39FF14] bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/20 to-[#39FF14]/20 blur-3xl -z-10"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
          <p className="text-white/60 max-w-md mx-auto">
            The page you're looking for doesn't exist yet. It might be under construction or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            className="bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate('/analytics')}
            className="bg-gradient-to-r from-[#00FFFF] to-[#39FF14] hover:opacity-90 text-black font-bold transition-all duration-200"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Analytics
          </Button>
        </div>

      </div>
    </div>
  );
};

export default NotFound;