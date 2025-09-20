/**
 * Service Worker Registration for Catholic Missal
 * Handles PWA functionality and offline support
 */

export interface ServiceWorkerUpdateInfo {
  isUpdateAvailable: boolean;
  updateServiceWorker: () => Promise<boolean>;
}

/**
 * Register the service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerUpdateInfo | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service workers are not supported');
    return null;
  }

  try {
    console.log('Registering service worker...');

    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service worker registered successfully:', registration);

    // Initialize cache cleanup
    const { initializeCacheCleanup } = await import('@/lib/cache');
    initializeCacheCleanup();

    // Handle updates
    let updateAvailable = false;
    let newWorker: ServiceWorker | null = null;

    // Check for updates
    const checkForUpdates = () => {
      if (registration.waiting) {
        updateAvailable = true;
        newWorker = registration.waiting;
        console.log('Service worker update available');

        // Notify user of update
        showUpdateNotification();
      }
    };

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.addEventListener('statechange', () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // Update available
            updateAvailable = true;
            newWorker = installingWorker;
            console.log('New service worker installed, update available');
            showUpdateNotification();
          } else {
            // First install
            console.log('Service worker installed for the first time');
            showInstallNotification();
          }
        }
      });
    });

    // Check for waiting service worker
    checkForUpdates();

    // Listen for controlled updates
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('New service worker took control');
      window.location.reload();
    });

    // Return update interface
    return {
      isUpdateAvailable: updateAvailable,
      updateServiceWorker: async (): Promise<boolean> => {
        if (!newWorker) {
          console.log('No update available');
          return false;
        }

        // Tell the waiting service worker to activate
        newWorker.postMessage({ type: 'SKIP_WAITING' });

        return new Promise((resolve) => {
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            resolve(true);
          }, { once: true });
        });
      },
    };

  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
}

/**
 * Show update notification to user
 */
function showUpdateNotification() {
  // Create a simple notification
  const notification = document.createElement('div');
  notification.id = 'sw-update-notification';
  notification.className = `
    fixed bottom-4 right-4 bg-liturgical-gold text-white p-4 rounded-lg shadow-lg z-50
    max-w-sm no-print transform translate-y-0 transition-transform duration-300
  `;

  notification.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex-1 mr-3">
        <div class="text-sm font-medium">Update Available</div>
        <div class="text-xs opacity-90 mt-1">New features and improvements are ready.</div>
      </div>
      <button id="sw-update-btn" class="bg-white text-liturgical-gold px-3 py-1 rounded text-xs font-medium hover:bg-gray-100">
        Update
      </button>
      <button id="sw-dismiss-btn" class="ml-2 text-white hover:bg-white/20 rounded p-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;

  // Remove existing notification
  const existing = document.getElementById('sw-update-notification');
  if (existing) {
    existing.remove();
  }

  document.body.appendChild(notification);

  // Handle update button
  const updateBtn = document.getElementById('sw-update-btn');
  updateBtn?.addEventListener('click', async () => {
    updateBtn.textContent = 'Updating...';
    updateBtn.setAttribute('disabled', 'true');

    // Trigger update
    const registration = await navigator.serviceWorker.ready;
    const waiting = registration.waiting;

    if (waiting) {
      waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  });

  // Handle dismiss button
  const dismissBtn = document.getElementById('sw-dismiss-btn');
  dismissBtn?.addEventListener('click', () => {
    notification.remove();
  });

  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    notification.remove();
  }, 10000);
}

/**
 * Show install notification for PWA
 */
function showInstallNotification() {
  console.log('Catholic Missal is ready for offline use!');

  // Show a subtle toast notification
  const notification = document.createElement('div');
  notification.className = `
    fixed top-4 right-4 bg-liturgical-green text-white p-3 rounded-lg shadow-lg z-50
    max-w-sm no-print transform translate-x-0 transition-transform duration-300
  `;

  notification.innerHTML = `
    <div class="flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <div>
        <div class="text-sm font-medium">Ready for offline use</div>
        <div class="text-xs opacity-90">You can now use the Missal without an internet connection.</div>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

/**
 * Check if the app can be installed as PWA
 */
export function setupPWAInstallPrompt(): void {
  let deferredPrompt: unknown = null;

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install button or notification
    showPWAInstallPrompt(deferredPrompt);
  });

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('Catholic Missal installed as PWA');
    deferredPrompt = null;

    // Hide install prompt if visible
    const installPrompt = document.getElementById('pwa-install-prompt');
    if (installPrompt) {
      installPrompt.remove();
    }
  });
}

/**
 * Show PWA install prompt
 */
function showPWAInstallPrompt(deferredPrompt: unknown) {
  // Don't show if already dismissed recently
  const lastDismissed = localStorage.getItem('pwa-install-dismissed');
  if (lastDismissed && Date.now() - parseInt(lastDismissed) < 7 * 24 * 60 * 60 * 1000) {
    return; // Don't show for 7 days after dismissal
  }

  const installPrompt = document.createElement('div');
  installPrompt.id = 'pwa-install-prompt';
  installPrompt.className = `
    fixed bottom-4 left-4 bg-white border-2 border-liturgical-gold p-4 rounded-lg shadow-lg z-50
    max-w-sm no-print
  `;

  installPrompt.innerHTML = `
    <div class="flex items-start">
      <div class="text-liturgical-gold mr-3 mt-1">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <div class="flex-1">
        <div class="text-sm font-medium text-text-primary mb-1">Install Catholic Missal</div>
        <div class="text-xs text-text-secondary mb-3">Add to your home screen for easy access to daily readings</div>
        <div class="flex gap-2">
          <button id="pwa-install-btn" class="bg-liturgical-gold text-white px-3 py-1 rounded text-xs font-medium hover:bg-liturgical-gold/90">
            Install
          </button>
          <button id="pwa-dismiss-btn" class="text-text-secondary px-3 py-1 rounded text-xs hover:bg-gray-100">
            Not now
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(installPrompt);

  // Handle install button
  const installBtn = document.getElementById('pwa-install-btn');
  installBtn?.addEventListener('click', async () => {
    installPrompt.remove();

    if (deferredPrompt && typeof deferredPrompt === 'object' && 'prompt' in deferredPrompt) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (deferredPrompt as any).prompt();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (deferredPrompt as any).userChoice;
      console.log(`User ${result.outcome} the install prompt`);
      deferredPrompt = null;
    }
  });

  // Handle dismiss button
  const dismissBtn = document.getElementById('pwa-dismiss-btn');
  dismissBtn?.addEventListener('click', () => {
    installPrompt.remove();
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  });
}