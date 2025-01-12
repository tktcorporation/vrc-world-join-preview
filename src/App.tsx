import React, { useState } from 'react';
import { Moon, Sun, Settings2, X } from 'lucide-react';
import { PreviewGenerator } from './components/PreviewGenerator';
import type { CreateSharePreviewOptions } from './types';

export default function App() {
  const [options, setOptions] = useState<CreateSharePreviewOptions>({
    worldName: 'My Amazing World',
    // 環境変数にあればそこから取得、なければ空文字
    imageUrl: import.meta.env.VITE_IMAGE_URL || '',
    playerNameList: ['Player 1', 'Player 2', 'Player 3'],
    isDarkMode: false,
  });
  const [showSettings, setShowSettings] = useState(false);

  const toggleDarkMode = () => {
    setOptions(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  return (
    <div className={`min-h-screen ${
      options.isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Preview Generator</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full ${
                options.isDarkMode ? 'bg-gray-700' : 'bg-white'
              } shadow-lg`}
            >
              {showSettings ? <X size={24} /> : <Settings2 size={24} />}
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                options.isDarkMode ? 'bg-gray-700' : 'bg-white'
              } shadow-lg`}
            >
              {options.isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {showSettings && (
            <div className={`p-6 rounded-lg ${
              options.isDarkMode ? 'bg-gray-900' : 'bg-white'
            } shadow-xl transition-all duration-300`}>
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">World Name</label>
                  <input
                    type="text"
                    value={options.worldName}
                    onChange={(e) => setOptions(prev => ({
                      ...prev,
                      worldName: e.target.value
                    }))}
                    className="w-full p-2 rounded border bg-transparent"
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Image URL</label>
                  <input
                    type="text"
                    value={options.imageUrl}
                    onChange={(e) => setOptions(prev => ({
                      ...prev,
                      imageUrl: e.target.value
                    }))}
                    className="w-full p-2 rounded border bg-transparent"
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Players (one per line)</label>
                  <textarea
                    value={options.playerNameList.join('\n')}
                    onChange={(e) => setOptions(prev => ({
                      ...prev,
                      playerNameList: e.target.value.split('\n').filter(Boolean)
                    }))}
                    className="w-full p-2 rounded border bg-transparent h-32"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="overflow-auto">
            <PreviewGenerator {...options} />
          </div>
        </div>
      </div>
    </div>
  );
}