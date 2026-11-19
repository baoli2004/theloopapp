export type Lang = 'en' | 'vi';

export type ReasonKey = 'Curious' | 'Bored' | 'Habit';

export interface Dict {
  // Header
  appTagline: string;
  tabDashboard: string;
  tabPeers: string;
  statusMindful: string;
  statusInLoop: string;
  simulate: string;

  // Dashboard - status hero
  currentStatus: string;
  mindfulMsg: string;
  inLoopMsg: string;

  // Dashboard - stats
  statTeamStreak: string;
  statDays: string;
  statFocusRate: string;
  statInterrupts: string;
  statScreenTime: string;
  today: string;

  // Dashboard - chart
  chartTitle: string;
  chartSubtitle: string;
  chartUsage: string;
  chartInterrupts: string;
  daysShort: string[];

  // Dashboard - score
  groupScore: string;
  scoreSubtitle: string;
  points: string;
  winsToday: string;

  // Dashboard - recent
  recentSessions: string;
  noInterrupts: string;
  brokeLoop: string;
  continued: string;

  // Pattern interrupt
  simulatingScroll: string;
  videosSwiped: (n: number) => string;
  system2: string;
  nudgeMessage: string;
  nudgeWithGoal: (goal: string) => string;
  takeBreath: string;
  yourCall: string;
  whatToDo: string;
  noJudgment: string;
  breakLoop: string;
  breakLoopSub: string;
  continueWatching: string;
  continueSub: string;
  quickCheck: string;
  whatPulling: string;
  oneTap: string;
  checkBackSooner: string;
  buttonsUnlock: (n: number) => string;
  reasons: Record<ReasonKey, string>;

  // Toasts
  toastLoopBroken: string;
  toastReason: (reason: string) => string;
  toastNudge: (name: string) => string;

  // Peer matrix
  peerMatrix: string;
  peerSubtitle: string;
  buddyStatus: {
    off_screen: string;
    focused: string;
    needs_nudge: string;
    scrolling: string;
  };
  buddyIsCurrently: (name: string, label: string) => string;
  minFocused: (n: number) => string;
  dayStreak: (n: number) => string;
  sendPeerPause: string;
  pauseSent: string;
  allGood: string;
  howPauseWorks: string;
  pauseStep1: string;
  pauseStep2: string;
  pauseStep3: string;
  peerDemoNote: string;

  // Goal
  myGoal: string;
  goalSubtitle: string;
  screenTimeLimit: string;
  focusSessionsGoal: string;
  personalGoal: string;
  personalGoalPlaceholder: string;
  saveGoal: string;
  editGoal: string;
  goalProgress: string;
  goalOnTrack: string;
  goalOver: string;
  goalRemaining: (n: number) => string;
  goalOverBy: (n: number) => string;
  sessionsProgress: (done: number, goal: number) => string;
  minutes: string;

  // Usage Insights - navigation + tab
  tabInsights: string;

  // Usage Insights - entry form
  insEntryTitle: string;
  insEntrySubtitle: string;
  insSelectDate: string;
  insAppUsage: string;
  insAppName: string;
  insMinutes: string;
  insAddApp: string;
  insAddAppNamePlaceholder: string;
  insSaveData: string;
  insEditData: string;
  insOverwriteConfirm: string;
  insOverwriteTitle: string;
  insOverwriteBody: string;
  insCancel: string;
  insConfirm: string;
  insSaved: string;
  insInvalidInput: string;
  insNoAppsEntered: string;
  insRemoveApp: string;
  insDataSource: string;
  insDataSourceText: string;
  insClearAll: string;

  // Usage Insights - dashboard
  insDashboardTitle: string;
  insDashboardSubtitle: string;
  insTotalToday: string;
  insTotalUsage: (n: number) => string;
  insPerApp: string;
  insAppBreakdown: string;
  insDailyHistory: string;
  insWeeklySummary: string;
  insVsYesterday: string;
  insMoreThan: (n: number) => string;
  insLessThan: (n: number) => string;
  insSameAs: string;
  insNoPrevData: string;
  insDailyGoal: string;
  insSetGoal: string;
  insGoalAbove: (n: number) => string;
  insGoalBelow: (n: number) => string;
  insGoalMet: string;
  insNoData: string;
  insNoDataDesc: string;
  insEnterData: string;
  insNoDataShort: string;
  insMinShort: string;
  insDeleteRecord: string;
  insDeleteConfirm: string;

  // Usage Insights - reflection
  insReflectionTitle: string;
  insReflectionQ: string;
  insReflectionReasons: Record<string, string>;
  insReflectionText: string;
  insReflectionPlaceholder: string;
  insIntentionQ: string;
  insIntentionPlaceholder: string;
  insSaveReflection: string;
  insReflectionSaved: string;
  insSkipReflection: string;

  // Usage Insights - CSV export
  insExportTitle: string;
  insExportDesc: string;
  insExportCSV: string;
  insExportAnon: string;
  insExportAnonDesc: string;
  insExportFull: string;
  insExportFullDesc: string;
  insExportNoData: string;
  insSampleData: string;
  insSampleDataDesc: string;
  insLoadSample: string;
  insClearSample: string;
  insRealData: string;
  insPrivacyNote: string;
  insPrivacyNoteText: string;

  // THE LOOP MIRROR
  mirrorTitle: string;
  mirrorSubtitle: string;
  mirrorOpen: string;
  mirrorQuestion: string;
  mirrorReasons: Record<string, string>;
  mirrorReflections: Record<string, string>;
  mirrorWhatNow: string;
  mirrorChoices: Record<string, string>;
  mirrorEncouragement: Record<string, string>;
  mirrorBack: string;
  mirrorReturn: string;
  mirrorClose: string;
  mirrorSaved: string;
  mirrorPrivacyNote: string;
  mirrorHistory: string;
  mirrorHistoryEmpty: string;
  mirrorHistoryReason: string;
  mirrorHistoryChoice: string;
  mirrorHistoryTime: string;
  mirrorViewHistory: string;
  mirrorNoHistory: string;
  mirrorClearAll: string;
  mirrorClearAllConfirm: string;
  mirrorLoadSample: string;
  mirrorClearSample: string;
  mirrorDemoBadge: string;
  mirrorSessionsToday: string;
  mirrorRecentSession: string;
  mirrorChoiceReturn: string;
  mirrorChoiceBreak: string;
  mirrorChoiceContinue: string;
  mirrorReasonBored: string;
  mirrorReasonStressed: string;
  mirrorReasonFomo: string;
  mirrorReasonHabit: string;
  mirrorReasonConnect: string;
  mirrorReasonOther: string;

  // Dashboard enhancements
  dashboardManualNote: string;
  dashboardNoUsageData: string;
  dashboardEnterUsage: string;
  goalSavedOnTrack: string;
  goalSavedOver: string;
  dataCleared: string;
  sampleLoaded: string;
  sampleCleared: string;

  // Action Tracking / follow-up
  actionResultsTitle: string;
  actionResultsSubtitle: string;
  actionTotalCheckins: string;
  actionCompleted: string;
  actionPartial: string;
  actionNotCompleted: string;
  actionNoData: string;
  actionNoDataDesc: string;
  actionHistoryTitle: string;
  actionHistoryEmpty: string;
  actionExportCSV: string;
  actionExportDesc: string;
  actionExportNoData: string;
  followUpPrompt: string;
  followUpQuestion: (choice: string) => string;
  followUpInterval: string;
  followUpIntervalDesc: string;
  followUpSkip: string;
  followUpSet: string;
  followUpSetToast: string;
  followUpSkipped: string;
  followUpCheckInTitle: string;
  followUpCheckInQ: string;
  followUpSelfReported: string;
  followUpStatusCompleted: string;
  followUpStatusPartial: string;
  followUpStatusNotCompleted: string;
  followUpNoteLabel: string;
  followUpNotePlaceholder: string;
  followUpSubmit: string;
  followUpSubmitted: string;
  followUpBanner: (choice: string) => string;
  followUpCheckInNow: string;
  followUpLater: string;
  followUpOverdue: string;
  followUpPending: string;

  // Language switcher
  langName: string;
}

const en: Dict = {
  appTagline: 'Intentional Friction Lab',
  tabDashboard: 'Autonomy Hub',
  tabPeers: 'Peer Matrix',
  statusMindful: 'Mindful',
  statusInLoop: 'In The Loop',
  simulate: 'Simulate',

  currentStatus: 'Current Status',
  mindfulMsg: 'You are in control of your attention right now.',
  inLoopMsg: 'Friction is ready when you need a moment to reflect.',

  statTeamStreak: 'Team Streak',
  statDays: 'Days',
  statFocusRate: 'Focus Rate',
  statInterrupts: 'Interrupts',
  statScreenTime: 'Screen Time',
  today: 'Today',

  chartTitle: 'Daily Usage vs Interrupts',
  chartSubtitle: 'Last 7 days · lower screen time + more breaks = better',
  chartUsage: 'Usage',
  chartInterrupts: 'Interrupts',
  daysShort: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],

  groupScore: 'Group Score',
  scoreSubtitle: 'Your contribution to the team',
  points: 'pts',
  winsToday: 'Wins today',

  recentSessions: 'Recent Sessions',
  noInterrupts: 'No interrupts yet today. Tap "Simulate" to test the friction.',
  brokeLoop: 'Broke the loop',
  continued: 'Continued',

  simulatingScroll: 'Simulating scroll session',
  videosSwiped: (n) => `${n} videos swiped`,
  system2: 'System 2 Engaged',
  nudgeMessage: 'Is this next video worth your study plan?',
  nudgeWithGoal: (goal) => `Is this next video worth: ${goal}?`,
  takeBreath: 'Take a breath. You have a moment to decide.',
  yourCall: 'Your Call',
  whatToDo: 'What do you want to do?',
  noJudgment: 'No judgment. Just an honest choice.',
  breakLoop: 'Break The Loop',
  breakLoopSub: 'Close and recenter · +group score',
  continueWatching: 'Continue Watching',
  continueSub: 'Quick reason check · shorter next interrupt',
  quickCheck: 'Quick Check',
  whatPulling: "What's pulling you in?",
  oneTap: 'One tap. This stays private.',
  checkBackSooner: "We'll check back sooner next time.",
  buttonsUnlock: (n) => `Buttons unlock in ${n}s`,
  reasons: { Curious: 'Curious', Bored: 'Bored', Habit: 'Habit' },

  toastLoopBroken: 'Loop broken. +10 to your group score.',
  toastReason: (reason) => `Logged: ${reason}. Next check-in sooner.`,
  toastNudge: (name) => `Gentle pause sent to ${name}`,

  peerMatrix: 'Peer Matrix',
  peerSubtitle: 'Real-time focus states of your accountability group. States are anonymized and shared with consent.',
  buddyStatus: {
    off_screen: 'off-screen',
    focused: 'focused',
    needs_nudge: 'needs a 3-min nudge',
    scrolling: 'scrolling',
  },
  buddyIsCurrently: (name, label) => `${name} is currently ${label}`,
  minFocused: (n) => `${n}m focused`,
  dayStreak: (n) => `${n}d streak`,
  sendPeerPause: 'Send Peer Pause',
  pauseSent: 'Pause sent',
  allGood: 'All good',
  howPauseWorks: 'How Peer Pause works',
  pauseStep1: 'A teammate is scrolling past their limit.',
  pauseStep2: 'You send a gentle, one-tap pause prompt.',
  pauseStep3: 'They get a friendly nudge — zero judgment, no scores exposed.',
  peerDemoNote: 'This is a demonstration with simulated team members. No real people are connected. Peer-to-peer networking is not implemented in this prototype.',

  myGoal: 'My Daily Goal',
  goalSubtitle: 'Set your own target. You are in charge.',
  screenTimeLimit: 'Screen Time Limit',
  focusSessionsGoal: 'Focus Sessions',
  personalGoal: 'Personal Goal',
  personalGoalPlaceholder: 'e.g. Finish math homework before 8pm',
  saveGoal: 'Save Goal',
  editGoal: 'Edit',
  goalProgress: 'Progress',
  goalOnTrack: 'On track',
  goalOver: 'Over limit',
  goalRemaining: (n) => `${n}m left today`,
  goalOverBy: (n) => `${n}m over limit`,
  sessionsProgress: (done, goal) => `${done} / ${goal} sessions`,
  minutes: 'min',

  // Usage Insights
  tabInsights: 'Usage Insights',

  insEntryTitle: 'Enter Usage Data',
  insEntrySubtitle: 'Manually enter minutes from Android Digital Wellbeing.',
  insSelectDate: 'Date',
  insAppUsage: 'App Usage (minutes)',
  insAppName: 'App name',
  insMinutes: 'Minutes',
  insAddApp: 'Add app',
  insAddAppNamePlaceholder: 'App name',
  insSaveData: 'Save Data',
  insEditData: 'Edit',
  insOverwriteConfirm: 'Overwrite existing record?',
  insOverwriteTitle: 'Record already exists',
  insOverwriteBody: 'A record for this date already exists. Do you want to overwrite it?',
  insCancel: 'Cancel',
  insConfirm: 'Overwrite',
  insSaved: 'Data saved successfully',
  insInvalidInput: 'Please enter valid whole numbers (0 or more)',
  insNoAppsEntered: 'Enter at least one app with minutes',
  insRemoveApp: 'Remove',
  insDataSource: 'How to get your data',
  insDataSourceText: 'Open Settings > Digital Wellbeing on your Android phone. Note the screen time for each app and enter the numbers here.',
  insClearAll: 'Clear All Data',

  insDashboardTitle: 'Usage Insights',
  insDashboardSubtitle: 'Your tracked social media usage patterns.',
  insTotalToday: 'Total tracked today',
  insTotalUsage: (n) => `${n} min`,
  insPerApp: 'Per app',
  insAppBreakdown: 'App Breakdown',
  insDailyHistory: 'Daily History',
  insWeeklySummary: 'Weekly Summary',
  insVsYesterday: 'vs yesterday',
  insMoreThan: (n) => `+${n} min vs yesterday`,
  insLessThan: (n) => `−${n} min vs yesterday`,
  insSameAs: 'Same as yesterday',
  insNoPrevData: 'No data for yesterday',
  insDailyGoal: 'Daily Goal',
  insSetGoal: 'Set goal',
  insGoalAbove: (n) => `${n} min over goal`,
  insGoalBelow: (n) => `${n} min under goal`,
  insGoalMet: 'Goal met',
  insNoData: 'No data available',
  insNoDataDesc: 'No usage data has been entered for this date yet.',
  insEnterData: 'Enter data for this date',
  insNoDataShort: '—',
  insMinShort: 'm',
  insDeleteRecord: 'Delete',
  insDeleteConfirm: 'Delete this record?',

  insReflectionTitle: 'Reflection',
  insReflectionQ: 'What influenced your social media use today?',
  insReflectionReasons: {
    bored: 'I was bored',
    stressed: 'I felt stressed or wanted to avoid schoolwork',
    fomo: 'I was afraid of missing messages, trends, or information',
    habit: 'I opened the app out of habit',
    connect: 'I wanted to connect with friends',
    other: 'Other',
  },
  insReflectionText: 'Additional reflection (optional)',
  insReflectionPlaceholder: 'Anything else you noticed about your usage today?',
  insIntentionQ: 'What is one small action you would like to try tomorrow?',
  insIntentionPlaceholder: 'e.g. Put my phone in another room while studying',
  insSaveReflection: 'Save Reflection',
  insReflectionSaved: 'Reflection saved',
  insSkipReflection: 'Skip for now',

  insExportTitle: 'Export & Data',
  insExportDesc: 'Export your research data as a CSV file.',
  insExportCSV: 'Export CSV',
  insExportAnon: 'Anonymous export',
  insExportAnonDesc: 'No names or personal identifiers included.',
  insExportFull: 'Full export',
  insExportFullDesc: 'Includes all fields you entered.',
  insExportNoData: 'No data to export yet',
  insSampleData: 'Sample Data',
  insSampleDataDesc: 'Load clearly-labeled sample data for testing. This is separate from your real data.',
  insLoadSample: 'Load Sample Data',
  insClearSample: 'Clear Sample Data',
  insRealData: 'Your data',
  insPrivacyNote: 'Privacy note',
  insPrivacyNoteText: 'Data is stored only in this browser on this device. It does not sync across devices and is not sent anywhere. Clearing browser data will erase it.',

  mirrorTitle: 'THE LOOP MIRROR',
  mirrorSubtitle: 'Pause a moment to check in with yourself.',
  mirrorOpen: 'Pause a moment',
  mirrorQuestion: 'Right now, what is making you want to open social media?',
  mirrorReasons: {
    bored: 'I am bored.',
    stressed: 'I feel stressed or want to avoid schoolwork.',
    fomo: 'I am afraid of missing something.',
    habit: 'I am just opening it out of habit.',
    connect: 'I want to connect with friends.',
    other: 'Another reason.',
  },
  mirrorReflections: {
    bored: 'When you feel bored, social media is an easy way to fill the gap. You might try finding a small activity that interests you — listen to a song, doodle, or walk around the room.',
    stressed: 'When stressed, wanting to avoid things is a very natural reaction. A short break might help you feel lighter. You deserve rest without feeling guilty.',
    fomo: 'The fear of missing out is very common. But most news and trends will still be there when you return. You do not need to keep up with everything right now.',
    habit: 'Sometimes your hand opens an app without thinking — it is just a habit. Noticing this is already a step forward. You might try keeping your phone a bit further away while studying.',
    connect: 'Wanting to connect with friends is healthy and good. If that is your real purpose, a few minutes of messaging may be enough — you do not need to scroll aimlessly.',
    other: 'Everyone has their own reasons. The fact that you paused to identify yours is already valuable. Ask yourself: will this help you feel the way you want to?',
  },
  mirrorWhatNow: 'What would you like to do now?',
  mirrorChoices: {
    return: 'Go back to what I was doing.',
    break: 'Take a few minutes for an intentional break.',
    continue: 'Continue using social media mindfully.',
  },
  mirrorEncouragement: {
    return: 'Great! You chose to go back to your task. Wishing you a calm, focused session.',
    break: 'A short break is a wonderful choice. Take a deep breath, stretch, or sip some water — you deserve this moment.',
    continue: 'That is okay. The fact that you paused to reflect is already using social media mindfully. Enjoy your time, and stay aware.',
  },
  mirrorBack: 'Back',
  mirrorReturn: 'Back to dashboard',
  mirrorClose: 'Close',
  mirrorSaved: 'Reflection session recorded.',
  mirrorPrivacyNote: 'This record is stored only in this browser on this device. No names or personal details are included.',
  mirrorHistory: 'Mirror History',
  mirrorHistoryEmpty: 'No mirror sessions yet. Your reflections will appear here.',
  mirrorHistoryReason: 'Reason',
  mirrorHistoryChoice: 'Choice',
  mirrorHistoryTime: 'Time',
  mirrorViewHistory: 'View history',
  mirrorNoHistory: 'No sessions recorded yet.',
  mirrorClearAll: 'Clear all mirror data',
  mirrorClearAllConfirm: 'Delete all mirror reflection records? This cannot be undone.',
  mirrorLoadSample: 'Load demo data',
  mirrorClearSample: 'Clear demo data',
  mirrorDemoBadge: 'DEMO',
  mirrorSessionsToday: 'Mirror sessions today',
  mirrorRecentSession: 'Mirror session',
  mirrorChoiceReturn: 'Returned to task',
  mirrorChoiceBreak: 'Intentional break',
  mirrorChoiceContinue: 'Continued mindfully',
  mirrorReasonBored: 'Bored',
  mirrorReasonStressed: 'Stressed',
  mirrorReasonFomo: 'FOMO',
  mirrorReasonHabit: 'Habit',
  mirrorReasonConnect: 'Connect',
  mirrorReasonOther: 'Other',

  dashboardManualNote: 'Screen time is entered manually from Android Digital Wellbeing. This app does not automatically read phone usage data.',
  dashboardNoUsageData: 'No usage data entered yet.',
  dashboardEnterUsage: 'Enter usage data',
  goalSavedOnTrack: 'Goal saved. You are on track!',
  goalSavedOver: 'Goal saved. You are currently over your screen time limit.',
  dataCleared: 'All data cleared.',
  sampleLoaded: 'Sample data loaded.',
  sampleCleared: 'Sample data cleared.',

  actionResultsTitle: 'Action Results',
  actionResultsSubtitle: 'Self-reported follow-up outcomes from your MIRROR sessions.',
  actionTotalCheckins: 'Total check-ins',
  actionCompleted: 'Completed',
  actionPartial: 'Partially completed',
  actionNotCompleted: 'Not completed',
  actionNoData: 'No follow-up check-ins yet',
  actionNoDataDesc: 'After completing a MIRROR session and choosing an action, you can schedule a follow-up check-in. Results will appear here.',
  actionHistoryTitle: 'Session History',
  actionHistoryEmpty: 'No sessions recorded yet.',
  actionExportCSV: 'Export Sessions (CSV)',
  actionExportDesc: 'Export all recorded MIRROR sessions with follow-up outcomes for research analysis.',
  actionExportNoData: 'No sessions to export yet.',
  followUpPrompt: 'Schedule a follow-up check-in?',
  followUpQuestion: (choice) => `You chose to "${choice}". After a short time, we will ask how it went. This is self-reported — we do not monitor your phone.`,
  followUpInterval: 'Check-in interval',
  followUpIntervalDesc: 'Choose when to check back. We will remind you at that time.',
  followUpSkip: 'Skip for now',
  followUpSet: 'Schedule check-in',
  followUpSetToast: 'Follow-up check-in scheduled.',
  followUpSkipped: 'No follow-up scheduled.',
  followUpCheckInTitle: 'Follow-up Check-in',
  followUpCheckInQ: 'How did it go with the action you chose?',
  followUpSelfReported: 'This is your own self-report. Nothing is tracked automatically.',
  followUpStatusCompleted: 'Completed',
  followUpStatusPartial: 'Partially completed',
  followUpStatusNotCompleted: 'Not completed',
  followUpNoteLabel: 'Optional explanation',
  followUpNotePlaceholder: 'Anything you want to note about how it went?',
  followUpSubmit: 'Submit check-in',
  followUpSubmitted: 'Check-in recorded. Thank you for reflecting.',
  followUpBanner: (choice) => `Check-in ready for: ${choice}`,
  followUpCheckInNow: 'Check in now',
  followUpLater: 'Later',
  followUpOverdue: 'Check-in overdue',
  followUpPending: 'Check-in pending',

  langName: 'English',
};

const vi: Dict = {
  appTagline: 'Phòng Thí Nghiệm Ý Định',
  tabDashboard: 'Trung Tâm Tự Chủ',
  tabPeers: 'Mạng Bạn Bè',
  statusMindful: 'Tỉnh Táo',
  statusInLoop: 'Đang Mê Lướt',
  simulate: 'Mô Phỏng',

  currentStatus: 'Trạng Thái Hiện Tại',
  mindfulMsg: 'Bạn đang làm chủ sự tập trung của mình.',
  inLoopMsg: 'Khoảng dừng đã sẵn sàng khi bạn cần chút thời gian suy nghĩ.',

  statTeamStreak: 'Chuỗi Nhóm',
  statDays: 'Ngày',
  statFocusRate: 'Tỉ Lệ Tập Trung',
  statInterrupts: 'Lần Ngắt',
  statScreenTime: 'Thời Gian Màn Hình',
  today: 'Hôm nay',

  chartTitle: 'Sử Dụng Hàng Ngày & Lần Ngắt',
  chartSubtitle: '7 ngày qua · ít màn hình + nhiều lần dừng = tốt hơn',
  chartUsage: 'Sử dụng',
  chartInterrupts: 'Lần ngắt',
  daysShort: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],

  groupScore: 'Điểm Nhóm',
  scoreSubtitle: 'Đóng góp của bạn cho nhóm',
  points: 'điểm',
  winsToday: 'Thắng hôm nay',

  recentSessions: 'Phiên Gần Đây',
  noInterrupts: 'Chưa có lần ngắt nào hôm nay. Nhấn "Mô Phỏng" để thử.',
  brokeLoop: 'Đã thoát vòng lặp',
  continued: 'Tiếp tục · ',

  simulatingScroll: 'Đang mô phỏng lướt video',
  videosSwiped: (n) => `${n} video đã lướt`,
  system2: 'Tư Duy Chậm Bật',
  nudgeMessage: 'Video tiếp theo có đáng hơn kế hoạch học tập không?',
  nudgeWithGoal: (goal) => `Video tiếp theo có đáng hơn: ${goal} không?`,
  takeBreath: 'Hít thở. Bạn có chút thời gian để quyết định.',
  yourCall: 'Quyết Của Bạn',
  whatToDo: 'Bạn muốn làm gì?',
  noJudgment: 'Không phán xét. Chỉ là một lựa chọn thật lòng.',
  breakLoop: 'Thoát Vòng Lặp',
  breakLoopSub: 'Đóng và tập lại · +điểm nhóm',
  continueWatching: 'Tiếp Tục Xem',
  continueSub: 'Chọn lý do nhanh · ngắt sớm hơn lần sau',
  quickCheck: 'Kiểm Tra Nhanh',
  whatPulling: 'Điều gì đang kéo bạn vào?',
  oneTap: 'Chạm một lần. Riêng tư hoàn toàn.',
  checkBackSooner: 'Lần sau sẽ nhắc bạn sớm hơn.',
  buttonsUnlock: (n) => `Nút mở sau ${n}s`,
  reasons: { Curious: 'Tò Mò', Bored: 'Chán', Habit: 'Thói Quen' },

  toastLoopBroken: 'Đã thoát vòng lặp. +10 điểm cho nhóm.',
  toastReason: (reason) => `Đã ghi: ${reason}. Lần nhắc kế sớm hơn.`,
  toastNudge: (name) => `Đã gửi lời nhắc nhẹ nhàng đến ${name}`,

  peerMatrix: 'Mạng Bạn Bè',
  peerSubtitle: 'Trạng thái tập trung theo thời gian thực của nhóm. Ẩn danh và chia sẻ với sự đồng ý.',
  buddyStatus: {
    off_screen: 'ngoài màn hình',
    focused: 'đang tập trung',
    needs_nudge: 'cần nhắc 3 phút',
    scrolling: 'đang lướt',
  },
  buddyIsCurrently: (name, label) => `${name} hiện đang ${label}`,
  minFocused: (n) => `${n} phút tập trung`,
  dayStreak: (n) => `${n} ngày liền`,
  sendPeerPause: 'Gửi Nhắc Dừng',
  pauseSent: 'Đã gửi nhắc',
  allGood: 'Bình thường',
  howPauseWorks: 'Nhắc Dừng hoạt động thế nào',
  pauseStep1: 'Một bạn đang lướt quá giới hạn.',
  pauseStep2: 'Bạn gửi một lời nhắc dừng nhẹ nhàng, một chạm.',
  pauseStep3: 'Họ nhận được nhắc nhở thân thiện — không phán xét, không lộ điểm.',
  peerDemoNote: 'Đây là bản demo với thành viên nhóm giả lập. Không có người thật kết nối. Tính năng mạng ngang hàng chưa được triển khai trong prototype này.',

  myGoal: 'Mục Tiêu Hàng Ngày',
  goalSubtitle: 'Tự đặt mục tiêu. Bạn tự làm chủ.',
  screenTimeLimit: 'Giới Hạn Màn Hình',
  focusSessionsGoal: 'Phiên Tập Trung',
  personalGoal: 'Mục Tiêu Cá Nhân',
  personalGoalPlaceholder: 'vd. Làm xong bài Toán trước 8 giờ tối',
  saveGoal: 'Lưu Mục Tiêu',
  editGoal: 'Sửa',
  goalProgress: 'Tiến Độ',
  goalOnTrack: 'Đạt mục tiêu',
  goalOver: 'Vượt giới hạn',
  goalRemaining: (n) => `Còn ${n} phút hôm nay`,
  goalOverBy: (n) => `Vượt ${n} phút giới hạn`,
  sessionsProgress: (done, goal) => `${done} / ${goal} phiên`,
  minutes: 'phút',

  // Usage Insights
  tabInsights: 'Thống kê sử dụng',

  insEntryTitle: 'Nhập dữ liệu sử dụng',
  insEntrySubtitle: 'Nhập số phút từ Digital Wellbeing trên điện thoại.',
  insSelectDate: 'Ngày',
  insAppUsage: 'Thời gian sử dụng ứng dụng (phút)',
  insAppName: 'Tên ứng dụng',
  insMinutes: 'Phút',
  insAddApp: 'Thêm ứng dụng',
  insAddAppNamePlaceholder: 'Tên ứng dụng',
  insSaveData: 'Lưu dữ liệu',
  insEditData: 'Sửa',
  insOverwriteConfirm: 'Ghi đè bản ghi đã có?',
  insOverwriteTitle: 'Đã có bản ghi cho ngày này',
  insOverwriteBody: 'Đã tồn tại bản ghi cho ngày này. Bạn có muốn ghi đè không?',
  insCancel: 'Huỷ',
  insConfirm: 'Ghi đè',
  insSaved: 'Đã lưu dữ liệu thành công',
  insInvalidInput: 'Vui lòng nhập số hợp lệ (0 trở lên)',
  insNoAppsEntered: 'Nhập ít nhất một ứng dụng có phút',
  insRemoveApp: 'Xoá',
  insDataSource: 'Cách lấy dữ liệu',
  insDataSourceText: 'Mở Cài đặt > Digital Wellbeing trên điện thoại Android. Ghi chú thời gian từng ứng dụng và nhập số vào đây.',
  insClearAll: 'Xoá tất cả dữ liệu',

  insDashboardTitle: 'Thống kê sử dụng',
  insDashboardSubtitle: 'Mô hình sử dụng mạng xã hội của bạn.',
  insTotalToday: 'Tổng hôm nay',
  insTotalUsage: (n) => `${n} phút`,
  insPerApp: 'Theo ứng dụng',
  insAppBreakdown: 'Chi tiết ứng dụng',
  insDailyHistory: 'Lịch sử hàng ngày',
  insWeeklySummary: 'Tổng hợp tuần',
  insVsYesterday: 'so với hôm qua',
  insMoreThan: (n) => `+${n} phút so với hôm qua`,
  insLessThan: (n) => `−${n} phút so với hôm qua`,
  insSameAs: 'Giống hôm qua',
  insNoPrevData: 'Không có dữ liệu hôm qua',
  insDailyGoal: 'Mục tiêu hàng ngày',
  insSetGoal: 'Đặt mục tiêu',
  insGoalAbove: (n) => `Vượt mục tiêu ${n} phút`,
  insGoalBelow: (n) => `Dưới mục tiêu ${n} phút`,
  insGoalMet: 'Đạt mục tiêu',
  insNoData: 'Chưa có dữ liệu',
  insNoDataDesc: 'Chưa nhập dữ liệu sử dụng cho ngày này.',
  insEnterData: 'Nhập dữ liệu cho ngày này',
  insNoDataShort: '—',
  insMinShort: 'p',
  insDeleteRecord: 'Xoá',
  insDeleteConfirm: 'Xoá bản ghi này?',

  insReflectionTitle: 'Phản tỉnh',
  insReflectionQ: 'Điều gì ảnh hưởng đến việc dùng mạng xã hội của bạn hôm nay?',
  insReflectionReasons: {
    bored: 'Tôi thấy chán',
    stressed: 'Tôi thấy căng thẳng hoặc muốn tránh bài vở',
    fomo: 'Tôi sợ bỏ lỡ tin nhắn, xu hướng, hoặc thông tin',
    habit: 'Tôi mở ứng dụng do thói quen',
    connect: 'Tôi muốn kết nối với bạn bè',
    other: 'Khác',
  },
  insReflectionText: 'Phản tỉnh thêm (không bắt buộc)',
  insReflectionPlaceholder: 'Bạn còn nhận thấy điều gì khác về việc sử dụng hôm nay?',
  insIntentionQ: 'Một hành động nhỏ bạn muốn thử vào ngày mai là gì?',
  insIntentionPlaceholder: 'vd. Để điện thoại ở phòng khác khi học',
  insSaveReflection: 'Lưu phản tỉnh',
  insReflectionSaved: 'Đã lưu phản tỉnh',
  insSkipReflection: 'Bỏ qua',

  insExportTitle: 'Xuất & Dữ liệu',
  insExportDesc: 'Xuất dữ liệu nghiên cứu ra tệp CSV.',
  insExportCSV: 'Xuất CSV',
  insExportAnon: 'Xuất ẩn danh',
  insExportAnonDesc: 'Không có tên hoặc thông tin nhận dạng cá nhân.',
  insExportFull: 'Xuất đầy đủ',
  insExportFullDesc: 'Bao gồm tất cả trường bạn đã nhập.',
  insExportNoData: 'Chưa có dữ liệu để xuất',
  insSampleData: 'Dữ liệu mẫu',
  insSampleDataDesc: 'Tải dữ liệu mẫu có nhãn rõ để thử nghiệm. Tách biệt với dữ liệu thật của bạn.',
  insLoadSample: 'Tải dữ liệu mẫu',
  insClearSample: 'Xoá dữ liệu mẫu',
  insRealData: 'Dữ liệu của bạn',
  insPrivacyNote: 'Lưu ý quyền riêng tư',
  insPrivacyNoteText: 'Dữ liệu chỉ lưu trong trình duyệt trên thiết bị này. Không đồng bộ giữa các thiết bị và không gửi đi đâu. Xoá dữ liệu trình duyệt sẽ làm mất dữ liệu.',

  mirrorTitle: 'THE LOOP MIRROR',
  mirrorSubtitle: 'Dừng một nhịp để tự hỏi mình.',
  mirrorOpen: 'Dừng một nhịp',
  mirrorQuestion: 'Ngay lúc này, điều gì khiến bạn muốn mở mạng xã hội?',
  mirrorReasons: {
    bored: 'Mình đang chán.',
    stressed: 'Mình đang căng thẳng hoặc né tránh việc học.',
    fomo: 'Mình sợ bỏ lỡ điều gì đó.',
    habit: 'Mình chỉ mở theo thói quen.',
    connect: 'Mình muốn kết nối với bạn bè.',
    other: 'Lý do khác.',
  },
  mirrorReflections: {
    bored: 'Khi thấy chán, mạng xã hội là một cách dễ dàng để lấp khoảng trống. Bạn có thể thử tìm một việc nhỏ khác khiến mình hứng thú — nghe một bài hát, vẽ vài nét, hoặc đứng lên đi quanh phòng.',
    stressed: 'Khi căng thẳng, việc muốn né tránh là phản ứng rất tự nhiên. Một vài phút nghỉ có thể giúp bạn nhẹ hơn. Bạn xứng đáng được nghỉ ngơi mà không cần phải cảm thấy tội lỗi.',
    fomo: 'Cảm giác sợ bỏ lỡ là rất phổ biến. Nhưng hầu hết tin tức và xu hướng vẫn sẽ ở đó khi bạn quay lại. Bạn không cần phải theo dõi mọi thứ ngay lúc này.',
    habit: 'Đôi khi tay mình mở ứng dụng mà không suy nghĩ — đó chỉ là thói quen. Nhận ra điều này đã là một bước rồi. Bạn có thể thử đặt điện thoại xa tay một chút khi học.',
    connect: 'Muốn kết nối với bạn bè là điều tốt và lành mạnh. Nếu đó là mục đích thật sự của bạn, một vài phút nhắn tin có thể là đủ — bạn không cần lướt vô định.',
    other: 'Mỗi người có lý do riêng. Việc bạn dừng lại để nhận biết lý do của mình đã đáng quý rồi. Hãy tự hỏi: việc này có giúp bạn cảm thấy như mình muốn không?',
  },
  mirrorWhatNow: 'Bây giờ, bạn muốn làm gì?',
  mirrorChoices: {
    return: 'Quay lại việc mình đang làm.',
    break: 'Dành vài phút nghỉ ngơi có chủ đích.',
    continue: 'Tiếp tục sử dụng mạng xã hội một cách có ý thức.',
  },
  mirrorEncouragement: {
    return: 'Tuyệt! Bạn đã chọn quay lại việc của mình. Chúc bạn tập trung nhẹ nhàng nhé.',
    break: 'Một khoảng nghỉ nhỏ là một lựa chọn tuyệt vời. Hít thở sâu, duỗi vai, hoặc uống ngụm nước — bạn xứng đáng có phút giây này.',
    continue: 'Không sao cả. Việc bạn dừng lại suy nghĩ đã là dùng mạng xã hội một cách có ý thức rồi. Chúc bạn có những phút giây vui vẻ và tỉnh táo.',
  },
  mirrorBack: 'Quay lại',
  mirrorReturn: 'Về trang chính',
  mirrorClose: 'Đóng',
  mirrorSaved: 'Đã ghi lại phiên phản tỉnh.',
  mirrorPrivacyNote: 'Bản ghi chỉ lưu trong trình duyệt trên thiết bị này, không kèm tên hay thông tin cá nhân.',
  mirrorHistory: 'Lịch sử phản tỉnh',
  mirrorHistoryEmpty: 'Chưa có phiên phản tỉnh nào. Các lần phản tỉnh sẽ hiển thị ở đây.',
  mirrorHistoryReason: 'Lý do',
  mirrorHistoryChoice: 'Lựa chọn',
  mirrorHistoryTime: 'Thời gian',
  mirrorViewHistory: 'Xem lịch sử',
  mirrorNoHistory: 'Chưa có phiên nào được ghi.',
  mirrorClearAll: 'Xoá tất cả dữ liệu phản tỉnh',
  mirrorClearAllConfirm: 'Xoá tất cả bản ghi phản tỉnh? Không thể hoàn tác.',
  mirrorLoadSample: 'Tải dữ liệu mẫu',
  mirrorClearSample: 'Xoá dữ liệu mẫu',
  mirrorDemoBadge: 'MẪU',
  mirrorSessionsToday: 'Phiên phản tỉnh hôm nay',
  mirrorRecentSession: 'Phiên phản tỉnh',
  mirrorChoiceReturn: 'Quay lại việc',
  mirrorChoiceBreak: 'Nghỉ có chủ đích',
  mirrorChoiceContinue: 'Tiếp tục có ý thức',
  mirrorReasonBored: 'Chán',
  mirrorReasonStressed: 'Căng thẳng',
  mirrorReasonFomo: 'Sợ bỏ lỡ',
  mirrorReasonHabit: 'Thói quen',
  mirrorReasonConnect: 'Kết nối',
  mirrorReasonOther: 'Khác',

  dashboardManualNote: 'Thời gian màn hình được nhập thủ công từ Digital Wellbeing trên Android. Ứng dụng này không tự động đọc dữ liệu sử dụng điện thoại.',
  dashboardNoUsageData: 'Chưa nhập dữ liệu sử dụng.',
  dashboardEnterUsage: 'Nhập dữ liệu sử dụng',
  goalSavedOnTrack: 'Đã lưu mục tiêu. Bạn đang đạt mục tiêu!',
  goalSavedOver: 'Đã lưu mục tiêu. Bạn đang vượt giới hạn thời gian màn hình.',
  dataCleared: 'Đã xoá tất cả dữ liệu.',
  sampleLoaded: 'Đã tải dữ liệu mẫu.',
  sampleCleared: 'Đã xoá dữ liệu mẫu.',

  actionResultsTitle: 'Kết quả hành động',
  actionResultsSubtitle: 'Kết quả theo dõi tự báo cáo từ các phiên MIRROR của bạn.',
  actionTotalCheckins: 'Tổng lần theo dõi',
  actionCompleted: 'Hoàn thành',
  actionPartial: 'Hoàn thành một phần',
  actionNotCompleted: 'Chưa hoàn thành',
  actionNoData: 'Chưa có lần theo dõi nào',
  actionNoDataDesc: 'Sau khi hoàn thành phiên MIRROR và chọn hành động, bạn có thể lên lịch theo dõi. Kết quả sẽ hiển thị ở đây.',
  actionHistoryTitle: 'Lịch sử phiên',
  actionHistoryEmpty: 'Chưa có phiên nào được ghi.',
  actionExportCSV: 'Xuất phiên (CSV)',
  actionExportDesc: 'Xuất tất cả phiên MIRROR đã ghi cùng kết quả theo dõi để phân tích nghiên cứu.',
  actionExportNoData: 'Chưa có phiên nào để xuất.',
  followUpPrompt: 'Lên lịch theo dõi hành động?',
  followUpQuestion: (choice) => `Bạn đã chọn "${choice}". Sau một khoảng thời gian ngắn, chúng tôi sẽ hỏi bạn kết quả. Đây là tự báo cáo — ứng dụng không theo dõi điện thoại của bạn.`,
  followUpInterval: 'Thời gian theo dõi',
  followUpIntervalDesc: 'Chọn khi nào để hỏi lại. Chúng tôi sẽ nhắc bạn vào lúc đó.',
  followUpSkip: 'Bỏ qua',
  followUpSet: 'Lên lịch theo dõi',
  followUpSetToast: 'Đã lên lịch theo dõi hành động.',
  followUpSkipped: 'Không lên lịch theo dõi.',
  followUpCheckInTitle: 'Theo dõi hành động',
  followUpCheckInQ: 'Hành động bạn đã chọn diễn ra thế nào?',
  followUpSelfReported: 'Đây là tự báo cáo của bạn. Không có gì được theo dõi tự động.',
  followUpStatusCompleted: 'Hoàn thành',
  followUpStatusPartial: 'Hoàn thành một phần',
  followUpStatusNotCompleted: 'Chưa hoàn thành',
  followUpNoteLabel: 'Ghi chú thêm (không bắt buộc)',
  followUpNotePlaceholder: 'Bạn muốn ghi chú gì về kết quả không?',
  followUpSubmit: 'Gửi theo dõi',
  followUpSubmitted: 'Đã ghi theo dõi. Cảm ơn bạn đã phản tỉnh.',
  followUpBanner: (choice) => `Đến lúc theo dõi: ${choice}`,
  followUpCheckInNow: 'Theo dõi ngay',
  followUpLater: 'Để sau',
  followUpOverdue: 'Đã quá hạn theo dõi',
  followUpPending: 'Đang chờ theo dõi',

  langName: 'Tiếng Việt',
};

export const dictionaries: Record<Lang, Dict> = { en, vi };

export const availableLangs: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'vi', label: 'Tiếng Việt', flag: 'VI' },
];
