import { useState, useEffect, useRef } from 'react';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import GovernanceModal from '../../components/GovernanceModal';

const UserDashboard = () => {
  const { user } = useAuth();
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashId, setSelectedDashId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const fetchDashboards = async () => {
    try {
      const response = await API.get('/dashboards');
      const data = response.data.data;
      setDashboards(data);
      // Only set initial selection if nothing is selected or if the selected one is gone
      if (data.length > 0 && !selectedDashId) {
        setSelectedDashId(data[0]._id);
      } else if (selectedDashId && !data.find(d => d._id === selectedDashId)) {
        if (data.length > 0) {
          setSelectedDashId(data[0]._id);
        } else {
          setSelectedDashId(null);
        }
      }
    } catch (err) {
      setError('Failed to load dashboards');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboards on mount
  useEffect(() => {
    fetchDashboards();
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 font-sans">
        <Spinner text="Synchronizing Hub..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-80px)] p-8 font-sans">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded text-xs px-4 py-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {error}
        </div>
      </div>
    );
  }

  const selectedDash = dashboards.find((d) => d._id === selectedDashId);

  const extractSrc = (html) => {
    if (!html) return "";
    const srcMatch = html.match(/src=["']([^"']+)["']/);
    let url = srcMatch ? srcMatch[1] : (html.includes('http') ? html : "");
    if (!url) return "";

    // Append URL parameters to hide Power BI UI chrome
    if (url.includes('app.powerbi.com')) {
      const separator = url.includes('?') ? '&' : '?';
      // filterPaneEnabled=false hides filters
      // navContentPaneEnabled=false hides reports/pages at bottom
      url = `${url}${separator}navContentPaneEnabled=false&filterPaneEnabled=false`;
    }
    return url;
  };

  return (
    <div className="h-[calc(100vh-80px)] flex bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* SIDEBAR PANEL */}
      <aside
        className={`transition-all duration-300 border-r border-gray-200 bg-white flex flex-col shrink-0 ${isSidebarCollapsed ? 'w-10' : 'w-44'
          }`}
      >
        {/* Toggle Header */}
        <div className={`h-10 border-b border-gray-100 flex items-center px-3 ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <h2 className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.1em]">Assets</h2>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 text-gray-400 hover:text-indigo-600 transition-all"
            title={isSidebarCollapsed ? "Expand" : "Collapse"}
          >
            <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Dashboard List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 divide-y divide-gray-50">
          {dashboards.map((dash) => (
            <button
              key={dash._id}
              onClick={() => setSelectedDashId(dash._id)}
              className={`w-full text-left transition-all relative flex items-center py-2 px-3 group ${selectedDashId === dash._id ? 'bg-indigo-50/70' : 'hover:bg-gray-50'
                }`}
              title={dash.title}
            >
              {isSidebarCollapsed ? (
                <div className={`w-1 h-1 rounded-full mx-auto ${selectedDashId === dash._id ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              ) : (
                <div className="min-w-0 flex-1">
                  <div className={`text-[9.5px] font-bold uppercase tracking-tight truncate leading-tight ${selectedDashId === dash._id ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                    {dash.title}
                  </div>
                </div>
              )}
              {selectedDashId === dash._id && !isSidebarCollapsed && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-2 border-t border-gray-100 bg-gray-50/30">
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2'}`}>
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
            {!isSidebarCollapsed && (
              <span className="text-[7.5px] text-emerald-600 font-black uppercase tracking-widest">Active session</span>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN STAGE */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50 flex flex-col">
        {selectedDash ? (
          <div className="w-full p-4 md:p-8 space-y-4 animate-in slide-in-from-right-4 duration-500 flex-1">
            {/* Stage Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase leading-none">{selectedDash.title}</h2>
              </div>
            </div>

            {/* Context Box */}
            <div className="bg-white rounded border border-gray-200 shadow-sm px-3 py-2">
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium italic">
                "{selectedDash.description || 'Enterprise analytics and strategic data visualization.'}"
              </p>
            </div>

            {/* Data Stage */}
            <div className="relative w-full aspect-[600/373.5] bg-white rounded border border-gray-200 shadow-lg overflow-hidden group">
              <iframe
                key={selectedDash._id}
                title={selectedDash.title}
                src={extractSrc(selectedDash.powerBiIframe)}
                className="w-full h-full border-none"
                allowFullScreen={true}
              />
            </div>

            <p className="text-center text-[8px] text-gray-400 uppercase font-bold tracking-[0.4em] pt-1 pb-4">Validated Session</p>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select an Asset</h3>
              <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-wider">Choose a dashboard from the assets panel</p>
            </div>
          </div>
        )}
      </main>
      <GovernanceModal onRefreshDashboards={fetchDashboards} />
    </div>
  );
};

export default UserDashboard;
