import type { Language } from '../types';

export interface T {
  appName: string;
  tagline: string;
  dataLocal: string;
  chooseLanguage: string;
  pwaUpdate: string;
  pwaUpdateBtn: string;

  nav: { home: string; log: string; history: string; profile: string };

  auth: {
    login: string;
    register: string;
    username: string;
    usernamePlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    monthlySalary: string;
    currency: string;
    createAccount: string;
    errInvalid: string;
    errTaken: string;
    errUsernameShort: string;
    errPasswordShort: string;
    errMismatch: string;
  };

  dayNames: [string, string, string, string, string, string, string];

  dash: {
    welcomeBack: string;
    totalEarnings: string;
    tips: string;
    bonus: string;
    salary: string;
    worked: string;
    daysOff: string;
    bestDay: string;
    streak: string;
    monthOverview: string;
    recentDays: string;
    seeAll: string;
    noEntries: string;
    logFirstDay: string;
    today: string;
    dayOff: string;
    monthlyBonus: string;
    addBonus: string;
    bonusNotes: string;
    saveBonus: string;
    editBonus: string;
    bonusHint: string;
    add: string;
    tipsTrend: string;
    avg: string;
    perDay: string;
    workedNoTips: string;
    dayLabel: string;
  };

  log: {
    title: string;
    subtitle: string;
    dateLabel: string;
    statusLabel: string;
    worked: string;
    dayOff: string;
    tipsLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    summaryTitle: string;
    total: string;
    save: string;
    delete: string;
    savedMsg: string;
    deletedMsg: string;
    newBest: string;
  };

  history: {
    title: string;
    subtitle: string;
    summary: string;
    totalTips: string;
    totalBonus: string;
    daysWorked: string;
    bestDayTips: string;
    bestDayLabel: string;
    noEntries: string;
    startLogging: string;
  };

  profile: {
    title: string;
    subtitle: string;
    worker: string;
    allTimeStats: string;
    avgTips: string;
    totalTips: string;
    totalBonus: string;
    daysWorked: string;
    salaryLabel: string;
    currencyLabel: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    cancel: string;
    save: string;
    update: string;
    wrongPassword: string;
    passwordUpdated: string;
    accountLabel: string;
    memberSince: string;
    logout: string;
    guideBtn: string;
    languageLabel: string;
  };

  guide: {
    title: string;
    subtitle: string;
    back: string;
    steps: Array<{ icon: string; title: string; text: string }>;
    floor: {
      teamTitle: string;
      tapHint: string;
      inside: string;
      outside: string;
      altShifts: string;
      altDays: string;
      always: string;
      owner: string;
    };
  };
}

export const translations: Record<Language, T> = {
  en: {
    appName: 'TipTracker',
    tagline: 'Track every dirham you earn',
    dataLocal: 'Data stored locally on your device',
    chooseLanguage: 'Choose language',
    pwaUpdate: 'New version available',
    pwaUpdateBtn: 'Update',

    nav: { home: 'Home', log: 'Log Day', history: 'History', profile: 'Profile' },

    auth: {
      login: 'Login',
      register: 'Register',
      username: 'Username',
      usernamePlaceholder: 'Your username',
      password: 'Password',
      passwordPlaceholder: 'Min. 4 characters',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Repeat password',
      monthlySalary: 'Monthly Salary',
      currency: 'Currency',
      createAccount: 'Create Account',
      errInvalid: 'Invalid username or password',
      errTaken: 'Username already taken',
      errUsernameShort: 'Username must be at least 2 characters',
      errPasswordShort: 'Password must be at least 4 characters',
      errMismatch: 'Passwords do not match',
    },

    dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],

    dash: {
      welcomeBack: 'Welcome back,',
      totalEarnings: 'Total Earnings',
      tips: 'Tips',
      bonus: 'Bonus',
      salary: 'Salary',
      worked: 'Worked',
      daysOff: 'Days Off',
      bestDay: 'Best Day',
      streak: 'Day Streak',
      monthOverview: 'Month Overview',
      recentDays: 'Recent Days',
      seeAll: 'See all →',
      noEntries: 'No entries yet for this month',
      logFirstDay: 'Log Your First Day',
      today: 'Today',
      dayOff: 'Day Off',
      monthlyBonus: 'Monthly Bonus',
      addBonus: 'No bonus added yet — tap to add',
      bonusNotes: 'Note (optional)',
      saveBonus: 'Save Bonus',
      editBonus: 'Edit',
      bonusHint: 'Bonus given at end of month by management',
      add: 'Add',
      tipsTrend: 'Tips trend',
      avg: 'avg',
      perDay: '/day',
      workedNoTips: 'Worked · no tips',
      dayLabel: 'Day',
    },

    log: {
      title: 'Log Day',
      subtitle: 'Record your tips and notes',
      dateLabel: 'DATE',
      statusLabel: 'STATUS',
      worked: 'Worked',
      dayOff: 'Day Off',
      tipsLabel: 'TIPS COLLECTED',
      notesLabel: 'NOTES (OPTIONAL)',
      notesPlaceholder: 'How was the day? Anything to remember…',
      summaryTitle: "TODAY'S SUMMARY",
      total: 'Total',
      save: 'Save Day',
      delete: 'Delete',
      savedMsg: '✓ Day saved successfully!',
      deletedMsg: 'Entry deleted.',
      newBest: '🏆 New best day!',
    },

    history: {
      title: 'History',
      subtitle: 'All your logged days',
      summary: 'Month Summary',
      totalTips: 'Total Tips',
      totalBonus: 'Monthly Bonus',
      daysWorked: 'Days Worked',
      bestDayTips: 'Best Day',
      bestDayLabel: 'Best day:',
      noEntries: 'No entries for this month',
      startLogging: 'Start logging →',
    },

    profile: {
      title: 'Profile',
      subtitle: 'Your account & settings',
      worker: 'Restaurant Worker',
      allTimeStats: 'All-Time Stats',
      avgTips: 'Avg Tips / Day',
      totalTips: 'Total Tips',
      totalBonus: 'Total Bonus',
      daysWorked: 'Days Worked',
      salaryLabel: 'Monthly Salary',
      currencyLabel: 'Currency',
      changePassword: 'Change Password',
      currentPassword: 'Current password',
      newPassword: 'New password (min. 4 chars)',
      cancel: 'Cancel',
      save: 'Save',
      update: 'Update',
      wrongPassword: 'Current password is incorrect',
      passwordUpdated: 'Password updated!',
      accountLabel: 'Account',
      memberSince: 'Member since',
      logout: 'Log Out',
      guideBtn: 'User Guide',
      languageLabel: 'Language',
    },

    guide: {
      title: 'User Guide',
      subtitle: 'How to use TipTracker',
      back: 'Back',
      floor: {
        teamTitle: 'Restaurant Team',
        tapHint: 'Tap any character · live floor view',
        inside: 'Inside',
        outside: 'Outside — Servers',
        altShifts: 'alt. = alternating shifts',
        altDays: 'alt. days',
        always: 'always',
        owner: 'owner',
      },
      steps: [
        {
          icon: '👋',
          title: 'Getting Started',
          text: 'Create your account with a username, password, and your monthly salary. Each person on the team creates their own account on their own phone. Your data stays private on your device.',
        },
        {
          icon: '💰',
          title: 'Log Your Daily Tips',
          text: 'After each shift, tap "Log Day". Select the date (today by default), tap "Worked", enter the tips you received, add an optional note, then tap "Save Day". On rest days, select "Day Off" instead.',
        },
        {
          icon: '🎁',
          title: 'Monthly Bonus',
          text: 'At the end of the month, your manager may give a bonus for good performance. Open the Dashboard, find the "Monthly Bonus" section, tap "Add" and enter the amount. This is separate from your daily tips.',
        },
        {
          icon: '📊',
          title: 'Reading the Dashboard',
          text: 'The Dashboard shows your total earnings for the month (tips + bonus + salary). The calendar shows every day: gold = tips earned, green = worked without tips, red = day off. Tap any day to edit it.',
        },
        {
          icon: '📅',
          title: 'History & Past Months',
          text: 'The History page lists all logged days month by month. Use the arrows to go back to previous months. Each month shows a summary: total tips, bonus, days worked, and your best day.',
        },
      ],
    },
  },

  fr: {
    appName: 'TipTracker',
    tagline: 'Suivez chaque dirham gagné',
    dataLocal: 'Données stockées localement sur votre téléphone',
    chooseLanguage: 'Choisir la langue',
    pwaUpdate: 'Nouvelle version disponible',
    pwaUpdateBtn: 'Mettre à jour',

    nav: { home: 'Accueil', log: 'Saisir', history: 'Historique', profile: 'Profil' },

    auth: {
      login: 'Connexion',
      register: "S'inscrire",
      username: "Nom d'utilisateur",
      usernamePlaceholder: 'Votre pseudo',
      password: 'Mot de passe',
      passwordPlaceholder: 'Min. 4 caractères',
      confirmPassword: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Répéter le mot de passe',
      monthlySalary: 'Salaire mensuel',
      currency: 'Devise',
      createAccount: 'Créer un compte',
      errInvalid: 'Identifiant ou mot de passe incorrect',
      errTaken: "Ce nom d'utilisateur est déjà pris",
      errUsernameShort: "Le nom d'utilisateur doit avoir au moins 2 caractères",
      errPasswordShort: 'Le mot de passe doit avoir au moins 4 caractères',
      errMismatch: 'Les mots de passe ne correspondent pas',
    },

    dayNames: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],

    dash: {
      welcomeBack: 'Bon retour,',
      totalEarnings: 'Gains totaux',
      tips: 'Pourboires',
      bonus: 'Prime',
      salary: 'Salaire',
      worked: 'Travaillés',
      daysOff: 'Congés',
      bestDay: 'Meilleur jour',
      streak: 'Jours consécutifs',
      monthOverview: 'Aperçu du mois',
      recentDays: 'Derniers jours',
      seeAll: 'Voir tout →',
      noEntries: 'Aucune entrée ce mois-ci',
      logFirstDay: 'Saisir le premier jour',
      today: "Aujourd'hui",
      dayOff: 'Congé',
      monthlyBonus: 'Prime mensuelle',
      addBonus: 'Aucune prime — appuyer pour ajouter',
      bonusNotes: 'Note (facultatif)',
      saveBonus: 'Enregistrer la prime',
      editBonus: 'Modifier',
      bonusHint: 'Prime accordée en fin de mois par la direction',
      add: 'Ajouter',
      tipsTrend: 'Évolution des pourboires',
      avg: 'moy.',
      perDay: '/jour',
      workedNoTips: 'Travaillé · sans pourboire',
      dayLabel: 'Jour',
    },

    log: {
      title: 'Saisir un jour',
      subtitle: 'Enregistrez vos pourboires et notes',
      dateLabel: 'DATE',
      statusLabel: 'STATUT',
      worked: 'Travaillé',
      dayOff: 'Congé',
      tipsLabel: 'POURBOIRES COLLECTÉS',
      notesLabel: 'NOTES (FACULTATIF)',
      notesPlaceholder: 'Comment était la journée ? Des remarques ?',
      summaryTitle: 'RÉSUMÉ DU JOUR',
      total: 'Total',
      save: 'Enregistrer',
      delete: 'Supprimer',
      savedMsg: '✓ Jour enregistré avec succès !',
      deletedMsg: 'Entrée supprimée.',
      newBest: '🏆 Nouveau record !',
    },

    history: {
      title: 'Historique',
      subtitle: 'Tous vos jours enregistrés',
      summary: 'Résumé du mois',
      totalTips: 'Total pourboires',
      totalBonus: 'Prime mensuelle',
      daysWorked: 'Jours travaillés',
      bestDayTips: 'Meilleur jour',
      bestDayLabel: 'Meilleur jour :',
      noEntries: 'Aucune entrée ce mois-ci',
      startLogging: 'Commencer →',
    },

    profile: {
      title: 'Profil',
      subtitle: 'Votre compte et paramètres',
      worker: 'Employé de restaurant',
      allTimeStats: 'Statistiques globales',
      avgTips: 'Moy. pourboires / jour',
      totalTips: 'Total pourboires',
      totalBonus: 'Total primes',
      daysWorked: 'Jours travaillés',
      salaryLabel: 'Salaire mensuel',
      currencyLabel: 'Devise',
      changePassword: 'Changer le mot de passe',
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe (min. 4 car.)',
      cancel: 'Annuler',
      save: 'Enregistrer',
      update: 'Mettre à jour',
      wrongPassword: 'Mot de passe actuel incorrect',
      passwordUpdated: 'Mot de passe mis à jour !',
      accountLabel: 'Compte',
      memberSince: 'Membre depuis',
      logout: 'Se déconnecter',
      guideBtn: 'Guide utilisateur',
      languageLabel: 'Langue',
    },

    guide: {
      title: 'Guide utilisateur',
      subtitle: 'Comment utiliser TipTracker',
      back: 'Retour',
      floor: {
        teamTitle: 'Équipe du restaurant',
        tapHint: 'Touchez un personnage · vue en direct',
        inside: 'Intérieur',
        outside: 'Extérieur — Serveurs',
        altShifts: 'alt. = jours alternés',
        altDays: 'j. alternés',
        always: 'toujours',
        owner: 'patron',
      },
      steps: [
        {
          icon: '👋',
          title: 'Démarrage',
          text: "Créez votre compte avec un pseudo, un mot de passe et votre salaire mensuel. Chaque membre de l'équipe crée son propre compte sur son téléphone. Vos données restent privées sur votre appareil.",
        },
        {
          icon: '💰',
          title: 'Saisir les pourboires quotidiens',
          text: 'Après chaque service, appuyez sur "Saisir". Sélectionnez la date (aujourd\'hui par défaut), appuyez sur "Travaillé", entrez les pourboires reçus, ajoutez une note facultative, puis appuyez sur "Enregistrer". Les jours de repos, sélectionnez "Congé".',
        },
        {
          icon: '🎁',
          title: 'Prime mensuelle',
          text: 'En fin de mois, votre responsable peut accorder une prime pour bonne performance. Ouvrez l\'Accueil, trouvez la section "Prime mensuelle", appuyez sur "Ajouter" et saisissez le montant. Elle est séparée de vos pourboires quotidiens.',
        },
        {
          icon: '📊',
          title: 'Lire le tableau de bord',
          text: 'L\'Accueil affiche vos gains totaux du mois (pourboires + prime + salaire). Le calendrier montre chaque jour : or = pourboires gagnés, vert = travaillé sans pourboires, rouge = congé. Appuyez sur un jour pour le modifier.',
        },
        {
          icon: '📅',
          title: 'Historique et mois précédents',
          text: "L'Historique liste tous les jours enregistrés mois par mois. Utilisez les flèches pour revenir aux mois précédents. Chaque mois affiche un résumé : total des pourboires, prime, jours travaillés et votre meilleur jour.",
        },
      ],
    },
  },

  ar: {
    appName: 'تتبع البقشيش',
    tagline: 'تابع كل درهم تكسبه',
    dataLocal: 'البيانات محفوظة محلياً على هاتفك',
    chooseLanguage: 'اختر اللغة',
    pwaUpdate: 'إصدار جديد متاح',
    pwaUpdateBtn: 'تحديث',

    nav: { home: 'الرئيسية', log: 'تسجيل', history: 'السجل', profile: 'الملف' },

    auth: {
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      username: 'اسم المستخدم',
      usernamePlaceholder: 'اسمك',
      password: 'كلمة المرور',
      passwordPlaceholder: '٤ أحرف على الأقل',
      confirmPassword: 'تأكيد كلمة المرور',
      confirmPasswordPlaceholder: 'أعد كتابة كلمة المرور',
      monthlySalary: 'الراتب الشهري',
      currency: 'العملة',
      createAccount: 'إنشاء الحساب',
      errInvalid: 'اسم المستخدم أو كلمة المرور غير صحيحة',
      errTaken: 'اسم المستخدم مأخوذ مسبقاً',
      errUsernameShort: 'يجب أن يكون الاسم حرفين على الأقل',
      errPasswordShort: 'يجب أن تكون كلمة المرور ٤ أحرف على الأقل',
      errMismatch: 'كلمتا المرور غير متطابقتين',
    },

    dayNames: ['أح', 'اث', 'ثل', 'أر', 'خم', 'جم', 'سب'],

    dash: {
      welcomeBack: 'أهلاً،',
      totalEarnings: 'إجمالي الأرباح',
      tips: 'البقشيش',
      bonus: 'المكافأة',
      salary: 'الراتب',
      worked: 'أيام العمل',
      daysOff: 'أيام الراحة',
      bestDay: 'أفضل يوم',
      streak: 'أيام متتالية',
      monthOverview: 'نظرة على الشهر',
      recentDays: 'الأيام الأخيرة',
      seeAll: '← عرض الكل',
      noEntries: 'لا توجد إدخالات هذا الشهر',
      logFirstDay: 'سجّل أول يوم',
      today: 'اليوم',
      dayOff: 'يوم راحة',
      monthlyBonus: 'المكافأة الشهرية',
      addBonus: 'لا توجد مكافأة — اضغط للإضافة',
      bonusNotes: 'ملاحظة (اختياري)',
      saveBonus: 'حفظ المكافأة',
      editBonus: 'تعديل',
      bonusHint: 'مكافأة تُمنح في نهاية الشهر من الإدارة',
      add: 'إضافة',
      tipsTrend: 'تطور البقشيش',
      avg: 'متوسط',
      perDay: '/ يوم',
      workedNoTips: 'عمل · بدون بقشيش',
      dayLabel: 'يوم',
    },

    log: {
      title: 'تسجيل يوم',
      subtitle: 'سجّل البقشيش والملاحظات',
      dateLabel: 'التاريخ',
      statusLabel: 'الحالة',
      worked: 'عملت',
      dayOff: 'يوم راحة',
      tipsLabel: 'البقشيش المجموع',
      notesLabel: 'ملاحظات (اختياري)',
      notesPlaceholder: 'كيف كان اليوم؟ أي شيء تريد تذكره؟',
      summaryTitle: 'ملخص اليوم',
      total: 'المجموع',
      save: 'حفظ اليوم',
      delete: 'حذف',
      savedMsg: '✓ تم حفظ اليوم بنجاح!',
      deletedMsg: 'تم حذف الإدخال.',
      newBest: '🏆 أفضل يوم على الإطلاق!',
    },

    history: {
      title: 'السجل',
      subtitle: 'جميع أيامك المسجلة',
      summary: 'ملخص الشهر',
      totalTips: 'إجمالي البقشيش',
      totalBonus: 'المكافأة الشهرية',
      daysWorked: 'أيام العمل',
      bestDayTips: 'أفضل يوم',
      bestDayLabel: 'أفضل يوم:',
      noEntries: 'لا توجد إدخالات هذا الشهر',
      startLogging: '← ابدأ التسجيل',
    },

    profile: {
      title: 'الملف الشخصي',
      subtitle: 'حسابك وإعداداتك',
      worker: 'عامل مطعم',
      allTimeStats: 'الإحصائيات الكلية',
      avgTips: 'متوسط البقشيش / يوم',
      totalTips: 'إجمالي البقشيش',
      totalBonus: 'إجمالي المكافآت',
      daysWorked: 'أيام العمل',
      salaryLabel: 'الراتب الشهري',
      currencyLabel: 'العملة',
      changePassword: 'تغيير كلمة المرور',
      currentPassword: 'كلمة المرور الحالية',
      newPassword: 'كلمة المرور الجديدة (٤ أحرف على الأقل)',
      cancel: 'إلغاء',
      save: 'حفظ',
      update: 'تحديث',
      wrongPassword: 'كلمة المرور الحالية غير صحيحة',
      passwordUpdated: 'تم تحديث كلمة المرور!',
      accountLabel: 'الحساب',
      memberSince: 'عضو منذ',
      logout: 'تسجيل الخروج',
      guideBtn: 'دليل الاستخدام',
      languageLabel: 'اللغة',
    },

    guide: {
      title: 'دليل الاستخدام',
      subtitle: 'كيفية استخدام تتبع البقشيش',
      back: 'رجوع',
      floor: {
        teamTitle: 'فريق المطعم',
        tapHint: 'اضغط على أي شخصية · عرض مباشر',
        inside: 'داخل',
        outside: 'خارج — النادلون',
        altShifts: 'أيام بالتناوب',
        altDays: 'متناوب',
        always: 'دائماً',
        owner: 'صاحب',
      },
      steps: [
        {
          icon: '👋',
          title: 'البدء',
          text: 'أنشئ حسابك باسم مستخدم وكلمة مرور وراتبك الشهري. كل عضو في الفريق يُنشئ حسابه الخاص على هاتفه. بياناتك خاصة ومحفوظة على جهازك فقط.',
        },
        {
          icon: '💰',
          title: 'تسجيل البقشيش اليومي',
          text: 'بعد كل وردية، اضغط على "تسجيل". اختر التاريخ (اليوم افتراضياً)، اضغط "عملت"، أدخل مبلغ البقشيش الذي جمعته، أضف ملاحظة اختيارية، ثم اضغط "حفظ اليوم". في أيام الراحة، اختر "يوم راحة".',
        },
        {
          icon: '🎁',
          title: 'المكافأة الشهرية',
          text: 'في نهاية الشهر، قد يمنحك المدير مكافأة على الأداء الجيد. افتح الرئيسية، ابحث عن قسم "المكافأة الشهرية"، اضغط "إضافة" وأدخل المبلغ. هذا منفصل عن البقشيش اليومي.',
        },
        {
          icon: '📊',
          title: 'قراءة لوحة التحكم',
          text: 'الرئيسية تُظهر إجمالي أرباحك للشهر (بقشيش + مكافأة + راتب). التقويم يُظهر كل يوم: ذهبي = بقشيش، أخضر = عملت بدون بقشيش، أحمر = يوم راحة. اضغط على أي يوم لتعديله.',
        },
        {
          icon: '📅',
          title: 'السجل والأشهر الماضية',
          text: 'صفحة السجل تعرض جميع الأيام المسجلة شهراً بشهر. استخدم الأسهم للرجوع إلى الأشهر الماضية. كل شهر يُظهر ملخصاً: إجمالي البقشيش، المكافأة، أيام العمل، وأفضل يوم.',
        },
      ],
    },
  },
};
