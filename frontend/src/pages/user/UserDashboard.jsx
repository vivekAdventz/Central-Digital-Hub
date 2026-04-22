import { useState, useEffect, useRef } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

const ShareMenu = ({ powerBiIframe }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  // Close share menu when dashboard changes
  useEffect(() => {
    setShowShareMenu(false);
    setCopied(false);
  }, [powerBiIframe]);

  const getIframeUrl = (iframeString) => {
    if (!iframeString) return '';
    let url = '';
    
    // If it's a full iframe tag, extract the src
    if (iframeString.includes('<iframe')) {
      const match = iframeString.match(/src="([^"]+)"/);
      url = match ? match[1] : '';
    } else {
      url = iframeString.trim();
    }

    if (!url) return '';

    // If it's a Power BI URL, append parameters to hide internal chrome (nav, filters, share, etc.)
    if (url.includes('app.powerbi.com')) {
      const separator = url.includes('?') ? '&' : '?';
      // navContentPaneEnabled=false: Hides the bottom footer/pages
       // filterPaneEnabled=false: Hides the filter pane on the right
       // commands=false: Hides the top and bottom command/sharing bars
      url = `${url}${separator}navContentPaneEnabled=false&filterPaneEnabled=false&commands=false`;
    }

    return url;
  };

  const handleCopyUrl = () => {
    const url = getIframeUrl(powerBiIframe);
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const shareUrl = getIframeUrl(powerBiIframe);

  if (!shareUrl) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 ${
          showShareMenu 
            ? 'bg-indigo-600 text-white border-indigo-600' 
            : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-500'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </button>

      {/* Share Dropdown - Positioned safely */}
      {showShareMenu && (
        <div className="absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] p-6 fade-in origin-top-right">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-4 bg-indigo-600 rounded-full"></div>
             <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Share Intelligence</h3>
          </div>
          
          <p className="text-[9px] font-bold text-slate-400 mb-4 uppercase tracking-[0.05em] leading-relaxed">External link generated for this report.</p>
          
          <div className="flex flex-col gap-3">
            <input 
              type="text" 
              readOnly 
              value={shareUrl} 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[10px] font-bold text-slate-400 focus:outline-none"
            />
            <button
              onClick={handleCopyUrl}
              className={`w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-lg active:scale-95 ${
                copied 
                  ? 'bg-emerald-500 text-white shadow-emerald-100' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
              }`}
            >
              {copied ? 'Link Copied!' : 'Copy Direct URL'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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



  const toggleFullscreen = () => {
    const element = document.getElementById('report-container');
    if (!element) return;

    if (!document.fullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) { /* Safari */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE11 */
        element.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar - Tight minimal width */}
      <div className="w-full md:w-[260px] lg:w-[280px] bg-white border-b md:border-b-0 md:border-r border-slate-200/50 flex flex-col h-auto md:h-full z-10 shadow-sm">
        <div className="p-4 md:p-5 border-b border-slate-100 bg-slate-50/30">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dashboards</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-4 space-y-2 max-h-[250px] md:max-h-full">
          {dashboards.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No results.</p>
          ) : (
            dashboards.map((dash, idx) => (
              <button
                key={dash._id}
                onClick={() => setSelectedDashId(dash._id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 border flex flex-col gap-1 relative ${
                  selectedDashId === dash._id
                    ? 'bg-indigo-50/50 border-indigo-200 shadow-sm'
                    : 'bg-white border-transparent hover:border-slate-200'
                }`}
              >
                <div className="flex items-start gap-2.5 w-full">
                  <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${selectedDashId === dash._id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xs font-bold truncate ${selectedDashId === dash._id ? 'text-indigo-950' : 'text-slate-700'}`}>{dash.title}</h3>
                    <p className="text-[9px] uppercase font-bold tracking-widest mt-1 text-slate-400">{dash.category}</p>
                    
                    {dash.viewOnly && (
                       <div className="mt-2 inline-flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100/50">
                         <div className="w-1 h-1 bg-rose-500 rounded-full animate-pulse"></div>
                         Secure
                       </div>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content - Minimalist tight padding */}
      <div className="flex-1 h-full overflow-y-auto bg-[#F8FAFC] p-4 md:p-5 lg:p-6 custom-scrollbar relative">
        {selectedDash ? (
          <div className="w-full flex flex-col gap-4 fade-in">
            <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200/50 shadow-sm relative z-[60]">
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">{selectedDash.title}</h2>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="text-[9px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                       {selectedDash.category}
                     </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={toggleFullscreen}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Fit to Screen
                  </button>

                  {!selectedDash.viewOnly && selectedDash.powerBiIframe && (
                    <ShareMenu powerBiIframe={selectedDash.powerBiIframe} />
                  )}
                </div>
              </div>
              
              {selectedDash.description && (
                <div className="mt-4 bg-slate-50/30 p-4 rounded-2xl border border-slate-100/50">
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{selectedDash.description}</p>
                </div>
              )}
            </div>

            <div id="report-container" className="flex-1 bg-white rounded-3xl border border-slate-200/50 shadow-sm p-1.5 relative min-h-[600px] md:min-h-[700px] flex flex-col overflow-hidden">
                <div className="report-frame-container bg-[#F8FAFC] flex-1 rounded-2xl">
                    <div className="report-shield">SECURE INTEL ARCHITECTURE</div>
                    
                    {selectedDash.powerBiIframe && selectedDash.powerBiIframe.startsWith('<iframe') ? (
                        <div className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:rounded-2xl" dangerouslySetInnerHTML={{ __html: selectedDash.powerBiIframe }} />
                    ) : (
                        <iframe 
                            title={selectedDash.title} 
                            src={selectedDash.powerBiIframe} 
                            frameBorder="0"
                            className="w-full h-full rounded-2xl"
                            allowFullScreen={true}>
                        </iframe>
                    )}
                </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 bg-white rounded-3xl border border-slate-100 shadow-sm border-dashed">
             <p className="text-sm font-black uppercase tracking-widest text-slate-400">Select a dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
