
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MaterialItem, Student } from '../types';
import { BookOpen, Download, Bot, X } from 'lucide-react';
import { generateStudyExplanation } from '../services/geminiService';
import { useData } from '../contexts/DataContext';

const MaterialsPage: React.FC = () => {
  const { currentUser } = useOutletContext<{ currentUser: Student }>();
  const { materials: allMaterials, loading } = useData();
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  
  // AI State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [activeMaterial, setActiveMaterial] = useState<MaterialItem | null>(null);

  // Filter materials based on logged-in user's class
  const materials = allMaterials.filter(m => 
    m.classLevel === Number(currentUser.classLevel) && 
    (selectedSubject === 'All' || m.subject === selectedSubject)
  );

  // Get subjects only available for this class
  const availableSubjects = Array.from(new Set(
    allMaterials.filter(m => m.classLevel === Number(currentUser.classLevel))
             .map(m => m.subject)
  ));

  const handleAskAI = async (material: MaterialItem) => {
    setActiveMaterial(material);
    setIsAiModalOpen(true);
    setAiLoading(true);
    setAiContent('');

    const explanation = await generateStudyExplanation(material.title, material.classLevel);
    setAiContent(explanation);
    setAiLoading(false);
  };

  const handleDownload = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat materi...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Materi Pembelajaran</h2>
          <p className="text-gray-500 text-sm">
            Materi khusus untuk siswa <strong>Kelas {currentUser.classLevel}</strong>
          </p>
        </div>
        
        <div className="flex gap-2">
           <select 
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 min-w-[200px]"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="All">Semua Mata Pelajaran</option>
            {availableSubjects.map(subj => <option key={subj} value={subj}>{subj}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.length === 0 ? (
           <div className="col-span-full p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
             <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
             <p className="text-gray-500">
               {availableSubjects.length === 0 
                 ? `Belum ada materi yang diunggah untuk Kelas ${currentUser.classLevel}.` 
                 : "Tidak ada materi ditemukan untuk filter ini."}
             </p>
           </div>
        ) : (
          materials.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {item.subject}
                  </span>
                  <span className="text-xs text-gray-400">Kelas {item.classLevel}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {item.description}
                </p>
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center gap-2">
                <button 
                  onClick={() => handleDownload(item.downloadUrl)}
                  disabled={!item.downloadUrl}
                  className={`flex-1 flex items-center justify-center text-sm font-medium border py-2 rounded-lg transition-colors ${
                    item.downloadUrl 
                    ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50' 
                    : 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                  }`}
                  title={item.downloadUrl ? "Unduh Materi" : "Link tidak tersedia"}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {item.downloadUrl ? "Unduh" : "Tidak Ada Link"}
                </button>
                <button 
                  onClick={() => handleAskAI(item)}
                  className="flex-1 flex items-center justify-center text-sm font-medium text-white bg-indigo-600 py-2 rounded-lg hover:bg-indigo-700 transition-colors group"
                >
                  <Bot className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Tanya AI
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6" />
                <h3 className="font-bold text-lg">Asisten Belajar Pintar</h3>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="hover:bg-indigo-700 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {activeMaterial && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Topik</p>
                  <h4 className="font-semibold text-gray-800 text-lg">{activeMaterial.title}</h4>
                </div>
              )}

              <div className="min-h-[150px]">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-3 py-8">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 animate-pulse">Sedang menulis penjelasan seru...</p>
                  </div>
                ) : (
                  <div className="prose prose-sm prose-indigo max-w-none text-gray-700">
                    <p className="whitespace-pre-line leading-relaxed">{aiContent}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 text-center">
              <button 
                onClick={() => setIsAiModalOpen(false)}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Tutup Penjelasan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsPage;
