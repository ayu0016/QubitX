import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, BookOpen, ChevronDown, ChevronRight, Play, CheckCircle2, 
  Lock, Star, Circle, Bell
} from 'lucide-react';
import { useCoursesContext } from './CoursesContext';
import { computeModuleProgress, computeCourseProgress, getCurrentLesson } from './courseData';
import clsx from 'clsx';

export default function CourseContentPage() {
  const { course } = useCoursesContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    fundamentals: true,
    'quantum-gates': true,
    'multi-qubit': true,
    'advanced-algorithms': true,
  });
  const [showInteractiveModal, setShowInteractiveModal] = useState(false);

  const courseProgress = computeCourseProgress(course);
  const currentLesson = getCurrentLesson(course);

  const filteredModules = useMemo(() => {
    if (!search.trim()) return course.modules;
    const lowerSearch = search.toLowerCase();
    return course.modules.map(mod => {
      const matchMod = mod.title.toLowerCase().includes(lowerSearch) || mod.description.toLowerCase().includes(lowerSearch);
      const matchedLessons = mod.lessons.filter(l => l.title.toLowerCase().includes(lowerSearch));
      if (matchMod) return mod;
      if (matchedLessons.length > 0) return { ...mod, lessons: matchedLessons };
      return null;
    }).filter(Boolean) as typeof course.modules;
  }, [course.modules, search]);

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getLessonIcon = (status: string, type: string) => {
    if (status === 'locked') return <Lock className="w-4 h-4 text-slate-400" />;
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />;
    if (status === 'in-progress') return <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />;
    if (type === 'challenge') return <Star className="w-4 h-4 text-amber-500 fill-amber-100" />;
    return <Circle className="w-4 h-4 text-slate-300" />;
  };

  const getModuleTheme = (number: string) => {
    if (number === '01') {
      return {
        iconBg: 'bg-[#E6FBF2]',
        iconText: 'text-[#059669]',
        barColor: 'bg-[#059669]',
        pctText: 'text-[#059669]',
      };
    }
    if (number === '02') {
      return {
        iconBg: 'bg-[#EEF2FF]',
        iconText: 'text-[#4F46E5]',
        barColor: 'bg-[#4F46E5]',
        pctText: 'text-[#4F46E5]',
      };
    }
    if (number === '03') {
      return {
        iconBg: 'bg-[#E0F2FE]',
        iconText: 'text-[#0284C7]',
        barColor: 'bg-[#0284C7]',
        pctText: 'text-[#0284C7]',
      };
    }
    return {
      iconBg: 'bg-slate-100',
      iconText: 'text-slate-400',
      barColor: 'bg-slate-400',
      pctText: 'text-slate-500',
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
      {/* ── Top Header Search & Profile Row (matches screenshot) ───────── */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search modules, circuits, concepts..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-[13.5px] placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button" 
            className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs relative"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 absolute top-2 right-2.5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-[#0B1C30] text-white flex items-center justify-center text-[12px] font-bold select-none shadow-2xs">
            AR
          </div>
        </div>
      </div>

      {/* ── Page Heading & Progress Card Row ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <div className="text-[13px] text-slate-500 font-medium mb-1.5">
            Modules &gt; Course content
          </div>
          <h1 className="text-[32px] font-extrabold text-[#0B1C30] tracking-tight leading-tight">
            {course.title}
          </h1>
          <p className="text-slate-600 text-[14px] mt-0.5">{course.subtitle}</p>
        </div>

        {/* Dynamic Progress Card (matches screenshot) */}
        <div className="bg-[#F8FAFF] px-6 py-4 rounded-2xl border border-indigo-100 flex items-center gap-6 shadow-2xs">
          <div className="flex flex-col">
            <span className="text-[28px] font-extrabold text-[#0B1C30] leading-none">
              {courseProgress.pct}%
            </span>
            <span className="text-[12px] font-semibold text-slate-400 mt-1">complete</span>
          </div>
          <div className="flex flex-col gap-2 min-w-[150px]">
            <div className="w-full bg-[#E0E7FF] h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#6366F1] h-full rounded-full transition-all duration-500" 
                style={{ width: `${courseProgress.pct}%` }} 
              />
            </div>
            <span className="text-[12px] font-medium text-slate-500">
              {courseProgress.completed} of {courseProgress.total} lessons complete
            </span>
          </div>
        </div>
      </div>

      {/* ── Resume Learning Card ────────────────────────────────────────── */}
      {currentLesson && (
        <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm overflow-hidden relative flex">
          {/* Vibrant left gradient bar */}
          <div className="w-1.5 bg-gradient-to-b from-pink-500 via-purple-600 to-indigo-600 shrink-0" />
          
          <div className="p-7 flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-[12px] font-semibold mb-3 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>AI recommended • Next up</span>
              </div>
              <h2 className="text-[22px] font-bold text-[#0B1C30] mb-2 tracking-tight">
                Continue: {currentLesson.title}
              </h2>
              <p className="text-slate-500 text-[14px]">
                {currentLesson.description || "Learn how gates transform the state of a qubit."} Lecture · {currentLesson.durationMin} min
              </p>
            </div>

            <button 
              onClick={() => navigate(`/courses/lesson/${currentLesson.id}`)}
              className="px-6 py-2.5 bg-[#0B1C30] hover:bg-slate-800 active:scale-98 text-white font-medium text-[14px] rounded-xl transition-all shadow-xs whitespace-nowrap flex items-center gap-2 cursor-pointer"
            >
              <span>Resume lesson</span>
              <span>→</span>
            </button>
          </div>

          {/* Concentric sphere wireframe graphics */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 border border-slate-100 rounded-full pointer-events-none opacity-40 -mr-10" />
          <div className="absolute right-20 top-1/2 -translate-y-1/2 w-32 h-32 border border-slate-100 rounded-full pointer-events-none opacity-40 -mr-6" />
        </div>
      )}

      {/* ── Modules List ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        {filteredModules.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
            No matching modules or lessons found for "{search}".
          </div>
        )}
        
        {filteredModules.map((mod) => {
          const modProgress = computeModuleProgress(mod);
          const isExpanded = expandedModules[mod.id];
          const theme = getModuleTheme(mod.number);

          return (
            <div key={mod.id} className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm overflow-hidden">
              {/* Module Header Bar */}
              <button 
                type="button"
                onClick={() => toggleModule(mod.id)}
                className="w-full p-6 text-left hover:bg-slate-50/60 transition-colors flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Module Number Box */}
                  <div className={clsx(
                    "w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-[16px] shrink-0 border border-slate-200/50",
                    theme.iconBg,
                    theme.iconText
                  )}>
                    {mod.locked ? <Lock className="w-5 h-5 text-slate-400" /> : mod.number}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                      <h3 className={clsx("text-[17px] font-bold tracking-tight", mod.locked ? "text-slate-500" : "text-[#0B1C30]")}>
                        {mod.number} &nbsp;{mod.title}
                      </h3>
                      {mod.locked && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium border border-slate-200">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-[13px] line-clamp-1">{mod.description}</p>
                  </div>
                </div>

                {/* Progress bar and toggle on right */}
                <div className="flex items-center gap-6 shrink-0">
                  {!mod.locked && (
                    <div className="flex flex-col items-end gap-1.5 w-36 sm:w-44">
                      <span className={clsx("text-[13px] font-bold font-mono", theme.pctText)}>
                        {modProgress}%
                      </span>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={clsx("h-full rounded-full transition-all duration-500", theme.barColor)} 
                          style={{ width: `${modProgress}%` }} 
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-slate-400 p-1">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>
              </button>

              {/* Lessons List inside Module */}
              {isExpanded && (
                <div className="border-t border-slate-100 divide-y divide-slate-100">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.status === 'in-progress';
                    const isLocked = mod.locked || lesson.status === 'locked';

                    return (
                      <div 
                        key={lesson.id}
                        onClick={() => {
                          if (isLocked) return;
                          navigate(`/courses/lesson/${lesson.id}`);
                        }}
                        className={clsx(
                          "px-6 py-4 flex items-center justify-between gap-4 transition-colors",
                          isLocked 
                            ? "cursor-not-allowed opacity-75" 
                            : "cursor-pointer hover:bg-slate-50/80",
                          isActive && "bg-[#F8FAFF]"
                        )}
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className="w-5 flex justify-center shrink-0">
                            {getLessonIcon(lesson.status, lesson.type)}
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={clsx(
                              "text-[14px] font-medium",
                              isLocked ? "text-slate-400" : (isActive ? "text-[#0B1C30] font-semibold" : "text-[#0B1C30]")
                            )}>
                              {lesson.title}
                            </span>

                            {isActive && (
                              <span className="text-[12px] text-indigo-600 font-medium">
                                Lecture · {lesson.durationMin} min
                              </span>
                            )}

                            {lesson.type === 'challenge' && (
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                Challenge
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right side: duration or locked message, and Resume button */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[13px] text-slate-400 font-medium">
                            {isLocked ? (
                              "Complete Module 03 to unlock"
                            ) : isActive ? (
                              ""
                            ) : (
                              lesson.type === 'challenge' ? `Challenge · ${lesson.durationMin} min` : `Lecture · ${lesson.durationMin} min`
                            )}
                          </span>

                          {isActive && (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/courses/lesson/${lesson.id}`);
                              }}
                              className="px-4 py-1.5 bg-[#0B1C30] hover:bg-slate-800 text-white text-[12px] font-semibold rounded-lg shadow-2xs cursor-pointer transition-colors"
                            >
                              Resume
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Bottom Interactive Classroom Info Card ─────────────────────── */}
      <div 
        className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-5 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowInteractiveModal(true)}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-[12px] font-semibold shrink-0 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Interactive Classroom</span>
        </div>

        <p className="text-slate-600 text-[13.5px] leading-relaxed flex-1">
          Lectures open the interactive classroom when you select them. Your progress updates as you watch, predict, run, and compare results in real time.
        </p>
      </div>

      {/* Interactive Classroom Modal */}
      {showInteractiveModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150" 
          onClick={() => setShowInteractiveModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150" 
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <BookOpen size={20} />
            </div>
            <h3 className="text-[18px] font-bold text-[#0B1C30] mb-2">Interactive Classroom</h3>
            <p className="text-slate-600 text-[13.5px] leading-relaxed mb-6">
              Interactive lectures combine high-definition videos with in-video concept predictions, automatic checkpoint verification, and live quantum state simulators.
            </p>
            <button 
              type="button"
              onClick={() => setShowInteractiveModal(false)}
              className="w-full py-2.5 bg-[#0B1C30] hover:bg-slate-800 text-white rounded-xl text-[13.5px] font-semibold transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
