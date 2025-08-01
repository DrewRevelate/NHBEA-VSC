# Phase 3: Advanced UX Features

[← Back to Index](./index.md) | [← Previous: Phase 2](./03-phase2-cms-membership.md) | [Next: Validation →](./05-validation-standards.md)

**Priority:** MEDIUM  
**Timeline:** 2-3 weeks  
**Impact:** Enhanced user experience and form usability

## Task 3.1: Form Enhancement Suite

### Character Counter Component

```typescript
// Character counter component
const CharacterCounter = ({ value, maxLength, minLength, className = '' }: {
  value: string;
  maxLength: number;
  minLength?: number;
  className?: string;
}) => {
  const currentLength = value.length;
  const isValid = currentLength >= (minLength || 0) && currentLength <= maxLength;
  const isWarning = currentLength > maxLength * 0.9;
  
  return (
    <div className={`text-sm flex justify-between items-center mt-1 ${className}`}>
      <span className={`${
        !isValid ? 'text-red-500' : 
        isWarning ? 'text-yellow-600' : 
        'text-gray-500'
      }`}>
        {currentLength}/{maxLength}
      </span>
      {minLength && currentLength < minLength && (
        <span className="text-red-500 text-xs">
          Minimum {minLength} characters required
        </span>
      )}
    </div>
  );
};
```

### Auto-Save Hook

```typescript
// Auto-save hook
const useFormAutoSave = (formData: any, formId: string, delay: number = 2000) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!formData || Object.keys(formData).length === 0) return;
    
    setSaveStatus('saving');
    const timeoutId = setTimeout(async () => {
      try {
        const progressPercent = calculateFormProgress(formData);
        const saveData = {
          data: formData,
          timestamp: new Date().toISOString(),
          progress: progressPercent,
          formId
        };
        
        localStorage.setItem(`nhbea-form-${formId}`, JSON.stringify(saveData));
        
        // Also save to Firestore for cross-device access (if user is logged in)
        if (auth.currentUser) {
          await firestore
            .collection('formDrafts')
            .doc(`${auth.currentUser.uid}_${formId}`)
            .set(saveData, { merge: true });
        }
        
        setLastSaved(new Date());
        setProgress(progressPercent);
        setSaveStatus('saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('error');
      }
    }, delay);
    
    return () => clearTimeout(timeoutId);
  }, [formData, formId, delay]);
  
  const restoreFormData = useCallback(async () => {
    try {
      // Try to restore from Firestore first (if logged in)
      if (auth.currentUser) {
        const doc = await firestore
          .collection('formDrafts')
          .doc(`${auth.currentUser.uid}_${formId}`)
          .get();
          
        if (doc.exists) {
          return doc.data();
        }
      }
      
      // Fallback to localStorage
      const saved = localStorage.getItem(`nhbea-form-${formId}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to restore form data:', error);
      return null;
    }
  }, [formId]);
  
  return { lastSaved, saveStatus, progress, restoreFormData };
};
```

### Form Progress Calculator

```typescript
// Form progress calculation utility
const calculateFormProgress = (formData: any): number => {
  const requiredFields = [
    'firstName', 'lastName', 'email', 'phone',
    'address', 'city', 'state', 'zipCode',
    'institution', 'jobTitle'
  ];
  
  const optionalFields = [
    'middleName', 'preferredName', 'bio',
    'linkedIn', 'website', 'interests'
  ];
  
  const requiredFieldsCompleted = requiredFields.filter(field => {
    const value = formData[field];
    return value && value.toString().trim().length > 0;
  }).length;
  
  const optionalFieldsCompleted = optionalFields.filter(field => {
    const value = formData[field];
    return value && value.toString().trim().length > 0;
  }).length;
  
  // Required fields are worth 80%, optional fields 20%
  const requiredProgress = (requiredFieldsCompleted / requiredFields.length) * 80;
  const optionalProgress = (optionalFieldsCompleted / optionalFields.length) * 20;
  
  return Math.round(requiredProgress + optionalProgress);
};
```

### Enhanced Form Field Component

```typescript
// Enhanced form field with auto-save and character counting
const EnhancedFormField = ({ field, register, error, formData, formId }: {
  field: FormFieldConfig;
  register: any;
  error?: FieldError;
  formData?: any;
  formId?: string;
}) => {
  const [value, setValue] = useState('');
  const { saveStatus } = useFormAutoSave(formData, formId || '');
  
  const maxLength = field.validation?.max;
  const minLength = field.validation?.min;
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
        {saveStatus === 'saving' && (
          <span className="ml-2 text-xs text-blue-500">Saving...</span>
        )}
        {saveStatus === 'saved' && (
          <span className="ml-2 text-xs text-green-500">✓ Saved</span>
        )}
      </label>
      
      {field.type === 'textarea' ? (
        <textarea
          {...register(field.name)}
          placeholder={field.placeholder}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nhbea-royal-blue/50"
          rows={4}
        />
      ) : (
        <input
          {...register(field.name)}
          type={field.type}
          placeholder={field.placeholder}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nhbea-royal-blue/50"
        />
      )}
      
      {maxLength && (
        <CharacterCounter 
          value={value} 
          maxLength={maxLength} 
          minLength={minLength}
        />
      )}
      
      {field.helpText && (
        <p className="text-xs text-gray-500">{field.helpText}</p>
      )}
      
      {error && (
        <p className="text-red-600 text-sm">{error.message}</p>
      )}
    </div>
  );
};
```

### Form Progress Indicator

```typescript
// Form progress indicator component
const FormProgressIndicator = ({ progress, currentStep, totalSteps }: {
  progress: number;
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {progress}% Complete
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div 
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < currentStep 
                ? 'bg-green-500' 
                : i === currentStep - 1 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
```

## Task 3.2: Advanced Loading States

### Skeleton Components

```typescript
// Skeleton components for loading states
const SkeletonMembershipForm = () => {
  return (
    <div className="animate-pulse space-y-8">
      <div className="text-center">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
      
      <div className="bg-white rounded-2xl p-8 space-y-6">
        {[...Array(4)].map((_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(3)].map((_, fieldIndex) => (
                <div key={fieldIndex} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="h-14 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

const SkeletonHallOfFame = () => {
  return (
    <div className="animate-pulse">
      <div className="text-center py-16">
        <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SkeletonAwards = () => {
  return (
    <div className="animate-pulse">
      <div className="text-center py-16">
        <div className="h-12 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### Loading State Manager

```typescript
// Loading state manager
const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  
  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  };
  
  const isLoading = (key: string) => loadingStates[key] || false;
  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  
  return { setLoading, isLoading, isAnyLoading };
};
```

### Error Recovery Component

```typescript
// Error recovery component
const ErrorBoundaryWithRecovery = ({ children, fallback }: {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setHasError(false);
    setError(null);
    setRetryCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (hasError && retryCount < 3) {
      const timeoutId = setTimeout(() => {
        retry();
      }, 2000 * Math.pow(2, retryCount)); // Exponential backoff
      
      return () => clearTimeout(timeoutId);
    }
  }, [hasError, retryCount, retry]);

  if (hasError && error) {
    const FallbackComponent = fallback || DefaultErrorFallback;
    return <FallbackComponent error={error} retry={retry} />;
  }

  return (
    <ErrorBoundary
      onError={(error) => {
        setError(error);
        setHasError(true);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

const DefaultErrorFallback = ({ error, retry }: {
  error: Error;
  retry: () => void;
}) => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We encountered an error while loading this content. Please try again.
        </p>
        <button
          onClick={retry}
          className="px-6 py-3 bg-nhbea-royal-blue text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};
```

### Network Status Indicator

```typescript
// Network status awareness
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast' | 'unknown'>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detect connection speed
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const updateConnectionSpeed = () => {
        if (connection.effectiveType === '4g') {
          setConnectionSpeed('fast');
        } else if (connection.effectiveType === '3g' || connection.effectiveType === '2g') {
          setConnectionSpeed('slow');
        } else {
          setConnectionSpeed('unknown');
        }
      };

      updateConnectionSpeed();
      connection.addEventListener('change', updateConnectionSpeed);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', updateConnectionSpeed);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionSpeed };
};

const NetworkStatusBanner = () => {
  const { isOnline, connectionSpeed } = useNetworkStatus();

  if (isOnline && connectionSpeed !== 'slow') return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 text-center py-2 text-sm font-medium ${
      !isOnline 
        ? 'bg-red-500 text-white' 
        : 'bg-yellow-500 text-black'
    }`}>
      {!isOnline 
        ? '📡 You are currently offline. Some features may not be available.'
        : '🐌 Slow connection detected. Loading times may be longer than usual.'
      }
    </div>
  );
};
```

## Phase 3 Validation Checklist

- [ ] Form abandonment rates decrease by 30%
- [ ] Auto-save functionality prevents data loss
- [ ] Character counters appear on all applicable fields
- [ ] Loading states provide smooth user experience
- [ ] Performance metrics meet targets (sub-2s page loads)
- [ ] Error recovery mechanisms function correctly
- [ ] Network status awareness implemented
- [ ] Form progress indicators enhance UX
- [ ] Cross-device form sync works with authentication

---

**Next:** [Validation & Standards →](./05-validation-standards.md)