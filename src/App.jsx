import { useState } from 'react';
import VideoStream from './components/VideoStream';
import ScriptureStudy from './components/ScriptureStudy';
import QandA from './components/QandA';

function App() {
  const [activeTab, setActiveTab] = useState('study');

  const tabs = [
    { id: 'study', name: '📖 Scripture Study', component: ScriptureStudy },
    { id: 'qanda', name: '💬 Q&A', component: QandA },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">
            Rise Yahudim 🙏
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-center text-purple-700 font-medium">Study Precept by Precept</p>
        </header>

        {/* Video Stream Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <VideoStream />
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-purple-200">
          <div className="border-b-2 border-purple-100">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => {
                const colors = {
                  study: { active: 'border-purple-500 text-purple-600 bg-purple-50', hover: 'hover:bg-purple-50 hover:text-purple-600' },
                  qanda: { active: 'border-orange-500 text-orange-600 bg-orange-50', hover: 'hover:bg-orange-50 hover:text-orange-600' }
                };
                const tabColors = colors[tab.id] || colors.study;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 sm:py-2.5 md:py-3 px-2 sm:px-4 md:px-5 text-center text-sm sm:text-base md:text-lg font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? `border-b-4 ${tabColors.active}`
                        : `text-gray-500 ${tabColors.hover}`
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-3 sm:p-6 md:p-8" style={{ minHeight: '400px' }}>
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 sm:mt-8 md:mt-10 text-center text-purple-600 text-xs sm:text-sm md:text-base font-medium">
          <p>Made with ❤️ for Rise Yahudim</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
