import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  ChevronLeft, ChevronRight, CheckCircle2, HelpCircle,
  Sparkles
} from 'lucide-react';
import { useCoursesContext } from './CoursesContext';
import { getLessonById, getPrevNextLessons } from './courseData';
import clsx from 'clsx';

const VTT_CONTENT = `WEBVTT

00:00.000 --> 00:03.000
Today we will explore how two qubits can become entangled.

00:03.000 --> 00:06.000
In this session we explore quantum states and Bell state correlations.

00:06.000 --> 00:10.000
When one qubit is measured, the second qubit is instantaneously determined.`;

export default function LecturePage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { course, lessonProgress, updateLessonProgress, completeLesson, markInProgress } = useCoursesContext();
  
  const lessonData = lessonId ? getLessonById(course, lessonId) : null;
  const { prev, next } = lessonId ? getPrevNextLessons(course, lessonId) : { prev: null, next: null };
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [captionsActive, setCaptionsActive] = useState(true);
  
  const [captionSrc] = useState(() => {
    const blob = new Blob([VTT_CONTENT], { type: 'text/vtt' });
    return URL.createObjectURL(blob);
  });
  
  const lesson = lessonData?.lesson;
  const module = lessonData?.module;
  const progress = lessonId ? lessonProgress[lessonId] : null;
  
  const [activeCheckpointId, setActiveCheckpointId] = useState<string | null>(() => {
    if (lesson?.checkpoints && lesson.checkpoints.length > 0) {
      return lesson.checkpoints.find(cp => !progress?.checkpointsDone?.includes(cp.id))?.id || lesson.checkpoints[0].id;
    }
    return null;
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checkpointSubmitted, setCheckpointSubmitted] = useState<boolean>(() => {
    const firstCheckpointId = lesson?.checkpoints?.[0]?.id;
    return Boolean(firstCheckpointId && progress?.checkpointsDone?.includes(firstCheckpointId));
  });
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState<{ c00: number; c11: number } | null>(null);

  // Mark lesson as in-progress on load
  useEffect(() => {
    if (lessonId && lesson?.status === 'available') {
      markInProgress(lessonId);
    }
  }, [lessonId, lesson, markInProgress]);

  // Restore watched position if available
  useEffect(() => {
    if (videoRef.current && progress?.watchedSeconds && progress.watchedSeconds > 0) {
      videoRef.current.currentTime = progress.watchedSeconds;
    }
  }, [lessonId, progress?.watchedSeconds]);

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return '00:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Video play interrupted:", err);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === ' ') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.key === 'ArrowRight') {
        if (videoRef.current) videoRef.current.currentTime += 5;
      } else if (e.key === 'ArrowLeft') {
        if (videoRef.current) videoRef.current.currentTime -= 5;
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, toggleMute, toggleFullscreen]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const v = parseFloat(e.target.value);
    videoRef.current.volume = v;
    setVolume(v);
    setIsMuted(v === 0);
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current || isDragging) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    // Throttle progress persistence
    if (lessonId && Math.floor(curr) % 5 === 0) {
      updateLessonProgress(lessonId, { watchedSeconds: curr });
    }

    // Checkpoint detection: pause when reaching checkpoint if not yet answered
    if (lesson?.checkpoints) {
      for (const cp of lesson.checkpoints) {
        if (curr >= cp.time && !progress?.checkpointsDone?.includes(cp.id)) {
          if (!videoRef.current.paused) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
          setActiveCheckpointId(cp.id);
          setSelectedOption(null);
          setCheckpointSubmitted(false);
          videoRef.current.currentTime = cp.time;
          break;
        }
      }
    }

    // Completion detection: >= 90% watched + all checkpoints done
    if (lessonId && lesson && duration > 0 && curr >= 0.85 * duration) {
      const allDone = lesson.checkpoints?.every(cp => progress?.checkpointsDone?.includes(cp.id)) ?? true;
      if (allDone && lesson.status !== 'completed') {
        completeLesson(lessonId);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };
  
  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    setIsDragging(false);
    const target = e.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    
    // Prevent seeking past uncompleted checkpoints
    let maxAllowed = duration;
    if (lesson?.checkpoints) {
      const uncompleted = lesson.checkpoints.filter(cp => !progress?.checkpointsDone?.includes(cp.id));
      if (uncompleted.length > 0) {
        maxAllowed = Math.min(...uncompleted.map(cp => cp.time));
      }
    }
    if (newTime > maxAllowed) {
      videoRef.current.currentTime = maxAllowed;
      setCurrentTime(maxAllowed);
    } else {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleCaptions = useCallback(() => {
    setCaptionsActive((current) => {
      const nextValue = !current;
      const track = videoRef.current?.textTracks?.[0];
      if (track) {
        track.mode = nextValue ? 'showing' : 'hidden';
      }
      return nextValue;
    });
  }, []);

  const handleCheckpointSubmit = () => {
    if (selectedOption === null || !activeCheckpointId || !lessonId) return;
    setCheckpointSubmitted(true);
    updateLessonProgress(lessonId, { 
      checkpointsDone: Array.from(new Set([...(progress?.checkpointsDone || []), activeCheckpointId]))
    });
  };

  const handleCheckpointContinue = () => {
    // If there is a next checkpoint, prepare it
    if (lesson?.checkpoints) {
      const currentIndex = lesson.checkpoints.findIndex(c => c.id === activeCheckpointId);
      if (currentIndex + 1 < lesson.checkpoints.length) {
        setActiveCheckpointId(lesson.checkpoints[currentIndex + 1].id);
        setSelectedOption(null);
        setCheckpointSubmitted(false);
      }
    }

    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Resume play:", err);
      });
    }
  };

  const runSimulation = () => {
    setIsSimulationRunning(true);
    setTimeout(() => {
      const c00 = 505 + Math.floor(Math.random() * 20) - 10;
      const c11 = 1024 - c00;
      setSimulationResults({ c00, c11 });
      setIsSimulationRunning(false);
    }, 600);
  };

  if (!lesson || !module) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p className="text-lg font-semibold text-slate-700 mb-2">Lesson not found</p>
        <button 
          onClick={() => navigate('/courses')}
          className="px-4 py-2 bg-[#0B1C30] text-white rounded-xl text-sm font-medium"
        >
          Return to Course Content
        </button>
      </div>
    );
  }

  const activeCheckpoint = lesson.checkpoints?.find(cp => cp.id === activeCheckpointId) || lesson.checkpoints?.[0];
  const checkpointIndex = lesson.checkpoints && activeCheckpoint 
    ? lesson.checkpoints.findIndex(c => c.id === activeCheckpoint.id) + 1 
    : 1;
  const totalCheckpoints = lesson.checkpoints?.length || 2;

  // Visual display duration (14:10 for realism as shown in screenshot)
  const displayDuration = duration > 0 ? duration : 850;
  const displayCurrentTime = duration > 0 ? currentTime : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 flex flex-col gap-6">
      {/* ── 1. Breadcrumbs (matches screenshot) ─────────────────────────── */}
      <div>
        <div className="text-[13px] text-slate-500 font-medium mb-1.5 flex items-center gap-1.5">
          <button 
            onClick={() => navigate('/courses')} 
            className="hover:text-slate-800 transition-colors"
          >
            Modules
          </button>
          <span>&gt;</span>
          <span>{module.title}</span>
          <span>&gt;</span>
          <span className="font-bold text-[#0B1C30]">{lesson.title}</span>
        </div>

        <h1 className="text-[32px] font-extrabold text-[#0B1C30] tracking-tight leading-tight">
          {lesson.title}
        </h1>
        <p className="text-slate-600 text-[14px] mt-1.5 leading-relaxed">
          {lesson.description || "Understand how entangled qubits behave and why their measurement outcomes are correlated."}
        </p>

        {/* Metadata Pills Row (matches screenshot) */}
        <div className="flex items-center gap-2.5 mt-4 flex-wrap select-none">
          <span className="px-3.5 py-1 bg-white text-slate-700 rounded-full text-[13px] font-medium border border-slate-200 shadow-2xs">
            Lecture 1 of {module.lessons.length}
          </span>
          <span className="px-3.5 py-1 bg-white text-slate-700 rounded-full text-[13px] font-medium border border-slate-200 shadow-2xs flex items-center gap-1.5">
            <span>⏱</span> {lesson.durationMin} min
          </span>
          <span className={clsx(
            "px-3.5 py-1 rounded-full text-[13px] font-semibold border flex items-center gap-1.5 shadow-2xs",
            lesson.status === 'completed' && "bg-emerald-50 text-emerald-700 border-emerald-200",
            lesson.status === 'in-progress' && "bg-[#EEF2FF] text-[#4F46E5] border-indigo-200",
            lesson.status === 'available' && "bg-white text-slate-600 border-slate-200"
          )}>
            <span className={clsx(
              "w-1.5 h-1.5 rounded-full",
              lesson.status === 'completed' ? "bg-emerald-500" : "bg-indigo-600"
            )} />
            <span>{lesson.status === 'completed' ? '✓ Completed' : lesson.status === 'in-progress' ? 'In progress' : 'Not started'}</span>
          </span>
        </div>
      </div>

      {/* ── 2. Video Player Card (matches screenshot) ───────────────────── */}
      <div 
        ref={videoContainerRef} 
        className="relative bg-[#0B111E] rounded-[24px] overflow-hidden aspect-video shadow-lg group select-none border border-slate-800"
      >
        {/* Top-left badge: Interactive lecture */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <div className="px-3 py-1.5 bg-black/50 backdrop-blur-xs text-white/90 text-[12px] font-semibold rounded-xl border border-white/10 flex items-center gap-1.5">
            <span className="text-indigo-400">🎥</span>
            <span>Interactive lecture</span>
          </div>
        </div>

        {/* Top-right badge: Live state simulator active */}
        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <div className="px-3 py-1.5 bg-black/50 backdrop-blur-xs text-white/90 text-[12px] font-semibold rounded-xl border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live state simulator active</span>
          </div>
        </div>

        {/* Center Play Button Overlay */}
        {!isPlaying && (
          <button 
            type="button"
            onClick={handlePlayPause}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 hover:bg-white text-[#0B1C30] rounded-full flex items-center justify-center shadow-xl transition-all z-20 hover:scale-105 cursor-pointer"
            aria-label="Play video"
          >
            <Play className="w-7 h-7 ml-1 fill-current" />
          </button>
        )}

        {/* Real HTML5 Video element */}
        <video
          ref={videoRef}
          src={lesson.videoSrc}
          poster={lesson.videoPoster}
          className="w-full h-full object-cover cursor-pointer"
          onClick={handlePlayPause}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          crossOrigin="anonymous"
          playsInline
        >
          <track kind="captions" src={captionSrc} srcLang="en" label="English" default={captionsActive} />
        </video>

        {/* Video Controls Bar (bottom overlay) */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 flex flex-col gap-2.5">
          {/* Progress / Scrubber Bar */}
          <div className="relative group/scrubber cursor-pointer h-3 flex items-center">
            <input 
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              onChange={handleSeek}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              className="w-full absolute z-20 opacity-0 cursor-pointer h-4"
              aria-label="Seek video position"
            />
            {/* Background track */}
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden transition-all group-hover/scrubber:h-1.5 relative">
              <div 
                className="h-full bg-slate-300"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>
            {/* Pink playhead dot (matches screenshot pink indicator) */}
            <div 
              className="absolute w-3.5 h-3.5 rounded-full bg-[#EC4899] border-2 border-white shadow-md pointer-events-none -ml-1.5 transition-all"
              style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
            />
            {/* Chapter checkpoint divider ticks */}
            {lesson.checkpoints?.map(cp => (
              <div 
                key={cp.id}
                className="absolute w-1.5 h-2.5 bg-white/70 pointer-events-none rounded-full top-1/2 -translate-y-1/2"
                style={{ left: `${(cp.time / (duration || 1)) * 100}%` }}
                title={`Checkpoint at ${formatTime(cp.time)}`}
              />
            ))}
          </div>

          {/* Lower Controls Row */}
          <div className="flex items-center justify-between text-white/90 text-[13px]">
            {/* Left Controls: Play, Time, Volume */}
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={handlePlayPause} 
                className="text-white hover:text-indigo-400 transition-colors cursor-pointer"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              
              <div className="font-mono text-[12px] text-white/80 select-none">
                {formatTime(displayCurrentTime)} / {formatTime(displayDuration)}
              </div>

              <div className="flex items-center gap-2 group/volume">
                <button 
                  type="button"
                  onClick={toggleMute} 
                  className="text-white hover:text-indigo-400 transition-colors cursor-pointer"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input 
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/20 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                  aria-label="Volume"
                />
              </div>
            </div>

            {/* Right Controls: CC, Speed, Fullscreen */}
            <div className="flex items-center gap-3">
              {/* CC button */}
              <button 
                type="button"
                onClick={toggleCaptions}
                className={clsx(
                  "px-2 py-0.5 rounded text-[11px] font-bold border transition-colors cursor-pointer",
                  captionsActive ? "bg-white/20 border-white text-white" : "border-white/50 text-white/60 hover:text-white"
                )}
                aria-label="Toggle closed captions"
              >
                CC
              </button>

              {/* Speed Menu */}
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="px-2 py-0.5 rounded text-[12px] font-mono font-bold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Playback rate"
                >
                  {playbackRate}x
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-[#1A202C] border border-white/10 rounded-xl shadow-xl py-1 flex flex-col min-w-[70px] z-30 animate-in fade-in zoom-in-95">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                      <button 
                        key={rate}
                        type="button"
                        onClick={() => {
                          setPlaybackRate(rate);
                          if (videoRef.current) videoRef.current.playbackRate = rate;
                          setShowSpeedMenu(false);
                        }}
                        className={clsx(
                          "px-3 py-1 text-[12px] font-mono text-left hover:bg-white/10 transition-colors cursor-pointer",
                          playbackRate === rate ? "text-indigo-400 font-bold" : "text-white/80"
                        )}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button 
                type="button"
                onClick={toggleFullscreen} 
                className="text-white hover:text-indigo-400 transition-colors cursor-pointer"
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Checkpoint Quiz Card (exact match with Screenshot 2) ─────── */}
      {activeCheckpoint && (
        <div className="bg-[#F0F4FF] rounded-[24px] border border-indigo-100/90 p-6 sm:p-8 flex flex-col gap-5 shadow-2xs animate-in fade-in duration-200">
          {/* Top Row: Pill badge + Checkpoint progress indicator */}
          <div className="flex items-center justify-between flex-wrap gap-2 select-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-200 text-indigo-700 text-[12px] font-semibold shadow-2xs">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Predict before you continue</span>
            </div>

            <span className="text-slate-500 text-[13px] font-medium">
              Checkpoint {checkpointIndex} of {totalCheckpoints}
            </span>
          </div>

          {/* Context and Question */}
          <div>
            {activeCheckpoint.context && (
              <p className="text-slate-600 text-[14px] mb-1 font-medium">
                {activeCheckpoint.context}
              </p>
            )}
            <h2 className="text-[22px] font-extrabold text-[#0B1C30] tracking-tight">
              {activeCheckpoint.question}
            </h2>
          </div>

          {/* Radio Options List */}
          <div className="flex flex-col gap-3">
            {activeCheckpoint.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === activeCheckpoint.correctIndex;
              const showResult = checkpointSubmitted;

              let cardStyle = "bg-white border-slate-200 hover:border-indigo-300";
              if (isSelected && !showResult) {
                cardStyle = "bg-white border-indigo-600 ring-2 ring-indigo-500/20";
              }
              if (showResult && isCorrect) {
                cardStyle = "bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/20";
              }
              if (showResult && isSelected && !isCorrect) {
                cardStyle = "bg-rose-50/80 border-rose-300 ring-2 ring-rose-300/20";
              }

              return (
                <label 
                  key={idx}
                  onClick={() => !showResult && setSelectedOption(idx)}
                  className={clsx(
                    "flex items-center p-4 rounded-2xl border transition-all cursor-pointer select-none shadow-2xs",
                    cardStyle,
                    showResult && "cursor-default"
                  )}
                >
                  {/* Radio Indicator */}
                  <div className={clsx(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3.5 shrink-0 transition-colors",
                    isSelected ? "border-indigo-600" : "border-slate-300",
                    showResult && isCorrect && "border-emerald-600 bg-emerald-600 text-white"
                  )}>
                    {isSelected && !showResult && (
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    )}
                    {showResult && isCorrect && (
                      <span className="text-[10px] font-bold">✓</span>
                    )}
                  </div>

                  <span className={clsx(
                    "text-[14px] font-medium leading-snug",
                    isSelected ? "text-slate-900 font-semibold" : "text-slate-700"
                  )}>
                    {opt}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Feedback Explanation (shows after submission) */}
          {checkpointSubmitted && (
            <div className={clsx(
              "p-5 rounded-2xl border flex flex-col gap-1.5 animate-in fade-in",
              selectedOption === activeCheckpoint.correctIndex 
                ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
                : "bg-amber-50 border-amber-200 text-amber-900"
            )}>
              <div className="flex items-center gap-2 font-bold text-[14px]">
                <CheckCircle2 size={16} className={selectedOption === activeCheckpoint.correctIndex ? "text-emerald-600" : "text-amber-600"} />
                <span>
                  {selectedOption === activeCheckpoint.correctIndex 
                    ? "✓ Correct. Your prediction matches the expected correlation." 
                    : "Not quite. The pair is correlated in this Bell state setup."}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed text-slate-700 mt-1">
                <strong>Why?</strong> {activeCheckpoint.explanation}
              </p>
            </div>
          )}

          {/* Bottom Action Row */}
          <div className="flex items-center gap-4 flex-wrap pt-1">
            {!checkpointSubmitted ? (
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleCheckpointSubmit}
                className={clsx(
                  "px-6 py-2.5 rounded-xl font-semibold text-[13.5px] transition-all shadow-xs flex items-center gap-2 cursor-pointer",
                  selectedOption !== null 
                    ? "bg-[#0B1C30] hover:bg-slate-800 text-white" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                <span>Submit prediction</span>
                <span>→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCheckpointContinue}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-[13.5px] transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Continue lesson</span>
                <span>→</span>
              </button>
            )}

            <span className="text-slate-500 text-[13px]">
              {checkpointSubmitted 
                ? "Ready to proceed with video playback." 
                : "Your tutor explains the result after you submit."}
            </span>
          </div>
        </div>
      )}

      {/* ── 4. Live State Simulator Card ─────────────────────────────────── */}
      <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-[17px] font-bold text-[#0B1C30]">
              Live State Simulator
            </h3>
            <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded-md bg-slate-100">
              Bell Pair (|00⟩ + |11⟩)
            </span>
          </div>

          <button
            type="button"
            onClick={runSimulation}
            disabled={isSimulationRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[12px] font-semibold rounded-xl border border-indigo-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={13} />
            <span>{isSimulationRunning ? "Measuring 1024 shots..." : "Run simulation"}</span>
          </button>
        </div>

        {/* State description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#F8FAFF] border border-indigo-100/70 flex flex-col justify-between">
            <span className="text-[12px] font-semibold text-slate-500">Quantum Statevector</span>
            <p className="text-[18px] font-bold font-mono text-indigo-950 mt-1">
              |Ψ⟩ = 1/√2 (|00⟩ + |11⟩)
            </p>
            <span className="text-[11px] text-slate-400 mt-2">Correlated 2-Qubit Bell State</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6FCF9] border border-emerald-100/70 flex flex-col justify-between">
            <span className="text-[12px] font-semibold text-slate-500">Measurement Probabilities</span>
            <div className="flex items-center gap-6 mt-1 text-[15px] font-mono font-bold text-slate-800">
              <span>P(|00⟩) = 50%</span>
              <span>P(|11⟩) = 50%</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-2">Zero chance of |01⟩ or |10⟩</span>
          </div>
        </div>

        {/* Measurement Outcome Simulation Display */}
        {simulationResults && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[13px] flex flex-col gap-2">
            <div className="flex justify-between items-center text-slate-600 font-semibold text-[12px]">
              <span>Sampled Counts (1024 shots on simulator):</span>
              <span className="font-mono text-emerald-600">Matches theory</span>
            </div>
            <div className="flex flex-col gap-1.5 font-mono text-[12px]">
              <div className="flex items-center justify-between">
                <span>|00⟩ :</span>
                <div className="flex-1 mx-3 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${(simulationResults.c00 / 1024) * 100}%` }}
                  />
                </div>
                <span className="font-bold">{simulationResults.c00} ({Math.round(simulationResults.c00 / 1024 * 100)}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>|11⟩ :</span>
                <div className="flex-1 mx-3 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full transition-all"
                    style={{ width: `${(simulationResults.c11 / 1024) * 100}%` }}
                  />
                </div>
                <span className="font-bold">{simulationResults.c11} ({Math.round(simulationResults.c11 / 1024 * 100)}%)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 5. Bottom Navigation (exact match with Screenshot 2) ────────── */}
      <div className="flex flex-col gap-1.5 pt-2">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          {/* Previous Lesson Button */}
          {prev ? (
            <button 
              type="button"
              onClick={() => navigate(`/courses/lesson/${prev.id}`)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-full text-slate-700 text-[13.5px] font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Previous: {prev.title}</span>
            </button>
          ) : (
            <div />
          )}

          {/* Next Lesson Button */}
          {next ? (
            <button 
              type="button"
              onClick={() => {
                if (next.status !== 'locked') {
                  navigate(`/courses/lesson/${next.id}`);
                }
              }}
              disabled={next.status === 'locked' && !checkpointSubmitted}
              className={clsx(
                "flex items-center gap-2 px-6 py-2.5 rounded-full text-[13.5px] font-semibold transition-colors shadow-2xs",
                next.status !== 'locked' || checkpointSubmitted
                  ? "bg-white border border-slate-200 hover:border-slate-300 text-slate-800 cursor-pointer"
                  : "bg-white border border-slate-200/60 text-slate-300 cursor-not-allowed"
              )}
            >
              <span>Next: {next.title}</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <div />
          )}
        </div>

        {/* Next Lesson Helper Text */}
        {next && !checkpointSubmitted && (
          <div className="text-right text-[12px] text-slate-400 select-none pr-3">
            Submit your prediction to continue
          </div>
        )}
      </div>
    </div>
  );
}
