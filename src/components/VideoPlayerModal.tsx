import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Send,
  Sparkles,
  Save,
  Download,
  ExternalLink,
  Clock
} from 'lucide-react';
import { Lecture } from '../types';
import { TELEGRAM_URL } from '../data/coursesData';

interface VideoPlayerModalProps {
  lecture: Lecture | null;
  allLectures: Lecture[];
  onClose: () => void;
  onSelectLecture: (lec: Lecture) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  lecture,
  allLectures,
  onClose,
  onSelectLecture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [qualities, setQualities] = useState<{ id: number; height: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'playlist' | 'notes'>('info');
  const [personalNotes, setPersonalNotes] = useState('');
  const [savedNotification, setSavedNotification] = useState(false);

  const isHls = lecture?.videoUrl?.includes('.m3u8');
  const isYouTube = lecture?.videoUrl?.includes('youtube.com') || lecture?.videoUrl?.includes('youtu.be');

  // Load HLS or Video stream
  useEffect(() => {
    if (!lecture) return;

    const savedNotes = localStorage.getItem(`gb_lecture_note_${lecture.id}`);
    setPersonalNotes(savedNotes || '');

    if (isHls && videoRef.current) {
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new Hls({
          maxBufferLength: 60,
          enableWorker: true,
        });

        hls.loadSource(lecture.videoUrl);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          const lvls = data.levels.map((l, idx) => ({ id: idx, height: l.height }));
          setQualities(lvls);
          videoRef.current?.play().catch(() => {
            setIsPlaying(false);
          });
          setIsPlaying(true);
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                try {
                  hls.destroy();
                  if (videoRef.current) {
                    videoRef.current.src = lecture.videoUrl;
                    videoRef.current.play().catch(() => {});
                  }
                } catch (e) {}
                break;
            }
          }
        });

        hlsRef.current = hls;

        return () => {
          hls.destroy();
          hlsRef.current = null;
        };
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // iOS Safari native HLS
        videoRef.current.src = lecture.videoUrl;
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  }, [lecture, isHls]);

  if (!lecture) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        Math.max(0, videoRef.current.currentTime + seconds),
        duration
      );
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  const changeQuality = (levelId: number) => {
    setCurrentQuality(levelId);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelId;
    }
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.parentElement?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const h = Math.floor(m / 60);
    if (h > 0) {
      const remM = m % 60;
      return `${h}:${remM < 10 ? '0' : ''}${remM}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`gb_lecture_note_${lecture.id}`, personalNotes);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-6xl max-h-[96vh] bg-[#120716] border border-pink-500/40 rounded-3xl shadow-2xl shadow-pink-950/70 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-pink-500/20 bg-[#180a1e]">
          <div className="flex items-center gap-2 overflow-hidden mr-4">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              {lecture.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-pink-300 hover:text-white bg-pink-900/40 hover:bg-pink-800 rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Close video player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player & Adjacent Sidebar */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
          {/* Main Video Screen */}
          <div className="lg:col-span-2 bg-black flex flex-col justify-center">
            {isYouTube ? (
              /* YouTube Player */
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`${lecture.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                  title={lecture.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              /* Native HLS / Plyr Style Video Player */
              <div className="relative w-full aspect-video bg-black group/player">
                <video
                  ref={videoRef}
                  onClick={togglePlay}
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      setCurrentTime(videoRef.current.currentTime);
                      setDuration(videoRef.current.duration || 0);
                    }
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  playsInline
                  className="w-full h-full object-contain cursor-pointer"
                />

                {/* Big Center Play/Pause Overlay */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-pink-600/90 text-white shadow-2xl shadow-pink-600/50 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                )}

                {/* Custom Pink Player Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2 transition-opacity opacity-90 hover:opacity-100">
                  {/* Seek Bar */}
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-pink-950/60 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-3">
                      {/* Play/Pause */}
                      <button
                        onClick={togglePlay}
                        className="p-1.5 hover:text-pink-400 cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>

                      {/* 10s Rewind */}
                      <button
                        onClick={() => skipTime(-10)}
                        className="p-1.5 hover:text-pink-400 cursor-pointer flex items-center gap-0.5 text-[11px]"
                        title="Rewind 10 seconds"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>10</span>
                      </button>

                      {/* 10s Forward */}
                      <button
                        onClick={() => skipTime(10)}
                        className="p-1.5 hover:text-pink-400 cursor-pointer flex items-center gap-0.5 text-[11px]"
                        title="Forward 10 seconds"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>10</span>
                      </button>

                      {/* Time display */}
                      <span className="font-mono text-[11px] text-pink-200">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 relative">
                      {/* Speed badge */}
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="px-2 py-0.5 bg-pink-900/60 hover:bg-pink-800 rounded text-[11px] font-mono font-bold text-pink-300 border border-pink-500/30 cursor-pointer"
                      >
                        {playbackSpeed}x
                      </button>

                      {/* Fullscreen */}
                      <button
                        onClick={toggleFullscreen}
                        className="p-1.5 hover:text-pink-400 cursor-pointer"
                      >
                        <Maximize className="w-4 h-4" />
                      </button>

                      {/* Settings Popover */}
                      {showSettings && (
                        <div className="absolute bottom-9 right-0 bg-[#1b0a22] border border-pink-500/40 rounded-xl p-3 shadow-xl w-48 text-xs space-y-3 z-30">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-pink-400 block mb-1">
                              Playback Speed
                            </span>
                            <div className="grid grid-cols-3 gap-1">
                              {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                                <button
                                  key={spd}
                                  onClick={() => changeSpeed(spd)}
                                  className={`py-1 rounded font-mono ${
                                    playbackSpeed === spd
                                      ? 'bg-pink-600 text-white font-bold'
                                      : 'bg-pink-950/40 text-pink-200 hover:bg-pink-900'
                                  }`}
                                >
                                  {spd}x
                                </button>
                              ))}
                            </div>
                          </div>

                          {qualities.length > 0 && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-pink-400 block mb-1">
                                Video Quality
                              </span>
                              <div className="space-y-1">
                                <button
                                  onClick={() => changeQuality(-1)}
                                  className={`w-full py-1 px-2 text-left rounded ${
                                    currentQuality === -1
                                      ? 'bg-pink-600 text-white font-bold'
                                      : 'bg-pink-950/40 text-pink-200 hover:bg-pink-900'
                                  }`}
                                >
                                  Auto (Adaptive)
                                </button>
                                {qualities.map((q) => (
                                  <button
                                    key={q.id}
                                    onClick={() => changeQuality(q.id)}
                                    className={`w-full py-1 px-2 text-left rounded font-mono ${
                                      currentQuality === q.id
                                        ? 'bg-pink-600 text-white font-bold'
                                        : 'bg-pink-950/40 text-pink-200 hover:bg-pink-900'
                                    }`}
                                  >
                                    {q.height}p HD
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom info strip */}
            <div className="p-3 bg-[#15071a] border-t border-pink-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-pink-300">
                <Clock className="w-3.5 h-3.5 text-pink-400" />
                <span>Duration: {lecture.duration}</span>
                <span>·</span>
                <span className="text-emerald-400 font-semibold">GB STUDY Free Access</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Doubt Group</span>
                </a>

                {lecture.videoUrl && (
                  <a
                    href={lecture.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-pink-300 hover:text-white bg-pink-950/60 rounded-xl border border-pink-500/30"
                    title="Open stream in external tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Deck: Playlist & Notes */}
          <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-pink-500/20 bg-[#140819] flex flex-col h-full max-h-[450px] lg:max-h-none overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-pink-500/20 bg-[#180a1e] text-xs font-semibold">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                  activeTab === 'info'
                    ? 'text-pink-400 border-b-2 border-pink-500 bg-pink-950/30 font-bold'
                    : 'text-pink-200/70 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('playlist')}
                className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                  activeTab === 'playlist'
                    ? 'text-pink-400 border-b-2 border-pink-500 bg-pink-950/30 font-bold'
                    : 'text-pink-200/70 hover:text-white'
                }`}
              >
                Playlist ({allLectures.length})
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                  activeTab === 'notes'
                    ? 'text-pink-400 border-b-2 border-pink-500 bg-pink-950/30 font-bold'
                    : 'text-pink-200/70 hover:text-white'
                }`}
              >
                Study Pad
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'info' && (
              <div className="p-4 overflow-y-auto space-y-4 flex-1">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5 font-['Outfit']">
                    Lecture Description
                  </h4>
                  <p className="text-xs text-pink-200/80 leading-relaxed">
                    {lecture.description || 'Full comprehensive lecture with step-by-step concepts, board tips, and solved questions.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-pink-950/40 border border-pink-500/20 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-pink-300 font-semibold">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>How to get the most out of this class:</span>
                  </div>
                  <ul className="list-disc list-inside text-pink-200/80 space-y-1.5 pl-1 text-[11px] leading-relaxed">
                    <li>Watch actively with pen and notebook.</li>
                    <li>Pause and attempt Sanskrit anvaya / formulas yourself.</li>
                    <li>Download the chapter PDF notes after this lecture.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Playlist */}
            {activeTab === 'playlist' && (
              <div className="p-3 overflow-y-auto space-y-2 flex-1">
                {allLectures.map((lec, idx) => {
                  const isCurrent = lec.id === lecture.id;
                  return (
                    <button
                      key={`${lec.id}-${idx}`}
                      onClick={() => onSelectLecture(lec)}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isCurrent
                          ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-600/30'
                          : 'bg-pink-950/30 hover:bg-pink-900/40 text-pink-200 border border-pink-500/15'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          isCurrent ? 'bg-white text-pink-700' : 'bg-pink-900/50 text-pink-300'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <p className="text-xs truncate">{lec.title}</p>
                          <span className={`text-[10px] ${isCurrent ? 'text-pink-100' : 'text-pink-400/80'}`}>
                            {lec.duration}
                          </span>
                        </div>
                      </div>
                      {isCurrent ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black/30 rounded uppercase shrink-0">
                          Playing
                        </span>
                      ) : (
                        <Play className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 3: Interactive Study Scratchpad */}
            {activeTab === 'notes' && (
              <div className="p-4 flex flex-col h-full flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-pink-300">
                    Your Personal Lecture Notes
                  </span>
                  {savedNotification && (
                    <span className="text-[10px] font-semibold text-emerald-400 animate-pulse">
                      Saved to browser!
                    </span>
                  )}
                </div>

                <textarea
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  placeholder="Type important formula, shloka meanings, or doubts here..."
                  className="w-full flex-1 min-h-[160px] p-3 text-xs bg-black/40 border border-pink-500/30 rounded-xl text-pink-100 placeholder-pink-300/40 outline-none focus:border-pink-500 resize-none font-mono"
                />

                <div className="pt-3">
                  <button
                    onClick={handleSaveNotes}
                    className="w-full py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save My Notes</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
