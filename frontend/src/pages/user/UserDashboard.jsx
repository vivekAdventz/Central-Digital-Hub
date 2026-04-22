import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

const UserDashboard = () => {
  const { user } = useAuth();
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashId, setSelectedDashId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboards on mount
  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const response = await API.get('/dashboards');
        setDashboards(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedDashId(response.data.data[0]._id);
        }
      } catch (err) {
        setError('Failed to load dashboards');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboards();
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
        <Spinner text="Loading your dashboard hub..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-80px)] p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  const selectedDash = dashboards.find((d) => d._id === selectedDashId);

  return (
    <div className="h-[calc(100vh-80px)] flex bg-gray-50 overflow-hidden">
      {/* Sidebar - 1/5 width */}
      <div className="w-1/5 min-w-[280px] bg-white border-r border-gray-200 flex flex-col h-full z-10 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Available Reports</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Select to view</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {dashboards.length === 0 ? (
            <p className="text-sm text-gray-500 p-2">No dashboards available.</p>
          ) : (
            dashboards.map((dash, idx) => (
              <button
                key={dash._id}
                onClick={() => setSelectedDashId(dash._id)}
                className={`w-full text-left p-4 rounded transition-all border ${selectedDashId === dash._id
                    ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                    : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${selectedDashId === dash._id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold leading-snug ${selectedDashId === dash._id ? 'text-indigo-900' : 'text-gray-900'}`}>{dash.title}</h3>
                    <p className="text-[10px] uppercase font-bold tracking-widest mt-1 text-gray-500">{dash.category}</p>
                    {dash.viewOnly && (
                      <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Highly Confidential</span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content - 4/5 width */}
      <div className="flex-1 h-full overflow-y-auto bg-gray-50 p-8 custom-scrollbar relative">
        {selectedDash ? (
          <div className="max-w-6xl mx-auto fade-in h-full flex flex-col">
            <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedDash.title}</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-widest">{selectedDash.category}</span>
              </div>
              {selectedDash.description && (
                <p className="mt-4 text-sm text-gray-600 leading-relaxed font-medium bg-gray-50 p-4 rounded border border-gray-100">{selectedDash.description}</p>
              )}
            </div>

            <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-4 relative min-h-[500px] flex flex-col">
              {/* 
                  If viewOnly is true, it means shareable=false and the backend stripped the iframe.
                  We show a view-only placeholder or the actual iframe if it exists.
               */}
              {selectedDash.viewOnly ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-8 text-center rounded m-4 border border-dashed border-gray-300">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-700 uppercase tracking-tight">Confidential Dashboard</h3>
                  <p className="text-sm text-gray-500 mt-2 max-w-md">The source data for this report is restricted. You are viewing this in secure mode. Shareable links and direct iframe access are disabled by the administrator.</p>

                  <div className="mt-8 opacity-50 pointer-events-none w-full max-w-2xl">
                    {/* Fake skeleton to look like a chart loading */}
                    <div className="h-64 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <div className="report-frame-container bg-white flex-1">
                  {/* Shield overlay to block share icon in bottom right */}
                  <div className="report-shield">SECURE VIEW ACTIVE</div>

                  {/* Render iframe directly since backend sends the full tag or URL */}
                  {selectedDash.powerBiIframe.startsWith('<iframe') ? (
                    <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: selectedDash.powerBiIframe }} />
                  ) : (
                    <iframe
                      title={selectedDash.title}
                      src={selectedDash.powerBiIframe}
                      frameBorder="0"
                      allowFullScreen={true}>
                    </iframe>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p className="text-lg font-medium">Select a dashboard from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
