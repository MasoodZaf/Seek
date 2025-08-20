import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
      
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        tutorials: 'Tutorials',
        playground: 'Code Playground',
        practice: 'Practice',
        achievements: 'Achievements',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout'
      },
      
      // Authentication
      auth: {
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        forgotPassword: 'Forgot Password?',
        loginSuccess: 'Login successful!',
        logoutSuccess: 'Logged out successfully!',
        registerSuccess: 'Registration successful!',
        loginRequired: 'Please login to continue',
        invalidCredentials: 'Invalid email or password'
      },
      
      // Playground
      playground: {
        title: 'Code Playground',
        subtitle: 'Experiment, learn, and build amazing things',
        editor: 'Editor',
        output: 'Output',
        runCode: 'Run Code',
        running: 'Running...',
        loginRequired: 'Login Required',
        reset: 'Reset',
        settings: 'Settings',
        recentRuns: 'Recent Runs',
        defaultLanguage: 'Default Language',
        fontSize: 'Font Size',
        tabSize: 'Tab Size',
        autoSave: 'Auto-save code changes',
        wordWrap: 'Enable word wrap',
        minimap: 'Show minimap',
        codeExecutedSuccessfully: 'Code executed successfully (no output)',
        executedLocally: 'Note: Executed locally in browser (server execution unavailable)',
        writeCodeFirst: 'Please write some code first!',
        executionFailed: 'Execution failed',
        codeCopied: 'Code copied to clipboard',
        failedToCopy: 'Failed to copy code',
        codeReset: 'Code reset to template',
        sharingComingSoon: 'Sharing feature coming soon!',
        saveComingSoon: 'Save feature coming soon!'
      },
      
      // Settings
      settings: {
        title: 'Settings',
        subtitle: 'Customize your coding experience',
        saveChanges: 'Save Changes',
        settingsSaved: 'Settings saved successfully!',
        errorSaving: 'Error saving settings',
        
        // Tabs
        general: 'General',
        appearance: 'Appearance',
        notifications: 'Notifications',
        security: 'Security',
        account: 'Account',
        language: 'Language',
        
        // General Settings
        editorPreferences: 'Editor Preferences',
        interfaceLanguage: 'Interface Language',
        defaultLanguage: 'Default Language',
        
        // Appearance
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
        
        // Notifications
        notificationPreferences: 'Notification Preferences',
        emailNotifications: 'Email Notifications',
        emailNotificationsDesc: 'Receive updates via email',
        pushNotifications: 'Push Notifications',
        pushNotificationsDesc: 'Browser push notifications',
        achievementNotifications: 'Achievement Notifications',
        achievementNotificationsDesc: 'Get notified when you earn achievements',
        weeklyProgress: 'Weekly Progress Report',
        weeklyProgressDesc: 'Weekly summary of your coding activity',
        
        // Security
        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm New Password',
        passwordChanged: 'Password changed successfully!',
        passwordsDoNotMatch: 'New passwords do not match',
        passwordTooShort: 'New password must be at least 8 characters long',
        sessionSettings: 'Session Settings',
        sessionTimeout: 'Session Timeout (minutes)',
        never: 'Never',
        minutes: 'minutes',
        hour: 'hour',
        hours: 'hours',
        
        // Account
        privacySettings: 'Privacy Settings',
        profileVisibility: 'Profile Visibility',
        public: 'Public',
        friendsOnly: 'Friends Only',
        private: 'Private',
        showProgressPublicly: 'Show Progress Publicly',
        showAchievementsPublicly: 'Show Achievements Publicly',
        dangerZone: 'Danger Zone',
        deleteAccount: 'Delete Account',
        deleteAccountWarning: 'This action is irreversible. All your data, including progress, code history, and achievements will be permanently deleted.',
        deleteAccountConfirm: 'Are you absolutely sure? This action cannot be undone.',
        yesDeleteAccount: 'Yes, Delete My Account',
        accountDeleted: 'Account deleted successfully'
      },
      
      // Tutorials
      tutorials: {
        title: 'Tutorials',
        subtitle: 'Learn programming step by step',
        searchPlaceholder: 'Search tutorials...',
        allLanguages: 'All Languages',
        allDifficulties: 'All Difficulties',
        allCategories: 'All Categories',
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        fundamentals: 'Fundamentals',
        webDevelopment: 'Web Development',
        dataStructures: 'Data Structures',
        algorithms: 'Algorithms',
        frameworks: 'Frameworks',
        progress: 'Progress',
        duration: 'Duration',
        students: 'Students',
        rating: 'Rating',
        startTutorial: 'Start Tutorial',
        continueTutorial: 'Continue Tutorial'
      },
      
      // Dashboard
      dashboard: {
        title: 'Welcome back',
        subtitle: 'Continue your coding journey',
        quickStart: 'Quick Start',
        recentActivity: 'Recent Activity',
        progressOverview: 'Progress Overview',
        achievements: 'Recent Achievements',
        practiceProblems: 'Practice Problems',
        codingStreak: 'Coding Streak',
        totalHours: 'Total Hours',
        completedTutorials: 'Completed Tutorials',
        solvedProblems: 'Solved Problems'
      },
      
      // Languages
      languages: {
        en: 'English',
        es: 'Español',
        fr: 'Français',
        de: 'Deutsch',
        zh: '中文',
        ja: '日本語',
        ar: 'العربية',
        ru: 'Русский',
        pt: 'Português',
        it: 'Italiano'
      }
    }
  },
  es: {
    translation: {
      // Common
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar',
      yes: 'Sí',
      no: 'No',
      
      // Navigation
      nav: {
        dashboard: 'Panel',
        tutorials: 'Tutoriales',
        playground: 'Área de Código',
        practice: 'Práctica',
        achievements: 'Logros',
        profile: 'Perfil',
        settings: 'Configuración',
        logout: 'Cerrar Sesión'
      },
      
      // Authentication
      auth: {
        login: 'Iniciar Sesión',
        register: 'Registrarse',
        logout: 'Cerrar Sesión',
        email: 'Correo Electrónico',
        password: 'Contraseña',
        confirmPassword: 'Confirmar Contraseña',
        firstName: 'Nombre',
        lastName: 'Apellido',
        forgotPassword: '¿Olvidaste tu contraseña?',
        loginSuccess: '¡Inicio de sesión exitoso!',
        logoutSuccess: '¡Sesión cerrada exitosamente!',
        registerSuccess: '¡Registro exitoso!',
        loginRequired: 'Por favor inicia sesión para continuar',
        invalidCredentials: 'Email o contraseña inválidos'
      },
      
      // Playground
      playground: {
        title: 'Área de Código',
        subtitle: 'Experimenta, aprende y construye cosas increíbles',
        editor: 'Editor',
        output: 'Salida',
        runCode: 'Ejecutar Código',
        running: 'Ejecutando...',
        loginRequired: 'Inicio de Sesión Requerido',
        reset: 'Reiniciar',
        settings: 'Configuración',
        recentRuns: 'Ejecuciones Recientes',
        defaultLanguage: 'Lenguaje Predeterminado',
        fontSize: 'Tamaño de Fuente',
        tabSize: 'Tamaño de Tabulación',
        autoSave: 'Guardar cambios automáticamente',
        wordWrap: 'Habilitar ajuste de texto',
        minimap: 'Mostrar minimapa',
        codeExecutedSuccessfully: 'Código ejecutado exitosamente (sin salida)',
        executedLocally: 'Nota: Ejecutado localmente en el navegador (ejecución del servidor no disponible)',
        writeCodeFirst: '¡Por favor escribe algo de código primero!',
        executionFailed: 'Ejecución fallida',
        codeCopied: 'Código copiado al portapapeles',
        failedToCopy: 'Error al copiar código',
        codeReset: 'Código reiniciado a plantilla',
        sharingComingSoon: '¡Función de compartir próximamente!',
        saveComingSoon: '¡Función de guardar próximamente!'
      },
      
      // Settings
      settings: {
        title: 'Configuración',
        subtitle: 'Personaliza tu experiencia de codificación',
        saveChanges: 'Guardar Cambios',
        settingsSaved: '¡Configuración guardada exitosamente!',
        errorSaving: 'Error al guardar configuración',
        
        // Tabs
        general: 'General',
        appearance: 'Apariencia',
        notifications: 'Notificaciones',
        security: 'Seguridad',
        account: 'Cuenta',
        language: 'Idioma',
        
        // General Settings
        editorPreferences: 'Preferencias del Editor',
        interfaceLanguage: 'Idioma de la Interfaz',
        
        // Appearance
        theme: 'Tema',
        light: 'Claro',
        dark: 'Oscuro',
        system: 'Sistema',
        
        // Notifications
        notificationPreferences: 'Preferencias de Notificaciones',
        emailNotifications: 'Notificaciones por Email',
        emailNotificationsDesc: 'Recibir actualizaciones por correo electrónico',
        pushNotifications: 'Notificaciones Push',
        pushNotificationsDesc: 'Notificaciones push del navegador',
        achievementNotifications: 'Notificaciones de Logros',
        achievementNotificationsDesc: 'Recibir notificaciones cuando obtengas logros',
        weeklyProgress: 'Reporte de Progreso Semanal',
        weeklyProgressDesc: 'Resumen semanal de tu actividad de codificación',
        
        // Security
        changePassword: 'Cambiar Contraseña',
        currentPassword: 'Contraseña Actual',
        newPassword: 'Nueva Contraseña',
        confirmNewPassword: 'Confirmar Nueva Contraseña',
        passwordChanged: '¡Contraseña cambiada exitosamente!',
        passwordsDoNotMatch: 'Las nuevas contraseñas no coinciden',
        passwordTooShort: 'La nueva contraseña debe tener al menos 8 caracteres',
        sessionSettings: 'Configuración de Sesión',
        sessionTimeout: 'Tiempo de Espera de Sesión (minutos)',
        never: 'Nunca',
        minutes: 'minutos',
        hour: 'hora',
        hours: 'horas',
        
        // Account
        privacySettings: 'Configuración de Privacidad',
        profileVisibility: 'Visibilidad del Perfil',
        public: 'Público',
        friendsOnly: 'Solo Amigos',
        private: 'Privado',
        showProgressPublicly: 'Mostrar Progreso Públicamente',
        showAchievementsPublicly: 'Mostrar Logros Públicamente',
        dangerZone: 'Zona de Peligro',
        deleteAccount: 'Eliminar Cuenta',
        deleteAccountWarning: 'Esta acción es irreversible. Todos tus datos, incluyendo progreso, historial de código y logros serán eliminados permanentemente.',
        deleteAccountConfirm: '¿Estás absolutamente seguro? Esta acción no se puede deshacer.',
        yesDeleteAccount: 'Sí, Eliminar Mi Cuenta',
        accountDeleted: 'Cuenta eliminada exitosamente'
      },
      
      // Languages
      languages: {
        en: 'English',
        es: 'Español',
        fr: 'Français',
        de: 'Deutsch',
        zh: '中文',
        ja: '日本語',
        ar: 'العربية',
        ru: 'Русский',
        pt: 'Português',
        it: 'Italiano'
      }
    }
  },
  fr: {
    translation: {
      // Common
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      close: 'Fermer',
      yes: 'Oui',
      no: 'Non',
      
      // Navigation
      nav: {
        dashboard: 'Tableau de bord',
        tutorials: 'Tutoriels',
        playground: 'Terrain de jeu',
        practice: 'Pratique',
        achievements: 'Réalisations',
        profile: 'Profil',
        settings: 'Paramètres',
        logout: 'Se déconnecter'
      },
      
      // Playground
      playground: {
        title: 'Terrain de jeu de code',
        subtitle: 'Expérimentez, apprenez et construisez des choses incroyables',
        editor: 'Éditeur',
        output: 'Sortie',
        runCode: 'Exécuter le code',
        running: 'En cours...',
        loginRequired: 'Connexion requise',
        reset: 'Réinitialiser',
        settings: 'Paramètres',
        recentRuns: 'Exécutions récentes'
      },
      
      // Settings
      settings: {
        title: 'Paramètres',
        subtitle: 'Personnalisez votre expérience de codage',
        language: 'Langue',
        interfaceLanguage: 'Langue de l\'interface'
      },
      
      // Languages
      languages: {
        en: 'English',
        es: 'Español',
        fr: 'Français',
        de: 'Deutsch',
        zh: '中文',
        ja: '日本語',
        ar: 'العربية',
        ru: 'Русский',
        pt: 'Português',
        it: 'Italiano'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;