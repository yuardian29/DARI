
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ScheduleItem, Student } from '../types';
import { Clock, User, Sparkles } from 'lucide-react';
import { generateMotivation } from '../services/geminiService';
import { useData } from '../contexts/DataContext';

const SchedulePage: React.FC = () => {
  const { currentUser } = useOutletContext<{ currentUser: Student }>();
  const { schedules, loading, academicYear } = useData();
  const [motivation, setMotivation] = useState<string | null>(null);
  const [loadingMotivation, setLoadingMotivation] = useState(false);

  // Filter schedule based on logged-in user's class
  const scheduleData = schedules.find(s => s.classLevel === Number(currentUser.classLevel))?.schedule || [];

  const handleGetMotivation = async (subject: string) => {
    setLoadingMotivation(true);
    setMotivation(null);
    const text = await generateMotivation(subject);
    setMotivation(text);
    setLoadingMotivation(false);
  };

  // Group by day
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const groupedSchedule = days.map(day => ({
    day,
    items: scheduleData.filter(item => item.day === day).sort((a, b) => a.period.localeCompare(b.period))
  }));

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat jadwal...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Jadwal Pelajaran</h2>
          <p className="text-gray-500 text-sm">
            Jadwal mingguan untuk <strong>Kelas {currentUser.classLevel}</strong>
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
            Tahun Ajaran {academicYear}
          </div>
        </div>
      </div>

      {scheduleData.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">
            Jadwal pelajaran untuk Kelas {currentUser.classLevel} belum tersedia di Google Sheet (gid:2222).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedSchedule.map((group) => (
             group.items.length > 0 && (
              <div key={group.day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
                  <h3 className="font-bold text-indigo-900">{group.day}</h3>
                  <span className="text-xs text-indigo-500 bg-white px-2 py-0.5 rounded-full border border-indigo-100">
                    {group.items.length} Mapel
                  </span>
                </div>
                <div className="p-4 space-y-4 flex-1">
                  {group.items.map((item: ScheduleItem) => (
                    <div key={item.id} className="relative pl-4 border-l-2 border-indigo-200 hover:border-indigo-500 transition-colors group">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-800">{item.subject}</h4>
                        <button 
                          onClick={() => handleGetMotivation(item.subject)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-yellow-500 hover:text-yellow-600"
                          title="Minta motivasi AI"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.period}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="w-3 h-3 mr-1" />
                        {item.teacher}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
             )
          ))}
        </div>
      )}

      {/* AI Motivation Modal/Toast */}
      {loadingMotivation && (
        <div className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-xl border border-indigo-100 animate-pulse flex items-center gap-3 z-50">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" />
          <span className="text-sm font-medium text-gray-700">Mencari motivasi...</span>
        </div>
      )}
      
      {motivation && !loadingMotivation && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-indigo-600 text-white p-4 rounded-lg shadow-xl z-50 animate-bounce-in">
          <div className="flex items-start gap-3">
             <Sparkles className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
             <div>
               <p className="text-sm font-medium leading-relaxed">"{motivation}"</p>
               <button 
                onClick={() => setMotivation(null)}
                className="mt-2 text-xs text-indigo-200 hover:text-white underline"
               >
                 Tutup
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
